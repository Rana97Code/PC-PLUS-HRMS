const express = require("express");
const { Op, fn, col, literal } = require("sequelize");
const Transaction = require("../models/Transaction");
const Balance = require("../models/Balance");
const User = require("../models/auth/User");
const Due = require("../models/Due");

const { getCurrentActiveUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/pcplus/api/transaction/get_transction_details/:t_id", getCurrentActiveUser, async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.t_id);

        if (!transaction) {
            return res.status(404).json({ detail: "Transaction not found" });
        }

        return res.json(transaction);
    } catch (error) {
        return res.status(500).json({ detail: error.message });
    }
});

router.post("/pcplus/api/transaction/add-multiple-transaction", getCurrentActiveUser, async (req, res) => {
    const dbTransaction = await Transaction.sequelize.transaction();

    try {
        const transactions = req.body;

        if (!Array.isArray(transactions) || transactions.length === 0) {
            await dbTransaction.rollback();
            return res.status(400).json({ detail: "No transaction found" });
        }

        const lastTransaction = await Transaction.findOne({
            order: [["id", "DESC"]],
            transaction: dbTransaction
        });

        const nextId = lastTransaction ? lastTransaction.id + 1 : 1;

        const today = new Date();
        const dateText = today.toISOString().slice(0, 10).replace(/-/g, "");

        const TransactionInv = `TRN-${dateText}-${String(nextId).padStart(4, "0")}`;

        const creator = await User.findOne({
            where: { user_email: transactions[0].created_by },
            transaction: dbTransaction
        });

        if (!creator) {
            await dbTransaction.rollback();
            return res.status(404).json({ detail: "Creator user not found" });
        }

        const lastBalance = await Balance.findOne({
            order: [["id", "DESC"]],
            transaction: dbTransaction
        });

        const pre_cost = Number(lastBalance?.current_cost || 0);
        const pre_payable_due = Number(lastBalance?.payable_due || 0);
        const pre_receivable_due = Number(lastBalance?.receivable_due || 0);
        const pre_balance = Number(lastBalance?.current_balance || 0);

        let total_amount_in = 0;
        let total_amount_out = 0;
        let total_cost = 0;
        let total_return = 0;

        let total_payable_due = 0;
        let total_receivable_due = 0;

        for (const item of transactions) {
            const amount_in = Number(item.amount_in || 0);
            const amount_out = Number(item.amount_out || 0);
            const cost = Number(item.cost || 0);
            const due_amount = Number(item.due_amount || 0);
            const return_amount = Number(item.return_amount || 0);

            total_amount_in += amount_in;
            total_amount_out += amount_out;
            total_cost += cost;
            total_return += return_amount;

            if (due_amount > 0) {
                if (item.transaction_type === "Credit") {
                    total_receivable_due += due_amount;
                }

                if (item.transaction_type === "Debit") {
                    total_payable_due += due_amount;
                }
            }

            await Transaction.create({
                transaction_date: item.transaction_date,
                transaction_type: item.transaction_type,
                transaction_title: item.transaction_title,
                transaction_by: item.transaction_by,
                transaction_to: item.transaction_to,
                transaction_invoice: TransactionInv,
                amount_in,
                amount_out,
                cost,
                due_amount,
                return_amount,
                transaction_notes: item.transaction_notes,

                // if due amount exists, this invoice is available for due processing
                status: due_amount > 0 ? 1 : 0,

                created_by: creator.id
            }, { transaction: dbTransaction });
        }

        const new_balance =
            pre_balance +
            total_amount_in +
            total_return -
            total_amount_out;

        const new_payable_due = pre_payable_due + total_payable_due;
        const new_receivable_due = pre_receivable_due + total_receivable_due;

        await Balance.create({
            previous_cost: pre_cost,
            current_cost: pre_cost + total_cost,

            payable_due: new_payable_due,
            receivable_due: new_receivable_due,

            previous_balance: pre_balance,
            current_balance: new_balance,

            status: 1,
            created_by: creator.id
        }, { transaction: dbTransaction });

        await dbTransaction.commit();

        return res.json({
            success: true,
            message: "Transactions created successfully",
            invoice_no: TransactionInv,

            previous_balance: pre_balance,
            current_balance: new_balance,

            previous_payable_due: pre_payable_due,
            current_payable_due: new_payable_due,

            previous_receivable_due: pre_receivable_due,
            current_receivable_due: new_receivable_due,

            total_amount_in,
            total_amount_out,
            total_cost,
            total_return,
            total_payable_due,
            total_receivable_due
        });

    } catch (error) {
        await dbTransaction.rollback();
        return res.status(400).json({
            detail: `Transaction failed: ${error.message}`
        });
    }
});



router.get("/pcplus/api/transaction/all_transaction", getCurrentActiveUser, async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

        const requestedLimit = parseInt(req.query.limit, 10) || 10;
        const allowedLimits = [10, 20, 30, 50, 100];

        const limit = allowedLimits.includes(requestedLimit)
            ? requestedLimit
            : 10;

            const offset = (page - 1) * limit;

            const search = req.query.search?.trim() || "";

            const sortBy = [
                "id",
                "transaction_invoice",
                "transaction_type",
                "transaction_title",
                "transaction_date",
                "amount_in",
                "amount_out",
                "transaction_by"
            ].includes(req.query.sortBy)
                ? req.query.sortBy
                : "id";

            const sortDirection =
                req.query.sortDirection?.toUpperCase() === "ASC"
                    ? "ASC"
                    : "DESC";

            const whereCondition = search
                ? {
                      [Op.or]: [
                          {
                              transaction_invoice: {
                                  [Op.like]: `%${search}%`
                              }
                          },
                          {
                              transaction_type: {
                                  [Op.like]: `%${search}%`
                              }
                          },
                          {
                              transaction_title: {
                                  [Op.like]: `%${search}%`
                              }
                          },
                          {
                              transaction_date: {
                                  [Op.like]: `%${search}%`
                              }
                          },
                          {
                              transaction_by: {
                                  [Op.like]: `%${search}%`
                              }
                          }
                      ]
                  }
                : {};

            const { count, rows } = await Transaction.findAndCountAll({
                where: whereCondition,

                attributes: [
                    "id",
                    "transaction_invoice",
                    "transaction_type",
                    "transaction_title",
                    "transaction_date",
                    "amount_in",
                    "amount_out",
                    "transaction_by"
                ],

                order: [[sortBy, sortDirection]],

                limit,
                offset
            });

            return res.json({
                data: rows,
                pagination: {
                    current_page: page,
                    per_page: limit,
                    total_records: count,
                    total_pages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            console.error("Error fetching transactions:", error);

            return res.status(500).json({
                detail: "Failed to fetch transactions"
            });
        }
    }
);

router.get("/pcplus/api/transaction/transaction_invoice/:id", getCurrentActiveUser, async (req, res) => {
    const firstTransaction = await Transaction.findByPk(req.params.id);

    if (!firstTransaction) {
        return res.status(404).json({ detail: "Transaction not found" });
    }

    const invoice_no = firstTransaction.transaction_invoice;

    const creator = await User.findByPk(firstTransaction.created_by);

    const transactions = await Transaction.findAll({
        where: { transaction_invoice: invoice_no }
    });

    let total_amount_in = 0;
    let total_amount_out = 0;
    let total_cost = 0;
    let total_due = 0;
    let total_return = 0;

    const items = transactions.map(t => {
        total_amount_in += Number(t.amount_in || 0);
        total_amount_out += Number(t.amount_out || 0);
        total_cost += Number(t.cost || 0);
        total_due += Number(t.due_amount || 0);
        total_return += Number(t.return_amount || 0);

        return {
            id: t.id,
            transaction_date: t.transaction_date,
            transaction_type: t.transaction_type,
            transaction_title: t.transaction_title,
            transaction_by: t.transaction_by,
            transaction_to: t.transaction_to,
            amount_in: t.amount_in,
            amount_out: t.amount_out,
            cost: t.cost,
            due_amount: t.due_amount,
            return_amount: t.return_amount,
            transaction_notes: t.transaction_notes
        };
    });

    return res.json({
        invoice_no,
        invoice_date: firstTransaction.transaction_date,
        created_by: creator ? creator.user_name : null,
        total_amount_in,
        total_amount_out,
        total_cost,
        total_due,
        total_return,
        items
    });
});


function parseInvestmentFilter(query) {
    const year =
        query.year !== undefined &&
        query.year !== null &&
        query.year !== ""
            ? Number(query.year)
            : null;

    const month =
        query.month !== undefined &&
        query.month !== null &&
        query.month !== ""
            ? Number(query.month)
            : null;

    if (
        year !== null &&
        (!Number.isInteger(year) ||
            year < 1900 ||
            year > 2200)
    ) {
        const error = new Error("Invalid year");
        error.statusCode = 400;
        throw error;
    }

    if (
        month !== null &&
        (!Number.isInteger(month) ||
            month < 1 ||
            month > 12)
    ) {
        const error = new Error("Invalid month");
        error.statusCode = 400;
        throw error;
    }

    if (month !== null && year === null) {
        const error = new Error(
            "Please select a year before selecting a month"
        );

        error.statusCode = 400;
        throw error;
    }

    return {
        year,
        month
    };
}

/**
 * Creates YYYY-MM-DD without timezone conversion.
 */
function makeDateString(year, month, day) {
    const formattedMonth = String(month).padStart(
        2,
        "0"
    );

    const formattedDay = String(day).padStart(
        2,
        "0"
    );

    return `${year}-${formattedMonth}-${formattedDay}`;
}

/**
 * Returns the final day of a month.
 */
function getLastDayOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * Common investment query.
 */
function buildInvestmentWhere(
    query,
    additionalWhere = {}
) {
    const { year, month } =
        parseInvestmentFilter(query);

    const whereCondition = {
        transaction_type: "Credit",
        transaction_title: "Office_Investment",

        amount_in: {
            [Op.gt]: 0
        },

        ...additionalWhere
    };

    /*
     * Specific month of a specific year.
     *
     * Example:
     * startDate = 2026-06-01
     * endDate   = 2026-06-30
     */
    if (year !== null && month !== null) {
        const lastDay =
            getLastDayOfMonth(year, month);

        const startDate =
            makeDateString(year, month, 1);

        const endDate =
            makeDateString(
                year,
                month,
                lastDay
            );

        whereCondition.transaction_date = {
            [Op.between]: [
                startDate,
                endDate
            ]
        };
    }

    /*
     * Entire selected year.
     */
    if (year !== null && month === null) {
        whereCondition.transaction_date = {
            [Op.between]: [
                `${year}-01-01`,
                `${year}-12-31`
            ]
        };
    }

    return whereCondition;
}

/**
 * Returns years that contain Office Investment.
 */
async function getInvestmentYears() {
    const rows = await Transaction.findAll({
        attributes: [
            [
                fn(
                    "YEAR",
                    col("transaction_date")
                ),
                "year"
            ]
        ],

        where: {
            transaction_type: "Credit",
            transaction_title: "Office_Investment",

            amount_in: {
                [Op.gt]: 0
            }
        },

        group: [
            fn(
                "YEAR",
                col("transaction_date")
            )
        ],

        order: [
            [
                fn(
                    "YEAR",
                    col("transaction_date")
                ),
                "DESC"
            ]
        ],

        raw: true
    });

    return rows
        .map((item) => Number(item.year))
        .filter((year) =>
            Number.isInteger(year)
        );
}


function buildCreditTransactionWhere(
    query,
    transactionTitle,
    additionalWhere = {}
) {
    const { year, month } =
        parseInvestmentFilter(query);

    const whereCondition = {
        transaction_type: "Credit",
        transaction_title: transactionTitle,

        amount_in: {
            [Op.gt]: 0
        },

        ...additionalWhere
    };

    if (year !== null && month !== null) {
        const lastDay =
            getLastDayOfMonth(year, month);

        const startDate =
            makeDateString(year, month, 1);

        const endDate =
            makeDateString(
                year,
                month,
                lastDay
            );

        whereCondition.transaction_date = {
            [Op.between]: [
                startDate,
                endDate
            ]
        };
    } else if (
        year !== null &&
        month === null
    ) {
        whereCondition.transaction_date = {
            [Op.between]: [
                `${year}-01-01`,
                `${year}-12-31`
            ]
        };
    }

    return whereCondition;
}

function buildDebitCostWhere(query) {
    const { year, month } = parseInvestmentFilter(query);

    const whereCondition = {
        transaction_type: "Debit",

        cost: {
            [Op.gt]: 0
        }
    };

    // Specific month of a selected year
    if (year !== null && month !== null) {
        const lastDay = getLastDayOfMonth(year, month);

        const startDate = makeDateString(
            year,
            month,
            1
        );

        const endDate = makeDateString(
            year,
            month,
            lastDay
        );

        whereCondition.transaction_date = {
            [Op.between]: [
                startDate,
                endDate
            ]
        };
    }

    // Entire selected year
    else if (year !== null) {
        whereCondition.transaction_date = {
            [Op.between]: [
                `${year}-01-01`,
                `${year}-12-31`
            ]
        };
    }

    return whereCondition;
}

router.get("/pcplus/api/accounts/latest-balance",getCurrentActiveUser,
    async (req, res) => {
        try {
            const { year, month } =
                parseInvestmentFilter(req.query);

            const [
                balance,
                investmentResult,
                incomeResult,
                costResult,
                availableYears
            ] = await Promise.all([
                // Latest overall balance data
                Balance.findOne({
                    order: [["id", "DESC"]],
                    raw: true
                }),

                // Total Investment
                Transaction.findOne({
                    attributes: [
                        [
                            fn(
                                "COALESCE",
                                fn(
                                    "SUM",
                                    col("amount_in")
                                ),
                                0
                            ),
                            "total_investment"
                        ]
                    ],

                    where:
                        buildCreditTransactionWhere(
                            req.query,
                            "Office_Investment"
                        ),

                    raw: true
                }),

                // Total Income
                Transaction.findOne({
                    attributes: [
                        [
                            fn(
                                "COALESCE",
                                fn(
                                    "SUM",
                                    col("amount_in")
                                ),
                                0
                            ),
                            "total_income"
                        ]
                    ],

                    where:
                        buildCreditTransactionWhere(
                            req.query,
                            "Service_Sales"
                        ),

                    raw: true
                }),

                // Total Cost
                Transaction.findOne({
                    attributes: [
                        [
                            fn(
                                "COALESCE",
                                fn(
                                    "SUM",
                                    col("cost")
                                ),
                                0
                            ),
                            "total_cost"
                        ]
                    ],

                    where:
                        buildDebitCostWhere(
                            req.query
                        ),

                    raw: true
                }),

                getInvestmentYears()
            ]);

            const balanceData = balance || {
                previous_cost: 0,
                current_cost: 0,
                payable_due: 0,
                receivable_due: 0,
                previous_balance: 0,
                current_balance: 0
            };

            return res.json({
                ...balanceData,

                total_investment: Number(
                    investmentResult
                        ?.total_investment || 0
                ),

                total_income: Number(
                    incomeResult
                        ?.total_income || 0
                ),

                total_cost: Number(
                    costResult?.total_cost || 0
                ),

                selected_filter: {
                    year,
                    month
                },

                available_years:
                    availableYears
            });
        } catch (error) {
            console.error(
                "Latest balance error:",
                error
            );

            return res
                .status(error.statusCode || 500)
                .json({
                    detail:
                        error.message ||
                        "Failed to fetch accounts summary"
                });
        }
    }
);


router.get("/pcplus/api/accounts/investor-contribution", getCurrentActiveUser, async (req, res) => {
    try {
        const { year, month } =
            parseInvestmentFilter(req.query);

            const rows =
                await Transaction.findAll({
                    attributes: [
                        [
                            "transaction_by",
                            "investor_name"
                        ],

                        [
                            fn(
                                "SUM",
                                col("amount_in")
                            ),
                            "total_amount_in"
                        ],

                        [
                            fn(
                                "COUNT",
                                col("id")
                            ),
                            "total_transaction"
                        ]
                    ],

                    where: buildInvestmentWhere(
                        req.query
                    ),

                    group: [
                        "transaction_by"
                    ],

                    order: [
                        [
                            fn(
                                "SUM",
                                col("amount_in")
                            ),
                            "DESC"
                        ]
                    ],

                    raw: true
                });

            const data = rows.map((item) => ({
                investor_name:
                    item.investor_name ||
                    "Unknown Investor",

                total_amount_in: Number(
                    item.total_amount_in || 0
                ),

                total_transaction: Number(
                    item.total_transaction || 0
                )
            }));

            return res.json({
                data,

                summary: {
                    total_investment:
                        data.reduce(
                            (total, item) =>
                                total +
                                Number(
                                    item.total_amount_in ||
                                        0
                                ),
                            0
                        ),

                    total_investors:
                        data.length,

                    total_transactions:
                        data.reduce(
                            (total, item) =>
                                total +
                                Number(
                                    item.total_transaction ||
                                        0
                                ),
                            0
                        )
                },

                selected_filter: {
                    year,
                    month
                }
            });
        } catch (error) {
            console.error(
                "Investor contribution error:",
                error
            );

            return res
                .status(error.statusCode || 500)
                .json({
                    detail:
                        error.message ||
                        "Failed to fetch investor contributions"
                });
        }
    }
);


router.get(
    "/pcplus/api/accounts/investor-contribution/:investor_name",
    getCurrentActiveUser,
    async (req, res) => {
        try {
            const { year, month } =
                parseInvestmentFilter(req.query);

            const investorName =
                req.params.investor_name.trim();

            if (!investorName) {
                return res.status(400).json({
                    detail:
                        "Investor name is required"
                });
            }

            const rows =
                await Transaction.findAll({
                    where: buildInvestmentWhere(
                        req.query,
                        {
                            transaction_by:
                                investorName
                        }
                    ),

                    order: [
                        [
                            "transaction_date",
                            "DESC"
                        ],
                        ["id", "DESC"]
                    ],

                    raw: true
                });

            const totalInvestment =
                rows.reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.amount_in || 0
                        ),
                    0
                );

            return res.json({
                data: rows,

                summary: {
                    investor_name:
                        investorName,

                    total_investment:
                        totalInvestment,

                    total_transaction:
                        rows.length
                },

                selected_filter: {
                    year,
                    month
                }
            });
        } catch (error) {
            console.error(
                "Investor details error:",
                error
            );

            return res
                .status(error.statusCode || 500)
                .json({
                    detail:
                        error.message ||
                        "Failed to fetch investor details"
                });
        }
    }
);


router.get("/pcplus/api/accounts/monthly-chart", getCurrentActiveUser, async (req, res) => {
    try {
        const officeInvestment = Array(12).fill(0);
        const income = Array(12).fill(0);
        const expenses = Array(12).fill(0);
        const profit = Array(12).fill(0);

        const transactions = await Transaction.findAll({
            attributes: [
                "id",
                "transaction_date",
                "transaction_type",
                "transaction_title",
                "amount_in",
                "amount_out",
                "return_amount",
            ],
            raw: true,
        });

        transactions.forEach((row) => {
            if (!row.transaction_date) return;

            const monthIndex = new Date(row.transaction_date).getMonth();

            const amountIn = Number(row.amount_in || 0);
            const amountOut = Number(row.amount_out || 0);
            const returnAmount = Number(row.return_amount || 0);

            if (row.transaction_type === "Credit") {
                if (row.transaction_title === "Office_Investment") {
                    officeInvestment[monthIndex] += amountIn + returnAmount;
                }

                if (row.transaction_title === "Service_Sales") {
                    income[monthIndex] += amountIn + returnAmount;
                }
            }

            if (row.transaction_type === "Debit") {
                expenses[monthIndex] += amountOut;
            }
        });

        const paidDues = await Due.findAll({
            attributes: [
                "id",
                "transaction_id",
                "due_type",
                "paid_amount",
                "updated_at",
            ],
            where: {
                paid_amount: {
                    [Op.gt]: 0,
                },
            },
            raw: true,
        });

        const transactionIds = paidDues
            .map((item) => item.transaction_id)
            .filter((id) => id !== null && id !== undefined);

        const relatedTransactions = await Transaction.findAll({
            attributes: ["id", "transaction_title", "transaction_type"],
            where: {
                id: {
                    [Op.in]: transactionIds.length > 0 ? transactionIds : [0],
                },
            },
            raw: true,
        });

        const transactionMap = {};

        relatedTransactions.forEach((item) => {
            transactionMap[item.id] = item;
        });

        paidDues.forEach((row) => {
            if (!row.updated_at) return;

            const monthIndex = new Date(row.updated_at).getMonth();
            const paidAmount = Number(row.paid_amount || 0);
            const relatedTransaction = transactionMap[row.transaction_id];

            if (row.due_type === "Credit") {
                if (relatedTransaction?.transaction_title === "Office_Investment") {
                    officeInvestment[monthIndex] += paidAmount;
                } else {
                    income[monthIndex] += paidAmount;
                }
            }

            if (row.due_type === "Debit") {
                expenses[monthIndex] += paidAmount;
            }
        });

        for (let i = 0; i < 12; i++) {
            officeInvestment[i] = Number(officeInvestment[i].toFixed(2));
            income[i] = Number(income[i].toFixed(2));
            expenses[i] = Number(expenses[i].toFixed(2));
            profit[i] = Number((income[i] - expenses[i]).toFixed(2));
        }

        return res.json({
            office_investment: officeInvestment,
            income,
            expenses,
            profit,
        });
    } catch (error) {
        return res.status(500).json({
            detail: error.message,
        });
    }
});

router.get("/pcplus/api/accounts/cost-pie-chart", getCurrentActiveUser, async (req, res) => {
    const today = new Date();

    const formatDate = d => d.toISOString().slice(0, 10);

    const todayStr = formatDate(today);



    // Saturday start
    const daysSinceSaturday = (today.getDay() + 1) % 7;

    const startThisWeek = new Date(today);
    startThisWeek.setDate(today.getDate() - daysSinceSaturday);
    startThisWeek.setHours(0, 0, 0, 0);

    const endThisWeek = new Date(startThisWeek);
    endThisWeek.setDate(startThisWeek.getDate() + 6);
    endThisWeek.setHours(23, 59, 59, 999);



    


    const startThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastMonthEnd = new Date(startThisMonth);
    lastMonthEnd.setDate(0);

    const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);

    const sumAmountOut = async (where) => {
        const value = await Transaction.sum("amount_out", { where });
        return Number(value || 0);
    };

    const today_cost = await sumAmountOut({
        transaction_date: todayStr
    });



    const this_week = await sumAmountOut({
        transaction_date: {
            [Op.between]: [formatDate(startThisWeek), formatDate(endThisWeek)]
        }
    });


    const this_month = await sumAmountOut({
        transaction_date: {
            [Op.between]: [formatDate(startThisMonth), todayStr]
        }
    });

    const last_month = await sumAmountOut({
        transaction_date: {
            [Op.between]: [formatDate(lastMonthStart), formatDate(lastMonthEnd)]
        }
    });

    return res.json({
        series: [
            Number(today_cost.toFixed(2)),
            Number(this_week.toFixed(2)),
            Number(this_month.toFixed(2)),
            Number(last_month.toFixed(2))
        ],
        labels: ["Today", "This Week", "This Month", "Last Month"]
    });
});

module.exports = router;
const express = require("express");
const { Op, fn, col, literal } = require("sequelize");

const Transaction = require("../models/Transaction");
const Balance = require("../models/Balance");
const User = require("../models/auth/User");
const Due = require("../models/Due");

const { getCurrentActiveUser } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/pcplus/api/due/all_due", getCurrentActiveUser, async (req, res) => {
    try {
        const rows = await Due.findAll({
            order: [["id", "DESC"]]
        });

        return res.json(rows);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch due list",
            error: err.message
        });
    }
});



router.get("/pcplus/api/due/available-invoices/:due_type", getCurrentActiveUser, async (req, res) => {
    try {
        const { due_type } = req.params; // Credit, Debit, Completed

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const search = req.query.search || "";
        const offset = (page - 1) * limit;

        if (!["Credit", "Debit", "Completed"].includes(due_type)) {
            return res.status(400).json({ detail: "Invalid due type" });
        }

        let finalRows = [];

        // Paid list: only due table status 0
        if (due_type === "Completed") {
            const completedDues = await Due.findAll({
                where: {
                    status: 0,
                    ...(search && {
                        [Op.or]: [
                            { transaction_invoice: { [Op.like]: `%${search}%` } },
                            { party_name: { [Op.like]: `%${search}%` } },
                        ],
                    }),
                },
                order: [["id", "DESC"]],
            });

            finalRows = completedDues.map((item) => ({
                source_type: "due",
                source_id: item.id,
                transaction_invoice: item.transaction_invoice,
                party_name: item.party_name,
                due_type: item.due_type,
                total_due: Number(item.total_due || 0),
                paid_amount: Number(item.paid_amount || 0),
                remaining_due: Number(item.remaining_due || 0),
                status: "Paid",
            }));
        } else {
            const transactions = await Transaction.findAll({
                where: {
                    status: 1,
                    transaction_type: due_type,
                    due_amount: { [Op.gt]: 0 },
                    ...(search && {
                        [Op.or]: [
                            { transaction_invoice: { [Op.like]: `%${search}%` } },
                            { transaction_by: { [Op.like]: `%${search}%` } },
                            { transaction_to: { [Op.like]: `%${search}%` } },
                        ],
                    }),
                },
                order: [["id", "DESC"]],
            });

            const dues = await Due.findAll({
                where: {
                    status: 1,
                    due_type,
                    remaining_due: { [Op.gt]: 0 },
                    ...(search && {
                        [Op.or]: [
                            { transaction_invoice: { [Op.like]: `%${search}%` } },
                            { party_name: { [Op.like]: `%${search}%` } },
                        ],
                    }),
                },
                order: [["id", "DESC"]],
            });

            const transactionRows = transactions.map((item) => ({
                source_type: "transaction",
                source_id: item.id,
                transaction_invoice: item.transaction_invoice,
                party_name: due_type === "Credit" ? item.transaction_to : item.transaction_by,
                due_type,
                total_due: Number(item.due_amount || 0),
                paid_amount: 0,
                remaining_due: Number(item.due_amount || 0),
                status: "Due",
            }));

            const dueRows = dues.map((item) => ({
                source_type: "due",
                source_id: item.id,
                transaction_invoice: item.transaction_invoice,
                party_name: item.party_name,
                due_type: item.due_type,
                total_due: Number(item.total_due || 0),
                paid_amount: Number(item.paid_amount || 0),
                remaining_due: Number(item.remaining_due || 0),
                status: Number(item.paid_amount || 0) > 0 ? "Partial" : "Due",
            }));

            finalRows = [...transactionRows, ...dueRows];
        }

        const total = finalRows.length;
        const paginatedRows = finalRows.slice(offset, offset + limit);

        return res.status(200).json({
            data: paginatedRows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ detail: error.message });
    }
});

router.get("/pcplus/api/due/payment-invoice/:source_type/:source_id/:due_type", getCurrentActiveUser, async (req, res) => {
    try {
        const { source_type, source_id, due_type } = req.params;

        if (!["transaction", "due"].includes(source_type)) {
            return res.status(400).json({ detail: "Invalid source type" });
        }

        if (!["Credit", "Debit", "Completed"].includes(due_type)) {
            return res.status(400).json({ detail: "Invalid due type" });
        }

        if (source_type === "transaction") {
            if (due_type === "Completed") {
                return res.status(400).json({
                    detail: "Completed due is only available from due table",
                });
            }

            const item = await Transaction.findOne({
                where: {
                    id: source_id,
                    status: 1,
                    transaction_type: due_type,
                    due_amount: { [Op.gt]: 0 },
                },
            });

            if (!item) {
                return res.status(404).json({ detail: "Transaction invoice not found" });
            }

            return res.json({
                source_type: "transaction",
                source_id: item.id,
                transaction_invoice: item.transaction_invoice,
                party_name: due_type === "Credit" ? item.transaction_to : item.transaction_by,
                due_type,
                total_due: item.due_amount,
                paid_amount: 0,
                remaining_due: item.due_amount,
                note: item.transaction_notes,
                status: "Due",
            });
        }

        if (source_type === "due") {
            const whereCondition =
                due_type === "Completed"
                    ? {
                          id: source_id,
                          status: 0,
                      }
                    : {
                          id: source_id,
                          due_type,
                          status: 1,
                          remaining_due: { [Op.gt]: 0 },
                      };

            const item = await Due.findOne({
                where: whereCondition,
            });

            if (!item) {
                return res.status(404).json({ detail: "Due invoice not found" });
            }

            return res.json({
                source_type: "due",
                source_id: item.id,
                transaction_invoice: item.transaction_invoice,
                party_name: item.party_name,
                due_type: item.due_type,
                total_due: item.total_due,
                paid_amount: item.paid_amount,
                remaining_due: item.remaining_due,
                note: item.note,
                status:
                    Number(item.status) === 0
                        ? "Paid"
                        : Number(item.paid_amount) > 0
                        ? "Partial"
                        : "Due",
            });
        }
    } catch (error) {
        return res.status(500).json({ detail: error.message });
    }
});

router.post("/pcplus/api/due/process-due", getCurrentActiveUser, async (req, res) => {
    const dbTransaction = await Due.sequelize.transaction();

    try {
        const {
            source_type,
            source_id,
            transaction_invoice,
            party_name,
            due_type,
            total_due,
            paid_amount,
            remaining_due,
            note,
            created_by,
            due_date,
        } = req.body;

        const payAmount = Number(paid_amount || 0);
        const totalDue = Number(total_due || 0);

        if (!["transaction", "due"].includes(source_type)) {
            await dbTransaction.rollback();
            return res.status(400).json({ detail: "Invalid source type" });
        }

        if (!["Credit", "Debit"].includes(due_type)) {
            await dbTransaction.rollback();
            return res.status(400).json({ detail: "Invalid due type" });
        }

        if (payAmount <= 0) {
            await dbTransaction.rollback();
            return res.status(400).json({ detail: "Amount must be greater than 0" });
        }

        const creator = await User.findOne({
            where: { user_email: created_by },
            transaction: dbTransaction,
        });

        if (!creator) {
            await dbTransaction.rollback();
            return res.status(404).json({ detail: "Creator user not found" });
        }

        const lastBalance = await Balance.findOne({
            order: [["id", "DESC"]],
            transaction: dbTransaction,
        });

        const pre_cost = Number(lastBalance?.current_cost || 0);
        const pre_payable_due = Number(lastBalance?.payable_due || 0);
        const pre_receivable_due = Number(lastBalance?.receivable_due || 0);
        const pre_balance = Number(lastBalance?.current_balance || 0);

        let current_cost = pre_cost;
        let payable_due = pre_payable_due;
        let receivable_due = pre_receivable_due;
        let current_balance = pre_balance;

        if (due_type === "Credit") {
            receivable_due = pre_receivable_due - payAmount;
            current_balance = pre_balance + payAmount;
        }

        if (due_type === "Debit") {
            payable_due = pre_payable_due - payAmount;
            current_balance = pre_balance - payAmount;
            current_cost = pre_cost + payAmount;
        }

        let newRemaining = 0;
        let newPaid = 0;
        let dueRecord = null;

        if (source_type === "transaction") {
            const transactionRow = await Transaction.findOne({
                where: {
                    id: source_id,
                    status: 1,
                    transaction_type: due_type,
                    due_amount: { [Op.gt]: 0 },
                },
                transaction: dbTransaction,
            });

            if (!transactionRow) {
                await dbTransaction.rollback();
                return res.status(404).json({ detail: "Transaction invoice not found" });
            }

            const transactionDue = Number(transactionRow.due_amount || 0);

            if (payAmount > transactionDue) {
                await dbTransaction.rollback();
                return res.status(400).json({
                    detail: `Amount cannot be greater than remaining due ${transactionDue}`,
                });
            }

            newPaid = payAmount;
            newRemaining = transactionDue - payAmount;

            await transactionRow.update(
                {
                    status: 0,
                    updated_at: new Date(),
                    updated_by: creator.id,
                },
                { transaction: dbTransaction }
            );

            dueRecord = await Due.create(
                {
                    transaction_id: transactionRow.id,
                    transaction_invoice,
                    party_name,
                    due_type,
                    total_due: transactionDue,
                    paid_amount: newPaid,
                    remaining_due: newRemaining,
                    status: newRemaining > 0 ? 1 : 0,
                    note,
                    due_date,
                    created_by: creator.id,
                    updated_at: new Date(),
                },
                { transaction: dbTransaction }
            );
        }

        if (source_type === "due") {
            const dueRow = await Due.findOne({
                where: {
                    id: source_id,
                },
                transaction: dbTransaction,
            });

            if (!dueRow) {
                await dbTransaction.rollback();
                return res.status(404).json({ detail: "Due invoice not found" });
            }

            const oldPaid = Number(dueRow.paid_amount || 0);
            const oldRemaining = Number(dueRow.remaining_due || 0);

            if (oldRemaining <= 0) {
                await dbTransaction.rollback();
                return res.status(400).json({ detail: "This due is already paid" });
            }

            if (payAmount > oldRemaining) {
                await dbTransaction.rollback();
                return res.status(400).json({
                    detail: `Amount cannot be greater than remaining due ${oldRemaining}`,
                });
            }

            newPaid = oldPaid + payAmount;
            newRemaining = oldRemaining - payAmount;

            await dueRow.update(
                {
                    paid_amount: newPaid,
                    remaining_due: newRemaining,
                    status: newRemaining > 0 ? 1 : 0,
                    note,
                    updated_at: new Date(),
                },
                { transaction: dbTransaction }
            );

            dueRecord = dueRow;
        }

        await Balance.create(
            {
                previous_cost: pre_cost,
                current_cost,

                payable_due,
                receivable_due,

                previous_balance: pre_balance,
                current_balance,

                status: 1,
                created_by: creator.id,
            },
            { transaction: dbTransaction }
        );

        await dbTransaction.commit();

        return res.json({
            success: true,
            message: due_type === "Credit" ? "Due received successfully" : "Due paid successfully",
            due_id: dueRecord?.id,
            source_type,
            source_id,
            due_type,
            paid_now: payAmount,
            total_paid: newPaid,
            remaining_due: newRemaining,
            previous_balance: pre_balance,
            current_balance,
            previous_payable_due: pre_payable_due,
            current_payable_due: payable_due,
            previous_receivable_due: pre_receivable_due,
            current_receivable_due: receivable_due,
        });
    } catch (error) {
        await dbTransaction.rollback();
        return res.status(400).json({
            detail: `Due process failed: ${error.message}`,
        });
    }
});

router.get("/pcplus/api/due/invoice/:source_type/:source_id/:due_type", getCurrentActiveUser, async (req, res) => {
    try {
        const { source_type, source_id, due_type } = req.params;

        if (!["transaction", "due"].includes(source_type)) {
            return res.status(400).json({ detail: "Invalid source type" });
        }

        if (!["Credit", "Debit", "Completed"].includes(due_type)) {
            return res.status(400).json({ detail: "Invalid due type" });
        }

        let invoice = null;

        if (source_type === "transaction") {
            if (due_type === "Completed") {
                return res.status(400).json({ detail: "Completed invoice only available from due table" });
            }

            const item = await Transaction.findOne({
                where: {
                    id: source_id,
                    status: 1,
                    transaction_type: due_type,
                    due_amount: { [Op.gt]: 0 },
                },
            });

            if (!item) {
                return res.status(404).json({ detail: "Transaction due invoice not found" });
            }

            invoice = {
                source_type: "transaction",
                source_id: item.id,
                invoice_no: item.transaction_invoice,
                invoice_date: item.transaction_date,
                party_name: due_type === "Credit" ? item.transaction_to : item.transaction_by,
                due_type,
                due_label: due_type === "Credit" ? "Receivable" : "Payable",
                total_due: Number(item.due_amount || 0),
                paid_amount: 0,
                remaining_due: Number(item.due_amount || 0),
                status: "Due",
                note: item.transaction_notes,
                details: [
                    {
                        date: item.transaction_date,
                        invoice: item.transaction_invoice,
                        type: due_type === "Credit" ? "Receivable Due" : "Payable Due",
                        total_due: Number(item.due_amount || 0),
                        paid_amount: 0,
                        remaining_due: Number(item.due_amount || 0),
                        status: "Due",
                        note: item.transaction_notes,
                    },
                ],
            };
        }

        if (source_type === "due") {
            const whereCondition =
                due_type === "Completed"
                    ? { id: source_id, status: 0 }
                    : {
                          id: source_id,
                          due_type,
                          status: 1,
                      };

            const item = await Due.findOne({
                where: whereCondition,
            });

            if (!item) {
                return res.status(404).json({ detail: "Due invoice not found" });
            }

            invoice = {
                source_type: "due",
                source_id: item.id,
                invoice_no: item.transaction_invoice,
                invoice_date: item.due_date || item.created_at,
                party_name: item.party_name,
                due_type: item.due_type,
                due_label: item.due_type === "Credit" ? "Receivable" : "Payable",
                total_due: Number(item.total_due || 0),
                paid_amount: Number(item.paid_amount || 0),
                remaining_due: Number(item.remaining_due || 0),
                status: Number(item.status) === 0 ? "Paid" : Number(item.paid_amount || 0) > 0 ? "Partial" : "Due",
                note: item.note,
                details: [
                    {
                        date: item.due_date || item.created_at,
                        invoice: item.transaction_invoice,
                        type: item.due_type === "Credit" ? "Received" : "Paid",
                        total_due: Number(item.total_due || 0),
                        paid_amount: Number(item.paid_amount || 0),
                        remaining_due: Number(item.remaining_due || 0),
                        status: Number(item.status) === 0 ? "Paid" : Number(item.paid_amount || 0) > 0 ? "Partial" : "Due",
                        note: item.note,
                    },
                ],
            };
        }

        return res.json(invoice);
    } catch (error) {
        return res.status(500).json({ detail: error.message });
    }
});



module.exports = router;

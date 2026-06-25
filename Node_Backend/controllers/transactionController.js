const express = require("express");
const { Op, fn, col, literal } = require("sequelize");

const Transaction = require("../models/Transaction");
const Balance = require("../models/Balance");
const User = require("../models/User");
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

        const pre_cost = lastBalance?.current_cost || 0;
        const pre_due = lastBalance?.current_due || 0;
        const pre_balance = lastBalance?.current_balance || 0;

        let total_amount_in = 0;
        let total_amount_out = 0;
        let total_cost = 0;
        let total_due = 0;
        let total_return = 0;

        for (const item of transactions) {
            const amount_in = Number(item.amount_in || 0);
            const amount_out = Number(item.amount_out || 0);
            const cost = Number(item.cost || 0);
            const due_amount = Number(item.due_amount || 0);
            const return_amount = Number(item.return_amount || 0);

            total_amount_in += amount_in;
            total_amount_out += amount_out;
            total_cost += cost;
            total_due += due_amount;
            total_return += return_amount;

            await Transaction.create({
                transaction_date: item.transaction_date,
                transaction_type: item.transaction_type,
                transaction_by: item.transaction_by,
                transaction_to: item.transaction_to,
                transaction_invoice: TransactionInv,
                amount_in,
                amount_out,
                cost,
                due_amount,
                return_amount,
                transaction_notes: item.transaction_notes,
                created_by: creator.id
            }, { transaction: dbTransaction });
        }

        const new_balance =
            pre_balance +
            total_amount_in +
            total_return -
            total_amount_out;

        await Balance.create({
            previous_cost: pre_cost,
            current_cost: pre_cost + total_cost,
            previous_due: pre_due,
            current_due: pre_due + total_due,
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
            total_amount_in,
            total_amount_out,
            total_cost,
            total_due,
            total_return
        });

    } catch (error) {
        await dbTransaction.rollback();
        return res.status(400).json({
            detail: `Transaction failed: ${error.message}`
        });
    }
});

router.get("/pcplus/api/transaction/all_transaction", getCurrentActiveUser, async (req, res) => {
    const rows = await Transaction.findAll();

    const data = rows.map(t => ({
        id: t.id,
        transaction_invoice: t.transaction_invoice,
        transaction_type: t.transaction_type,
        transaction_date: t.transaction_date,
        amount_in: t.amount_in,
        amount_out: t.amount_out,
        transaction_by: t.transaction_by
    }));

    return res.json(data);
});

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

router.get("/pcplus/api/accounts/investor-contribution", getCurrentActiveUser, async (req, res) => {
    const rows = await Transaction.findAll({
        attributes: [
            ["transaction_by", "investor_name"],
            [fn("SUM", col("amount_in")), "total_amount_in"],
            [fn("COUNT", col("id")), "total_transaction"]
        ],
        where: {
            amount_in: { [Op.gt]: 0 },
            transaction_type: "Office_Investment"
        },
        group: ["transaction_by"],
        raw: true
    });

    return res.json(rows.map(r => ({
        investor_name: r.investor_name,
        total_amount_in: Number(r.total_amount_in || 0),
        total_transaction: r.total_transaction
    })));
});

router.get("/pcplus/api/accounts/investor-contribution/:investor_name", getCurrentActiveUser, async (req, res) => {
    const rows = await Transaction.findAll({
        where: {
            transaction_by: req.params.investor_name,
            amount_in: { [Op.gt]: 0 }
        },
        order: [["id", "DESC"]]
    });

    return res.json(rows);
});

router.get("/pcplus/api/accounts/latest-balance", getCurrentActiveUser, async (req, res) => {
    const balance = await Balance.findOne({
        order: [["id", "DESC"]]
    });

    if (!balance) {
        return res.json({
            previous_cost: 0,
            current_cost: 0,
            previous_due: 0,
            current_due: 0,
            previous_balance: 0,
            current_balance: 0
        });
    }

    return res.json(balance);
});

router.get("/pcplus/api/accounts/monthly-chart", getCurrentActiveUser, async (req, res) => {
    const investmentRows = await Transaction.findAll({
        attributes: [
            [literal("MONTH(transaction_date)"), "month"],
            [fn("SUM", col("amount_in")), "amount_in"],
            [fn("SUM", col("return_amount")), "return_amount"]
        ],
        where: { transaction_type: "Office_Investment" },
        group: [literal("MONTH(transaction_date)")],
        raw: true
    });

    const incomeRows = await Transaction.findAll({
        attributes: [
            [literal("MONTH(transaction_date)"), "month"],
            [fn("SUM", col("amount_in")), "amount_in"],
            [fn("SUM", col("return_amount")), "return_amount"]
        ],
        where: { transaction_type: "Service_Sales" },
        group: [literal("MONTH(transaction_date)")],
        raw: true
    });

    const expenseRows = await Transaction.findAll({
        attributes: [
            [literal("MONTH(transaction_date)"), "month"],
            [fn("SUM", col("amount_out")), "amount_out"]
        ],
        group: [literal("MONTH(transaction_date)")],
        raw: true
    });

    const officeInvestment = Array(12).fill(0);
    const income = Array(12).fill(0);
    const expenses = Array(12).fill(0);
    const profit = Array(12).fill(0);

    investmentRows.forEach(row => {
        const idx = Number(row.month) - 1;
        officeInvestment[idx] = Number(
            (Number(row.amount_in || 0) + Number(row.return_amount || 0)).toFixed(2)
        );
    });

    incomeRows.forEach(row => {
        const idx = Number(row.month) - 1;
        const totalIncome = Number(row.amount_in || 0) + Number(row.return_amount || 0);
        income[idx] = Number(totalIncome.toFixed(2));
        profit[idx] = Number(totalIncome.toFixed(2));
    });

    expenseRows.forEach(row => {
        const idx = Number(row.month) - 1;
        expenses[idx] = Number(Number(row.amount_out || 0).toFixed(2));
    });

    return res.json({
        office_investment: officeInvestment,
        income,
        expenses,
        profit
    });
});

router.get("/pcplus/api/accounts/cost-pie-chart", getCurrentActiveUser, async (req, res) => {
    const today = new Date();

    const formatDate = d => d.toISOString().slice(0, 10);

    const todayStr = formatDate(today);

    const startThisWeek = new Date(today);
    startThisWeek.setDate(today.getDate() - today.getDay() + 1);

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
            [Op.between]: [formatDate(startThisWeek), todayStr]
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
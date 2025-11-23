import { sql } from "../config/db.js";
import { validateUser } from "../utils/validateUser.js";

export async function getTransactionByUserId(req, res) {
    try {
        const { userID } = req.params;
        const validID = await validateUser(userID, res);
        if (!validID) return;

        const transaction = await sql`
        SELECT * FROM transactions 
        WHERE user_id = ${validID} 
        ORDER BY created_at DESC
        `;

        res.status(200).json(transaction);
    } catch (error) {
        console.log("Error fetching transaction", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createTransaction(req,res){
    try {
        const {user_id, title, category, amount} = req.body;
        
        if(!user_id || !title || !category || amount == undefined){
            return res.status(400).json({message: "All fields are required."})
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id,title,category,amount)
        VALUES(${user_id}, ${title}, ${category}, ${amount})
        RETURNING *
        `
        console.log(transaction)
        res.status(201).json(transaction[0]);
    } catch (error) {
        console.log("Error creating transaction", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function deleteTransactionById(req, res) {
    try {
        const {id} = req.params;

        if(isNaN(parseInt(id))){
            return res.status(400).json({message: "Invalid transaction ID"})
        }

        const deleteResult = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `
        if(deleteResult.length == 0){
            return res.status(404).json({message: "Transaction not found"})
        }
        res.status(200).json({message: "Transaction deleted successfully"})
        
    } catch (error) {
        console.log("Error deleting transaction", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function getSummaryByUserId(req, res) {
    try {
        const { userID } = req.params;
        const validID = await validateUser(userID, res);
        if (!validID) return;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as balance 
        FROM transactions WHERE user_id = ${validID}
        `;

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as income 
        FROM transactions WHERE user_id = ${validID} AND amount > 0
        `;

        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as expenses 
        FROM transactions WHERE user_id = ${validID} AND amount < 0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses,
        });
    } catch (error) {
        console.log("Error fetching summary", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
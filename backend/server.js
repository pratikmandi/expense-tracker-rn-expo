import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

//MIDDLEWARES
app.use(rateLimiter);
app.use(express.json());

async function initDB(){
    try {
        await sql `CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log("Database initialized successfully.")
    } catch (error) {
        console.log("DB initialization failed", error);
    }
}

//GET TRANSACTION
app.get("/api/transactions/:userID", async(req, res)=>{
    try {
        const {userID} = req.params;

        const transaction = await sql`
        SELECT * FROM transactions WHERE user_id = ${userID} ORDER BY created_at DESC
        `

        res.status(200).json(transaction)

    } catch (error) {
        console.log("Error fetching transaction", error)
        res.status(500).json({message: "Internal server error"})
    }
})

//CREATE TRANSACTION
app.post("/api/transactions", async (req, res)=>{
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
        res.status(200).json(transaction[0]);
    } catch (error) {
        console.log("Error creating transaction", error)
        res.status(500).json({message: "Internal server error"})
    }
})

//DELETE TRANSACTION
app.delete("/api/transactions/:id", async (req, res)=>{
    try {
        const {id} = req.params;

        if(isNaN(parseInt(id))){
            res.status(400).json({message: "Invalid transaction ID"})
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
})

//SUMMARY
app.get("/api/transactions/summary/:userID", async(req, res)=>{
    try {

        const {userID} = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userID}
        `

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as income FROM transactions 
        WHERE user_id = ${userID} AND amount > 0
        `

        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
        WHERE user_id = ${userID} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expenses,
        });
        
    } catch (error) {
        onsole.log("Error fetching summary", error)
        res.status(500).json({message: "Internal server error"})
    }
})

app.get("/", (req, res)=>{
    res.send("Hello from server");
});

initDB().then(()=> {
    app.listen(process.env.PORT, ()=> {
    console.log("Server running!");
})
})

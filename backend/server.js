import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

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

app.get("/", (req, res)=>{
    res.send("Hello from server");
});

initDB().then(()=> {
    app.listen(process.env.PORT, ()=> {
    console.log("Server running!");
})
})

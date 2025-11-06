import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js"

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

app.get("/", (req, res)=>{
    res.send("Hello from server");
});

app.use("/api/transactions", transactionRoutes)

initDB().then(()=> {
    app.listen(process.env.PORT, ()=> {
    console.log("Server running!");
})
})

import express from "express"
import { createTransaction, deleteTransactionById, getSummaryByUserId, getTransactionByUserId } from "../controllers/transactionController.js";
const router = express.Router();

//GET TRANSACTION
router.get("/:userID", getTransactionByUserId)

//CREATE TRANSACTION
router.post("/", createTransaction)

//DELETE TRANSACTION
router.delete("/:id", deleteTransactionById)

//SUMMARY
router.get("/summary/:userID", getSummaryByUserId)

export default router
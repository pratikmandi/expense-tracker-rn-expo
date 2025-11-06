import { sql } from "../config/db.js";

export async function validateUser(userID, res) {
    if (isNaN(parseInt(userID))) {
        res.status(400).json({ message: "Invalid user ID" });
        return null;
    }

    const user = await sql`
        SELECT user_id FROM transactions WHERE user_id = ${userID}
    `;

    if (user.length === 0) {
        res.status(404).json({ message: "User does not exist" });
        return null;
    }

    return userID;
}

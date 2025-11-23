export async function validateUser(userID, res) {
    if (!userID || typeof userID !== "string") {
        res.status(400).json({ message: "Invalid user ID" });
        return null;
    }

    return userID;
}

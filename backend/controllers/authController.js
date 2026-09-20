const db = require("../db");

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    const sql = `
        SELECT
            u.User_ID,
            u.Username,
            u.Password,
            r.Role_ID,
            r.Role_Name
        FROM user u
        JOIN role r ON u.Role_ID = r.Role_ID
        WHERE u.Username = ?
    `;

    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const user = results[0];

        if (user.Password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                User_ID: user.User_ID,
                Username: user.Username,
                Role_ID: user.Role_ID,
                Role_Name: user.Role_Name
            }
        });
    });
};

module.exports = {
    login
};
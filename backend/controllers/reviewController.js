const db = require("../db");

const getReviews = (req, res) => {
    const sql = `
        SELECT
            r.Review_ID,
            r.Customer_ID,
            c.Name AS Customer_Name,
            r.Package_ID,
            tp.Package_Name,
            r.Rating,
            r.Review_Text
        FROM review r
        JOIN customer c
            ON r.Customer_ID = c.Customer_ID
        JOIN travel_package tp
            ON r.Package_ID = tp.Package_ID
        ORDER BY r.Review_ID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch reviews"
            });
        }

        res.json({
            success: true,
            reviews: results
        });
    });
};

const getReviewsByPackage = (req, res) => {
    const { packageId } = req.params;

    const sql = `
        SELECT
            r.Review_ID,
            r.Customer_ID,
            c.Name AS Customer_Name,
            r.Package_ID,
            r.Rating,
            r.Review_Text
        FROM review r
        JOIN customer c
            ON r.Customer_ID = c.Customer_ID
        WHERE r.Package_ID = ?
        ORDER BY r.Review_ID DESC
    `;

    db.query(sql, [packageId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch package reviews"
            });
        }

        res.json({
            success: true,
            reviews: results
        });
    });
};

const createReview = (req, res) => {
    const {
        Customer_ID,
        Package_ID,
        Rating,
        Review_Text
    } = req.body;

    if (!Customer_ID || !Package_ID || !Rating) {
        return res.status(400).json({
            success: false,
            message: "Customer, package and rating are required"
        });
    }

    const sql = `
        INSERT INTO review
        (Customer_ID, Package_ID, Rating, Review_Text)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            Customer_ID,
            Package_ID,
            Rating,
            Review_Text || null
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to create review"
                });
            }

            res.status(201).json({
                success: true,
                message: "Review created successfully",
                Review_ID: result.insertId
            });
        }
    );
};

module.exports = {
    getReviews,
    getReviewsByPackage,
    createReview
};
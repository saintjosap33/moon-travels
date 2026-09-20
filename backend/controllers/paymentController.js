const db = require("../db");

const getPayments = (req, res) => {
    const sql = `
        SELECT
            p.Payment_ID,
            p.Booking_ID,
            c.Name AS Customer_Name,
            tp.Package_Name,
            p.Amount,
            p.Payment_Date,
            p.Payment_Status
        FROM payment p
        JOIN booking b
            ON p.Booking_ID = b.Booking_ID
        JOIN customer c
            ON b.Customer_ID = c.Customer_ID
        JOIN travel_package tp
            ON b.Package_ID = tp.Package_ID
        ORDER BY p.Payment_ID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch payments"
            });
        }

        res.json({
            success: true,
            payments: results
        });
    });
};

const getPaymentsByBooking = (req, res) => {
    const { bookingId } = req.params;

    const sql = `
        SELECT
            Payment_ID,
            Booking_ID,
            Amount,
            Payment_Date,
            Payment_Status
        FROM payment
        WHERE Booking_ID = ?
    `;

    db.query(sql, [bookingId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch payment"
            });
        }

        res.json({
            success: true,
            payments: results
        });
    });
};

const createPayment = (req, res) => {
    const {
        Booking_ID,
        Amount,
        Payment_Date,
        Payment_Status
    } = req.body;

    if (!Booking_ID || Amount === undefined) {
        return res.status(400).json({
            success: false,
            message: "Booking ID and amount are required"
        });
    }

    const sql = `
        INSERT INTO payment
        (Booking_ID, Amount, Payment_Date, Payment_Status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            Booking_ID,
            Amount,
            Payment_Date || null,
            Payment_Status || "PAID"
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to create payment"
                });
            }

            res.status(201).json({
                success: true,
                message: "Payment created successfully",
                Payment_ID: result.insertId
            });
        }
    );
};

module.exports = {
    getPayments,
    getPaymentsByBooking,
    createPayment
};
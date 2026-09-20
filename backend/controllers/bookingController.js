const db = require("../db");

const getBookings = (req, res) => {
    const sql = `
        SELECT
            b.Booking_ID,
            b.Customer_ID,
            c.Name AS Customer_Name,
            b.Package_ID,
            tp.Package_Name,
            b.Agent_ID,
            ta.Agent_Name,
            b.Booking_Date,
            b.Status,
            p.Amount,
            p.Payment_Status
        FROM booking b
        JOIN customer c
            ON b.Customer_ID = c.Customer_ID
        JOIN travel_package tp
            ON b.Package_ID = tp.Package_ID
        LEFT JOIN travel_agent ta
            ON b.Agent_ID = ta.Agent_ID
        LEFT JOIN payment p
            ON b.Booking_ID = p.Booking_ID
        ORDER BY b.Booking_ID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch bookings"
            });
        }

        res.json({
            success: true,
            bookings: results
        });
    });
};

const getBookingById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            b.Booking_ID,
            b.Customer_ID,
            c.Name AS Customer_Name,
            c.Email,
            c.Phone,
            b.Package_ID,
            tp.Package_Name,
            tp.Duration,
            tp.Price,
            b.Agent_ID,
            ta.Agent_Name,
            b.Booking_Date,
            b.Status,
            bp.Passenger_Name,
            p.Amount,
            p.Payment_Date,
            p.Payment_Status
        FROM booking b
        JOIN customer c
            ON b.Customer_ID = c.Customer_ID
        JOIN travel_package tp
            ON b.Package_ID = tp.Package_ID
        LEFT JOIN travel_agent ta
            ON b.Agent_ID = ta.Agent_ID
        LEFT JOIN booking_passenger bp
            ON b.Booking_ID = bp.Booking_ID
        LEFT JOIN payment p
            ON b.Booking_ID = p.Booking_ID
        WHERE b.Booking_ID = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch booking"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            booking: results[0]
        });
    });
};

const createBooking = (req, res) => {
    const {
        Customer_ID,
        Package_ID,
        Agent_ID,
        Booking_Date,
        Status,
        Passenger_Name
    } = req.body;

    if (!Customer_ID || !Package_ID || !Booking_Date || !Passenger_Name) {
        return res.status(400).json({
            success: false,
            message: "Customer, package, booking date and passenger name are required"
        });
    }

    const bookingSql = `
        INSERT INTO booking
        (Customer_ID, Package_ID, Agent_ID, Booking_Date, Status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        bookingSql,
        [
            Customer_ID,
            Package_ID,
            Agent_ID || null,
            Booking_Date,
            Status || "PENDING"
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to create booking"
                });
            }

            const bookingId = result.insertId;

            const passengerSql = `
                INSERT INTO booking_passenger
                (Booking_ID, Passenger_Name)
                VALUES (?, ?)
            `;

            db.query(
                passengerSql,
                [bookingId, Passenger_Name],
                (passengerErr) => {
                    if (passengerErr) {
                        console.error(passengerErr);
                        return res.status(500).json({
                            success: false,
                            message: "Booking created but passenger could not be added"
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "Booking created successfully",
                        Booking_ID: bookingId
                    });
                }
            );
        }
    );
};

const updateBookingStatus = (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;

    if (!Status) {
        return res.status(400).json({
            success: false,
            message: "Status is required"
        });
    }

    const sql = `
        UPDATE booking
        SET Status = ?
        WHERE Booking_ID = ?
    `;

    db.query(sql, [Status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to update booking status"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking status updated successfully"
        });
    });
};

module.exports = {
    getBookings,
    getBookingById,
    createBooking,
    updateBookingStatus
};
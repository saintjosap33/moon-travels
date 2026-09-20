const db = require("../db");

// GET /api/customers
const getCustomers = (req, res) => {
    const sql = `
        SELECT
            Customer_ID,
            Name,
            Email,
            Phone
        FROM customer
        ORDER BY Customer_ID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Get customers error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch customers"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET /api/customers/:id
const getCustomerById = (req, res) => {
    const customerId = req.params.id;

    const sql = `
        SELECT
            Customer_ID,
            Name,
            Email,
            Phone
        FROM customer
        WHERE Customer_ID = ?
    `;

    db.query(sql, [customerId], (err, results) => {
        if (err) {
            console.error("Get customer error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch customer"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// POST /api/customers
const createCustomer = (req, res) => {
    const {
        Customer_ID,
        Name,
        Email,
        Phone
    } = req.body;

    if (!Customer_ID || !Name || !Name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Customer_ID and Name are required"
        });
    }

    const sql = `
        INSERT INTO customer
        (
            Customer_ID,
            Name,
            Email,
            Phone
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            Customer_ID,
            Name.trim(),
            Email || null,
            Phone || null
        ],
        (err, result) => {
            if (err) {
                console.error("Create customer error:", err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        success: false,
                        message: "Customer ID already exists"
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Failed to create customer"
                });
            }

            res.status(201).json({
                success: true,
                message: "Customer created successfully",
                data: {
                    Customer_ID: Customer_ID
                }
            });
        }
    );
};


// PUT /api/customers/:id
const updateCustomer = (req, res) => {
    const customerId = req.params.id;

    const {
        Name,
        Email,
        Phone
    } = req.body;

    if (!Name || !Name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    const sql = `
        UPDATE customer
        SET
            Name = ?,
            Email = ?,
            Phone = ?
        WHERE Customer_ID = ?
    `;

    db.query(
        sql,
        [
            Name.trim(),
            Email || null,
            Phone || null,
            customerId
        ],
        (err, result) => {
            if (err) {
                console.error("Update customer error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update customer"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }

            res.json({
                success: true,
                message: "Customer updated successfully",
                data: {
                    Customer_ID: Number(customerId),
                    Name: Name.trim(),
                    Email: Email || null,
                    Phone: Phone || null
                }
            });
        }
    );
};


// DELETE /api/customers/:id
const deleteCustomer = (req, res) => {
    const customerId = req.params.id;

    const sql = `
        DELETE FROM customer
        WHERE Customer_ID = ?
    `;

    db.query(sql, [customerId], (err, result) => {
        if (err) {
            console.error("Delete customer error:", err);

            // Customer may be referenced by bookings/reviews.
            if (err.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    success: false,
                    message:
                        "Customer cannot be deleted because the customer has related bookings or reviews"
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to delete customer"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            message: "Customer deleted successfully"
        });
    });
};


module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
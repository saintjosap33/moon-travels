const db = require("../db");

// GET all destinations
const getDestinations = (req, res) => {
    const sql = `
        SELECT
            Destination_ID,
            City,
            Country
        FROM destination
        ORDER BY Destination_ID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Get destinations error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch destinations"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};

// GET destination by ID
const getDestinationById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            Destination_ID,
            City,
            Country
        FROM destination
        WHERE Destination_ID = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Get destination error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch destination"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};

// CREATE destination
const createDestination = (req, res) => {
    const {
        Destination_ID,
        City,
        Country
    } = req.body;

    if (
        Destination_ID === undefined ||
        !City ||
        !Country
    ) {
        return res.status(400).json({
            success: false,
            message: "Destination_ID, City and Country are required"
        });
    }

    const sql = `
        INSERT INTO destination
        (Destination_ID, City, Country)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [Destination_ID, City, Country],
        (err) => {
            if (err) {
                console.error("Create destination error:", err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        success: false,
                        message: "Destination ID already exists"
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Failed to create destination"
                });
            }

            res.status(201).json({
                success: true,
                message: "Destination created successfully",
                data: {
                    Destination_ID
                }
            });
        }
    );
};

// UPDATE destination
const updateDestination = (req, res) => {
    const { id } = req.params;
    const {
        City,
        Country
    } = req.body;

    if (!City || !Country) {
        return res.status(400).json({
            success: false,
            message: "City and Country are required"
        });
    }

    const sql = `
        UPDATE destination
        SET City = ?, Country = ?
        WHERE Destination_ID = ?
    `;

    db.query(
        sql,
        [City, Country, id],
        (err, result) => {
            if (err) {
                console.error("Update destination error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update destination"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Destination not found"
                });
            }

            res.json({
                success: true,
                message: "Destination updated successfully",
                data: {
                    Destination_ID: Number(id),
                    City,
                    Country
                }
            });
        }
    );
};

// DELETE destination
const deleteDestination = (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM destination
        WHERE Destination_ID = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Delete destination error:", err);

            if (err.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    success: false,
                    message: "Destination cannot be deleted because it is used by one or more packages"
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to delete destination"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        res.json({
            success: true,
            message: "Destination deleted successfully"
        });
    });
};

module.exports = {
    getDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
};	
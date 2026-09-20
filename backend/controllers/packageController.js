const db = require("../db");


// ============================================================
// GET ALL PACKAGES
// GET /api/packages
// ============================================================
const getPackages = (req, res) => {
    const sql = `
        SELECT
            tp.Package_ID,
            tp.Package_Name,
            tp.Duration,
            tp.Price,

            GROUP_CONCAT(
                DISTINCT CONCAT(
                    d.Destination_ID,
                    '::',
                    d.City,
                    '::',
                    d.Country,
                    '::',
                    pd.Visit_Order
                )
                ORDER BY pd.Visit_Order
                SEPARATOR '||'
            ) AS Destinations,

            GROUP_CONCAT(
                DISTINCT a.Hotel_Name
                ORDER BY a.Accommodation_ID
                SEPARATOR '||'
            ) AS Accommodations,

            GROUP_CONCAT(
                DISTINCT t.Transport_Type
                ORDER BY t.Transportation_ID
                SEPARATOR '||'
            ) AS Transportation

        FROM travel_package tp

        LEFT JOIN package_destination pd
            ON tp.Package_ID = pd.Package_ID

        LEFT JOIN destination d
            ON pd.Destination_ID = d.Destination_ID

        LEFT JOIN accommodation a
            ON tp.Package_ID = a.Package_ID

        LEFT JOIN transportation t
            ON tp.Package_ID = t.Package_ID

        GROUP BY
            tp.Package_ID,
            tp.Package_Name,
            tp.Duration,
            tp.Price

        ORDER BY tp.Package_ID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Get packages error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch packages"
            });
        }

        const packages = results.map(formatPackage);

        res.json({
            success: true,
            data: packages
        });
    });
};


// ============================================================
// GET PACKAGE BY ID
// GET /api/packages/:id
// ============================================================
const getPackageById = (req, res) => {
    const packageId = req.params.id;

    const packageSql = `
        SELECT
            Package_ID,
            Package_Name,
            Duration,
            Price
        FROM travel_package
        WHERE Package_ID = ?
    `;

    db.query(packageSql, [packageId], (err, packageResults) => {
        if (err) {
            console.error("Get package error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch package"
            });
        }

        if (packageResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Package not found"
            });
        }

        const packageData = packageResults[0];

        const destinationSql = `
            SELECT
                d.Destination_ID,
                d.City,
                d.Country,
                pd.Visit_Order
            FROM package_destination pd
            INNER JOIN destination d
                ON pd.Destination_ID = d.Destination_ID
            WHERE pd.Package_ID = ?
            ORDER BY pd.Visit_Order
        `;

        const accommodationSql = `
            SELECT
                Accommodation_ID,
                Hotel_Name
            FROM accommodation
            WHERE Package_ID = ?
            ORDER BY Accommodation_ID
        `;

        const transportationSql = `
            SELECT
                Transportation_ID,
                Transport_Type
            FROM transportation
            WHERE Package_ID = ?
            ORDER BY Transportation_ID
        `;

        db.query(destinationSql, [packageId], (destinationErr, destinations) => {
            if (destinationErr) {
                console.error("Get package destinations error:", destinationErr);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch package destinations"
                });
            }

            db.query(
                accommodationSql,
                [packageId],
                (accommodationErr, accommodations) => {
                    if (accommodationErr) {
                        console.error(
                            "Get package accommodation error:",
                            accommodationErr
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Failed to fetch package accommodation"
                        });
                    }

                    db.query(
                        transportationSql,
                        [packageId],
                        (transportationErr, transportation) => {
                            if (transportationErr) {
                                console.error(
                                    "Get package transportation error:",
                                    transportationErr
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to fetch package transportation"
                                });
                            }

                            res.json({
                                success: true,
                                data: {
                                    ...packageData,
                                    Destinations: destinations,
                                    Accommodations: accommodations,
                                    Transportation: transportation
                                }
                            });
                        }
                    );
                }
            );
        });
    });
};


// ============================================================
// CREATE PACKAGE
// POST /api/packages
//
// Expected body:
//
// {
//     "Package_Name": "Europe Explorer",
//     "Duration": 10,
//     "Price": 150000,
//     "Destinations": [
//         {
//             "Destination_ID": 1,
//             "Visit_Order": 1
//         },
//         {
//             "Destination_ID": 2,
//             "Visit_Order": 2
//         }
//     ],
//     "Accommodations": [
//         {
//             "Hotel_Name": "Grand Hotel"
//         }
//     ],
//     "Transportation": [
//         {
//             "Transport_Type": "Flight"
//         }
//     ]
// }
// ============================================================
const createPackage = (req, res) => {
    const {
        Package_Name,
        Duration,
        Price,
        Destinations = [],
        Accommodations = [],
        Transportation = []
    } = req.body;

    // Basic validation
    if (!Package_Name || !Package_Name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Package_Name is required"
        });
    }

    if (
        Duration === undefined ||
        Duration === null ||
        Number(Duration) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Duration must be greater than 0"
        });
    }

    if (
        Price === undefined ||
        Price === null ||
        Number(Price) < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Price must be 0 or greater"
        });
    }

    if (!Array.isArray(Destinations)) {
        return res.status(400).json({
            success: false,
            message: "Destinations must be an array"
        });
    }

    if (!Array.isArray(Accommodations)) {
        return res.status(400).json({
            success: false,
            message: "Accommodations must be an array"
        });
    }

    if (!Array.isArray(Transportation)) {
        return res.status(400).json({
            success: false,
            message: "Transportation must be an array"
        });
    }

    db.getConnection((connectionErr, connection) => {
        if (connectionErr) {
            console.error("Database connection error:", connectionErr);

            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        connection.beginTransaction((transactionErr) => {
            if (transactionErr) {
                connection.release();

                console.error(
                    "Begin transaction error:",
                    transactionErr
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to start database transaction"
                });
            }

            const packageSql = `
                INSERT INTO travel_package
                (
                    Package_Name,
                    Duration,
                    Price
                )
                VALUES (?, ?, ?)
            `;

            connection.query(
                packageSql,
                [
                    Package_Name.trim(),
                    Number(Duration),
                    Number(Price)
                ],
                (packageErr, packageResult) => {
                    if (packageErr) {
                        return rollbackTransaction(
                            connection,
                            res,
                            packageErr,
                            "Failed to create package"
                        );
                    }

                    const packageId = packageResult.insertId;

                    insertPackageRelations(
                        connection,
                        packageId,
                        Destinations,
                        Accommodations,
                        Transportation,
                        (relationErr) => {
                            if (relationErr) {
                                return rollbackTransaction(
                                    connection,
                                    res,
                                    relationErr,
                                    "Failed to create package details"
                                );
                            }

                            connection.commit((commitErr) => {
                                if (commitErr) {
                                    return rollbackTransaction(
                                        connection,
                                        res,
                                        commitErr,
                                        "Failed to save package"
                                    );
                                }

                                connection.release();

                                res.status(201).json({
                                    success: true,
                                    message: "Package created successfully",
                                    data: {
                                        Package_ID: packageId
                                    }
                                });
                            });
                        }
                    );
                }
            );
        });
    });
};


// ============================================================
// UPDATE PACKAGE
// PUT /api/packages/:id
// ============================================================
const updatePackage = (req, res) => {
    const packageId = req.params.id;

    const {
        Package_Name,
        Duration,
        Price,
        Destinations = [],
        Accommodations = [],
        Transportation = []
    } = req.body;

    if (!Package_Name || !Package_Name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Package_Name is required"
        });
    }

    if (
        Duration === undefined ||
        Duration === null ||
        Number(Duration) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Duration must be greater than 0"
        });
    }

    if (
        Price === undefined ||
        Price === null ||
        Number(Price) < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Price must be 0 or greater"
        });
    }

    if (!Array.isArray(Destinations)) {
        return res.status(400).json({
            success: false,
            message: "Destinations must be an array"
        });
    }

    if (!Array.isArray(Accommodations)) {
        return res.status(400).json({
            success: false,
            message: "Accommodations must be an array"
        });
    }

    if (!Array.isArray(Transportation)) {
        return res.status(400).json({
            success: false,
            message: "Transportation must be an array"
        });
    }

    db.getConnection((connectionErr, connection) => {
        if (connectionErr) {
            console.error("Database connection error:", connectionErr);

            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        connection.beginTransaction((transactionErr) => {
            if (transactionErr) {
                connection.release();

                return res.status(500).json({
                    success: false,
                    message: "Failed to start database transaction"
                });
            }

            const updateSql = `
                UPDATE travel_package
                SET
                    Package_Name = ?,
                    Duration = ?,
                    Price = ?
                WHERE Package_ID = ?
            `;

            connection.query(
                updateSql,
                [
                    Package_Name.trim(),
                    Number(Duration),
                    Number(Price),
                    packageId
                ],
                (updateErr, updateResult) => {
                    if (updateErr) {
                        return rollbackTransaction(
                            connection,
                            res,
                            updateErr,
                            "Failed to update package"
                        );
                    }

                    if (updateResult.affectedRows === 0) {
                        connection.rollback(() => {
                            connection.release();

                            res.status(404).json({
                                success: false,
                                message: "Package not found"
                            });
                        });

                        return;
                    }

                    // Remove old relationships
                    const deleteDestinationsSql = `
                        DELETE FROM package_destination
                        WHERE Package_ID = ?
                    `;

                    connection.query(
                        deleteDestinationsSql,
                        [packageId],
                        (destinationDeleteErr) => {
                            if (destinationDeleteErr) {
                                return rollbackTransaction(
                                    connection,
                                    res,
                                    destinationDeleteErr,
                                    "Failed to update package destinations"
                                );
                            }

                            const deleteAccommodationSql = `
                                DELETE FROM accommodation
                                WHERE Package_ID = ?
                            `;

                            connection.query(
                                deleteAccommodationSql,
                                [packageId],
                                (accommodationDeleteErr) => {
                                    if (accommodationDeleteErr) {
                                        return rollbackTransaction(
                                            connection,
                                            res,
                                            accommodationDeleteErr,
                                            "Failed to update package accommodation"
                                        );
                                    }

                                    const deleteTransportationSql = `
                                        DELETE FROM transportation
                                        WHERE Package_ID = ?
                                    `;

                                    connection.query(
                                        deleteTransportationSql,
                                        [packageId],
                                        (transportationDeleteErr) => {
                                            if (transportationDeleteErr) {
                                                return rollbackTransaction(
                                                    connection,
                                                    res,
                                                    transportationDeleteErr,
                                                    "Failed to update package transportation"
                                                );
                                            }

                                            // Recreate relationships
                                            insertPackageRelations(
                                                connection,
                                                packageId,
                                                Destinations,
                                                Accommodations,
                                                Transportation,
                                                (relationErr) => {
                                                    if (relationErr) {
                                                        return rollbackTransaction(
                                                            connection,
                                                            res,
                                                            relationErr,
                                                            "Failed to update package details"
                                                        );
                                                    }

                                                    connection.commit(
                                                        (commitErr) => {
                                                            if (commitErr) {
                                                                return rollbackTransaction(
                                                                    connection,
                                                                    res,
                                                                    commitErr,
                                                                    "Failed to save package changes"
                                                                );
                                                            }

                                                            connection.release();

                                                            res.json({
                                                                success: true,
                                                                message:
                                                                    "Package updated successfully",
                                                                data: {
                                                                    Package_ID:
                                                                        Number(
                                                                            packageId
                                                                        )
                                                                }
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    });
};


// ============================================================
// DELETE PACKAGE
// DELETE /api/packages/:id
// ============================================================
const deletePackage = (req, res) => {
    const packageId = req.params.id;

    db.getConnection((connectionErr, connection) => {
        if (connectionErr) {
            console.error("Database connection error:", connectionErr);

            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        connection.beginTransaction((transactionErr) => {
            if (transactionErr) {
                connection.release();

                return res.status(500).json({
                    success: false,
                    message: "Failed to start database transaction"
                });
            }

            // Delete package destinations
            const deleteDestinationsSql = `
                DELETE FROM package_destination
                WHERE Package_ID = ?
            `;

            connection.query(
                deleteDestinationsSql,
                [packageId],
                (destinationErr) => {
                    if (destinationErr) {
                        return rollbackTransaction(
                            connection,
                            res,
                            destinationErr,
                            "Failed to delete package destinations"
                        );
                    }

                    // Delete accommodations
                    const deleteAccommodationSql = `
                        DELETE FROM accommodation
                        WHERE Package_ID = ?
                    `;

                    connection.query(
                        deleteAccommodationSql,
                        [packageId],
                        (accommodationErr) => {
                            if (accommodationErr) {
                                return rollbackTransaction(
                                    connection,
                                    res,
                                    accommodationErr,
                                    "Failed to delete package accommodation"
                                );
                            }

                            // Delete transportation
                            const deleteTransportationSql = `
                                DELETE FROM transportation
                                WHERE Package_ID = ?
                            `;

                            connection.query(
                                deleteTransportationSql,
                                [packageId],
                                (transportationErr) => {
                                    if (transportationErr) {
                                        return rollbackTransaction(
                                            connection,
                                            res,
                                            transportationErr,
                                            "Failed to delete package transportation"
                                        );
                                    }

                                    // Finally delete the package
                                    const deletePackageSql = `
                                        DELETE FROM travel_package
                                        WHERE Package_ID = ?
                                    `;

                                    connection.query(
                                        deletePackageSql,
                                        [packageId],
                                        (packageErr, packageResult) => {
                                            if (packageErr) {
                                                if (
                                                    packageErr.code ===
                                                    "ER_ROW_IS_REFERENCED_2"
                                                ) {
                                                    return rollbackTransaction(
                                                        connection,
                                                        res,
                                                        null,
                                                        "Package cannot be deleted because it has related bookings or reviews",
                                                        409
                                                    );
                                                }

                                                return rollbackTransaction(
                                                    connection,
                                                    res,
                                                    packageErr,
                                                    "Failed to delete package"
                                                );
                                            }

                                            if (
                                                packageResult.affectedRows ===
                                                0
                                            ) {
                                                return rollbackTransaction(
                                                    connection,
                                                    res,
                                                    null,
                                                    "Package not found",
                                                    404
                                                );
                                            }

                                            connection.commit((commitErr) => {
                                                if (commitErr) {
                                                    return rollbackTransaction(
                                                        connection,
                                                        res,
                                                        commitErr,
                                                        "Failed to complete package deletion"
                                                    );
                                                }

                                                connection.release();

                                                res.json({
                                                    success: true,
                                                    message:
                                                        "Package deleted successfully"
                                                });
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    });
};


// ============================================================
// INSERT PACKAGE RELATIONSHIPS
// ============================================================
const insertPackageRelations = (
    connection,
    packageId,
    destinations,
    accommodations,
    transportation,
    callback
) => {
    insertDestinations(
        connection,
        packageId,
        destinations,
        (destinationErr) => {
            if (destinationErr) {
                return callback(destinationErr);
            }

            insertAccommodations(
                connection,
                packageId,
                accommodations,
                (accommodationErr) => {
                    if (accommodationErr) {
                        return callback(accommodationErr);
                    }

                    insertTransportation(
                        connection,
                        packageId,
                        transportation,
                        (transportationErr) => {
                            if (transportationErr) {
                                return callback(transportationErr);
                            }

                            callback(null);
                        }
                    );
                }
            );
        }
    );
};


// ============================================================
// INSERT DESTINATIONS
// ============================================================
const insertDestinations = (
    connection,
    packageId,
    destinations,
    callback
) => {
    if (destinations.length === 0) {
        return callback(null);
    }

    const values = [];

    for (let i = 0; i < destinations.length; i++) {
        const destination = destinations[i];

        if (
            destination.Destination_ID === undefined ||
            destination.Visit_Order === undefined
        ) {
            return callback(
                new Error(
                    "Each destination requires Destination_ID and Visit_Order"
                )
            );
        }

        values.push([
            packageId,
            destination.Destination_ID,
            destination.Visit_Order
        ]);
    }

    const sql = `
        INSERT INTO package_destination
        (
            Package_ID,
            Destination_ID,
            Visit_Order
        )
        VALUES ?
    `;

    connection.query(sql, [values], callback);
};


// ============================================================
// INSERT ACCOMMODATIONS
// ============================================================
const insertAccommodations = (
    connection,
    packageId,
    accommodations,
    callback
) => {
    if (accommodations.length === 0) {
        return callback(null);
    }

    const values = [];

    for (const accommodation of accommodations) {
        if (
            !accommodation.Hotel_Name ||
            !accommodation.Hotel_Name.trim()
        ) {
            return callback(
                new Error("Each accommodation requires Hotel_Name")
            );
        }

        values.push([
            packageId,
            accommodation.Hotel_Name.trim()
        ]);
    }

    const sql = `
        INSERT INTO accommodation
        (
            Package_ID,
            Hotel_Name
        )
        VALUES ?
    `;

    connection.query(sql, [values], callback);
};


// ============================================================
// INSERT TRANSPORTATION
// ============================================================
const insertTransportation = (
    connection,
    packageId,
    transportation,
    callback
) => {
    if (transportation.length === 0) {
        return callback(null);
    }

    const values = [];

    for (const transport of transportation) {
        if (
            !transport.Transport_Type ||
            !transport.Transport_Type.trim()
        ) {
            return callback(
                new Error("Each transportation item requires Transport_Type")
            );
        }

        values.push([
            packageId,
            transport.Transport_Type.trim()
        ]);
    }

    const sql = `
        INSERT INTO transportation
        (
            Package_ID,
            Transport_Type
        )
        VALUES ?
    `;

    connection.query(sql, [values], callback);
};


// ============================================================
// FORMAT PACKAGE FROM LIST QUERY
// ============================================================
const formatPackage = (row) => {
    const destinations = row.Destinations
        ? row.Destinations.split("||").map((item) => {
              const parts = item.split("::");

              return {
                  Destination_ID: Number(parts[0]),
                  City: parts[1],
                  Country: parts[2],
                  Visit_Order: Number(parts[3])
              };
          })
        : [];

    const accommodations = row.Accommodations
        ? row.Accommodations.split("||").map((hotel) => ({
              Hotel_Name: hotel
          }))
        : [];

    const transportation = row.Transportation
        ? row.Transportation.split("||").map((transport) => ({
              Transport_Type: transport
          }))
        : [];

    return {
        Package_ID: row.Package_ID,
        Package_Name: row.Package_Name,
        Duration: row.Duration,
        Price: row.Price,
        Destinations: destinations,
        Accommodations: accommodations,
        Transportation: transportation
    };
};


// ============================================================
// TRANSACTION ROLLBACK HELPER
// ============================================================
const rollbackTransaction = (
    connection,
    res,
    error,
    message,
    statusCode = 500
) => {
    if (error) {
        console.error(message + ":", error);
    }

    connection.rollback(() => {
        connection.release();

        res.status(statusCode).json({
            success: false,
            message
        });
    });
};


// ============================================================
// EXPORTS
// ============================================================
module.exports = {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
};
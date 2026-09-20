const express = require("express");

const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");

const router = express.Router();


// GET all customers
router.get("/", getCustomers);

// GET one customer
router.get("/:id", getCustomerById);

// CREATE customer
router.post("/", createCustomer);

// UPDATE customer
router.put("/:id", updateCustomer);

// DELETE customer
router.delete("/:id", deleteCustomer);


module.exports = router;
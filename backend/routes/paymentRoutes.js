const express = require("express");
const router = express.Router();

const {
    getPayments,
    getPaymentsByBooking,
    createPayment
} = require("../controllers/paymentController");

router.get("/", getPayments);
router.get("/booking/:bookingId", getPaymentsByBooking);
router.post("/", createPayment);

module.exports = router;
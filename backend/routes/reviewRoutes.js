const express = require("express");
const router = express.Router();

const {
    getReviews,
    getReviewsByPackage,
    createReview
} = require("../controllers/reviewController");

router.get("/", getReviews);
router.get("/package/:packageId", getReviewsByPackage);
router.post("/", createReview);

module.exports = router;
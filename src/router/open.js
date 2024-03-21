const express = require("express");
const router = express.Router();
const user = require("../admin/user/user.controller");
const customerAuth = require("../customer/auth/auth.controller");
const customer = require("../customer/customer.controller");
const common = require("../common/common.controller");
const dashboard = require('../customer/dashboard/dashboard.controller');
const stripeController = require('../stripe/stripe.controller');

router.post("/login", user.login);

router.post("/customer-send-email-otp", customerAuth.sendEmailOtp);
router.post("/customer-verify-email-otp", customerAuth.verifyEmailOtp);
router.post("/register", customer.createCustomer);

router.post("/file-upload", common.fileUpload);

// User
router.get('/dashboard', dashboard.dashboard);
router.get('/listing', dashboard.listing);
router.get('/details', dashboard.entityDetails);
router.get('/get-listing-filter', common.getListingFilters);
router.post("/create-payment-intent", stripeController.createPaymentIntent);
router.post('/verify-payment', stripeController.verifyPaymentStripe);
module.exports = router;

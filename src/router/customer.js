const express = require("express");
const router = express.Router();
const customerController = require("../customer/customer.controller");
const helper = require("../../util/helper");
const reservationController = require('../customer/reservation/reservation.controller');
const stripeController = require('../stripe/stripe.controller');
const dashboardController  = require("../customer/dashboard/dashboard.controller");

router.use(helper.authorizationMiddleware);

router.get("/", (req, res, next) => res.send("customer route working"));

router.get("/profile", customerController.getCustomerProfile);
router.post('/upload-user-document', customerController.uploadDocument);
router.put("/profile", customerController.updateCustomerProfile);
router.post("/send-phone-otp", customerController.sendMobileOtp);
router.post("/verify-phone-otp", customerController.verifyMobileOtp);

router.get("/get-current-stay", dashboardController.getCurrentStayByUserId);
router.post("/create-current-stay", dashboardController.createCurrentStay);

router.post("/create-payment-intent", stripeController.createPaymentIntent);
router.post('/verify-payment', stripeController.verifyPaymentStripe);

router.get("/get-entity", reservationController.getEntityDetail);
router.post("/get-quote", reservationController.getReservationQuote);
router.post("/create-reservation", reservationController.createReservation);
router.post("/transfer-reservation", reservationController.createTransferReservation);
router.post("/cancel-reservation", reservationController.cancelReservation);
router.post("/create-payment-intent", stripeController.createPaymentIntent);
router.post('/update-reservation-progress', reservationController.updateReservationProgressToCompleted)
router.put("/change-password", customerController.changePassword);




module.exports = router;

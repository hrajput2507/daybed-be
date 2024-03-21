const express = require('express');
const router = express.Router();
const helper = require('../../util/helper');
const propertyController = require('../admin/property/property.controller');
const unitsController = require('../admin/units/units.controller');
const roomsController = require('../admin/rooms/rooms.controller');
const featuresController = require('../admin/features/features.controller');
const memberController = require('../admin/members/members.controller');
const common = require("../common/common.controller");
const paymentController = require("../admin/payments/payments.controller");
const reservationController = require("../admin/reservation/reservation.controller");


router.use(helper.authorizationMiddleware);

router.get('/', (req, res, next) => res.send('admin route working'));

router.get('/property', propertyController.getProperties);
router.post('/property', propertyController.createProperty);
router.get('/property/:id', propertyController.getProperty);
router.put('/property/:id', propertyController.getProperty);

router.get('/members', memberController.get);

router.get('/unit', unitsController.getUnits);
router.post('/unit', unitsController.createUnit);
router.get('/unit/:id', unitsController.getUnit);

router.post('/room', roomsController.createRooms);

router.get('/room', roomsController.getRooms);

router.get('/room/:id', roomsController.getRoomById);

router.post('/price', roomsController.createMetaData);

router.post('/parking', roomsController.assignParkingSport);

router.put('/instructions', roomsController.updateInstructions);

router.post('/features', featuresController.getFeaturesByType);

router.post('/create/features', featuresController.createFeature);
    
router.post("/file-upload", common.fileUpload);

router.put('/vacant', roomsController.markUnitRoomVacant)

router.get('/getAllPayments', paymentController.getAllPaymentsData)

router.get('/getPaymentById', paymentController.getPaymentById)

router.get('/get-all-reservation', reservationController.getAllReservationsData)

router.get('/get-reservation-by-id', reservationController.getReservationById)

router.post('/approve-reservation', reservationController.approveReservationById)

router.post('/reject-reservation', reservationController.rejectReservationById)

module.exports = router;
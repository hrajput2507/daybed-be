const express = require('express');
const router = express.Router();
const landlordController = require('../admin/landlord/landlord.controller');

const helper = require('../../util/helper');

router.use(helper.authorizationMiddleware)

router.get('/', (req, res, next) => res.send('landlord route working'))
router.post('/create', landlordController.create);
router.get('/get', landlordController.get);
router.get('/get/:id', landlordController.getById);


module.exports = router;
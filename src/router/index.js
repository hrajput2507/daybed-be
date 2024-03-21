const express = require('express');
const rootRouter = express.Router();
const customer = require('./customer');
const admin = require('./admin');
const landlord = require('./landlord');
const open = require('./open');


rootRouter.use('/customer', customer);
rootRouter.use('/admin', admin);
rootRouter.use('/landlord', landlord);
rootRouter.use('/', open);

module.exports = rootRouter;
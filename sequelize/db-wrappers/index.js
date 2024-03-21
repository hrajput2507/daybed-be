const users = require('./users');
const property = require('./property');
const units = require('./units');
const rooms = require('./rooms');
const instructions = require('./instructions');
const features = require('./features');
const attachments = require('./attachments');
const reservations = require('./reservations');
const reservationsAudit = require('./reservationAudit');
const payments = require('./payments');
const parking = require('./parking');
const currentStay = require('./currentStay')

module.exports = { users, property, units, rooms, instructions, features, attachments,
    reservations, reservationsAudit, payments, parking ,currentStay };
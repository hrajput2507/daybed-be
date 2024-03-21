
const DB = require("../../../sequelize/db-wrappers");
const { use } = require("../../router/admin");

async function getUserByEmail(reqBody) {
    try {
        return await DB.users.getUser({ email: reqBody.email });
        //18001801290
    } catch (e) {
        throw e;
    }
}
async function getAllUser(reqBody) {
    try {
        return await DB.users.getAllUser({ email: reqBody.email });
        //18001801290
    } catch (e) {
        throw e;
    }
}
async function count(reqBody) {
    try {
        return await DB.users.count(reqBody);
        //18001801290
    } catch (e) {
        throw e;
    }
}

async function getUserByPhone(reqBody) {
    try {
        return await DB.users.getUser({ phone: reqBody.phone });
        //18001801290
    } catch (e) {
        throw e;
    }
}
async function getUserById(id) {
    try {
        const user =  await DB.users.getUser({ id });
        const units = await DB.units.fetchUnitsByLandlordId(id);
        user.units = units;
        return user;
        //18001801290
    } catch (e) {
        throw e;
    }
}

async function createlandlord(payload) {
    return DB.users.createUser(payload);
}


module.exports = { getUserByEmail, createlandlord, getUserByPhone, getAllUser, count ,getUserById}
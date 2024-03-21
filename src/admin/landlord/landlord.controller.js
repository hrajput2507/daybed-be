
const validator = require('./validator');
const service = require('./landlord.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');
const { Op } = require('sequelize'); // Import the Op operator from Sequelize
const models = require("../../../sequelize/models");

async function create(req, res) {
    try {
        let result
        const joiValidator = validator.create.validate(req.body);
        if (joiValidator.error) {
            return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
        }
        const email = await service.getUserByEmail({ ...req.body });
        const phone = await service.getUserByPhone({ ...req.body });
        if (email) {
            return helper.sendResponse(
                {
                    status: HttpStatus.StatusCodes.BAD_REQUEST,
                    message: "landlord with the same email already exist."
                },
                res
            );
        }
        if (phone) {
            return helper.sendResponse(
                {
                    status: HttpStatus.StatusCodes.BAD_REQUEST,
                    message: "landlord with the same phone already exist."
                },
                res
            );
        }
        if (!email && !phone) {
            result = await service.createlandlord({
                ...req.body,
                role: "landlord",
                password: "Qwerty@123",
            });

        }

        return helper.sendResponse({ data: result }, res);
    } catch (e) {
        console.log(e);
        helper.sendServerFailure(res);
    }
}

async function get(req, res) {
    try {
        const query = req.query;

        let search = query.search;

        const { limit, offset, pageNum } = helper.limitOffset(query);

        const type = query.type;
        
        let options = {
            attributes: { exclude: ['password'] }, // Exclude the 'password' field from the results
            where: { role: 'landlord'},
            order: [['created_at', 'DESC']],

        };

        if (!type) {
            options.offset = offset;
            options.limit = limit;
        }

        if (search) {
            search = search.toLowerCase();
            options.where = {
                [Op.or]: [
                    {
                        email: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        firstName: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        lastName: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ],
                role: "landlord"
            };
        }


        const landlord = await models.users.findAndCountAll(options);;
        return helper.sendResponse({ data: landlord.rows, page: { limit, offset, pageNum, totalCount: landlord.count } }, res);
    } catch (e) {
        console.log(e);
        helper.sendServerFailure(res);
    }
}

async function getById(req, res) {
    try {

        const landlord = await service.getUserById(req.params.id);

        return helper.sendResponse({ data: { landlord } }, res);
    } catch (e) {
        console.log(e);
        helper.sendServerFailure(res);
    }
}

module.exports = { create, get, getById }


const models = require("../../../sequelize/models");
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');
const { Op } = require('sequelize'); // Import the Op operator from Sequelize

async function get(req, res) {
    try {
        const query = req.query;

        let search = query.search;

        const { limit, offset, pageNum } = helper.limitOffset(query);

        const type = query.type;
        
        let options = {
            attributes: { exclude: ['password'] }, // Exclude the 'password' field from the results
            where: { role: 'customer'},
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
                role: "customer"
            };
        }


        const members = await models.users.findAndCountAll(options);;
         return helper.sendResponse({ data: members.rows, page: { limit, offset, totalCount: members.count, pageNum } }, res);
    } catch (e) {
        console.log(e);
        helper.sendServerFailure(res);
    }
}

module.exports = { get }
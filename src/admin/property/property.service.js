
const DB = require('../../../sequelize/db-wrappers');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');

async function dumpImages(images, propertyId) {
    for (const image of images) {
        await helper.uploadBase64toS3(image, ``)
    }
}
async function dumpProperty(payload) {
    const propertyData = await DB.property.dumpProperty(payload);
    const amenities = payload.amenities;
    const images = payload.images;
    if (amenities && amenities.length) {
        const propertyInstructions = [];
        amenities.forEach(amenti => {
            const amentiesInstructions = {
                name: amenti,
                entity_id: propertyData.id,
                entity_type: 'property'
            }
            propertyInstructions.push(amentiesInstructions);
        });
        const instruct = await DB.instructions.createInstructions(propertyInstructions);
        propertyData.instructions = instruct;
    }
    if (images && images.length) {
        const Images = [];
        images.forEach(image => {
            const imageInfo = {
                entity_id: propertyData.id,
                entity_type: 'property',
                name: image.name,
                url: image.url,
            };
            Images.push(imageInfo);
        })
        const dbImages = await DB.attachments.createAttachments(Images);
        propertyData.images = dbImages;

    }
    return propertyData;
}

async function getProperties(payload, limit, offset) {
    return DB.property.fetchproperties(payload, limit, offset)
}

async function getPropertiesWithUnits(search, limit, offset) {
    return await Promise.all([DB.property.getPropertiesWithUnits(search, limit, offset), 
    DB.property.getPropertiesCountWithSearch(search)]);
}

async function validateLandlord(landlord_id) {
    const landlord = await DB.users.getUser({ id: landlord_id, status: 'active', role: 'landlord' });
    if (!landlord) return { hasError: true, message: 'Invalid Landlord', status: HttpStatus.StatusCodes.BAD_REQUEST }
    return { hasError: false };
}

async function getProperty(id) {
    const property = await DB.property.getPropertyById(id);
    const units = await DB.units.fetchUnitsByPropertyId(id);
    if (property) property[0].units = units;
    return property[0];
}

module.exports = { dumpProperty, getProperties, getProperty, validateLandlord, getPropertiesWithUnits }
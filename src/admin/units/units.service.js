const DB = require('../../../sequelize/db-wrappers');
const HttpStatus = require('http-status-codes');

async function validateProperty(propertyId) {
    const property = await DB.property.fetchproperty({ id: propertyId, status: 'active' });
    if (!property) return { hasError: true, message: 'Invalid Property', status: HttpStatus.StatusCodes.BAD_REQUEST }
    return { hasError: false };
}

async function validateLandlord(landlord_id) {
    const landlord = await DB.users.getUser({ id: landlord_id, status: 'active', role: 'landlord' });
    if (!landlord) return { hasError: true, message: 'Invalid Landlord', status: HttpStatus.StatusCodes.BAD_REQUEST }
    return { hasError: false };
}

async function dumpUnit(payload) {
    const unit =  await DB.units.dumpUnit(payload);
    const amenities = payload.features;
    const images = payload.images;

    if (amenities && amenities.length) {
        const unitInstructions = [];
        amenities.forEach(amenti => {
            const amentiesInstructions = {
                name: amenti,
                entity_id: unit.id,
                entity_type: 'unit'
            }
            unitInstructions.push(amentiesInstructions);
        });
        const instruct = await DB.instructions.createInstructions(unitInstructions);
        unit.instructions = instruct;
    }

    if (images && images.length) {
        const Images = [];
        images.forEach(image => {
            const imageInfo = {
                entity_id: unit.id,
                entity_type: 'unit',
                name: image.name,
                url: image.url,
            };
            Images.push(imageInfo);
        })
        const dbImages = await DB.attachments.createAttachments(Images);
        unit.images = dbImages;

    }
    return unit;
}

async function getUnits(payload, limit, offset) {
    return DB.units.fetchUnits(payload, limit, offset)
}

async function getUnitData(unitId) {
const unit = await DB.units.fetchUnitById(unitId);
if (unit && unit[0]) {
    const rooms = await DB.rooms.getRoomsByUnit(unitId);
    if (unit) unit[0].rooms = rooms;
    const landlord = await DB.users.getUser(unit[0].landlord_id);
    const count = await DB.units.getUnitCountByLandlordId(unit[0].landlord_id);
    unit[0].landlord = {
        ...landlord,
        count
    }
    const property = await DB.property.fetchproperty({
        id: unit[0].property_id
    });
    unit[0].property = property;

}
return unit[0];
}

module.exports = { validateProperty, dumpUnit, getUnits, validateLandlord, getUnitData }
const Joi = require('joi');

const Images = Joi.object().keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
});

const room = Joi.object().keys({
    type: Joi.string().valid('single', 'twin', 'double', 'queen', 'king', 'super_king').required(),
    description: Joi.string().required(),
    area_sqm: Joi.number().required(),
    features: Joi.array().items(Joi.string()),
    images: Joi.array().items(Images),
});

const roomSchema = Joi.object().keys({
    rooms:  Joi.array().items(room).required(),
    unit_id: Joi.number().required()
})

const metaData = Joi.object().keys({
    room_id: Joi.number().required(),
    base_price: Joi.number().required(),
    util_price: Joi.number().required(),
    parking_spot: Joi.number(),
    parking_features: Joi.array().items(Joi.string())
});

const metaSchema = Joi.object().keys({
    type: Joi.string().valid('entire', 'shared').required(),
    unit_id: Joi.number().required(),
    base_price: Joi.alternatives().conditional('type',
    {
        is: 'entire',
        then: Joi.number().required(),
        otherwise: Joi.forbidden(),
    }
    ),
    util_price: Joi.alternatives().conditional('type',
    {
        is: 'entire',
        then: Joi.number().required(),
        otherwise: Joi.forbidden(),
    }
    ),
    meta: Joi.alternatives().conditional('type',
    {
        is: 'shared',
        then: Joi.array().items(metaData).min(1).required(),
        otherwise: Joi.forbidden(),
    }
    )

})



const spotInfo = Joi.object().keys({
    spot_number: Joi.number().required(),
    room_id: Joi.number(),
    parking_acces_items: Joi.array().items(Joi.string()),
});

const parkingSpotSchema = Joi.object().keys({
    unit_id: Joi.number().required(),
    spots: Joi.array().items(spotInfo).min(1).required(),
});

const updateInstructions = Joi.object().keys({
    type: Joi.string().valid('room', 'unit', 'property', 'parking').required(),
    id: Joi.number().required(),
    description: Joi.string().required(),
    url: Joi.string()
});

const vacantSchema = Joi.object().keys({
    entity_id: Joi.number().required(),
    entity_type: Joi.string().valid('room', 'unit').required()
})
module.exports = { roomSchema, metaSchema, parkingSpotSchema, updateInstructions, vacantSchema };
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
var mongooseI18n = require('mongoose-i18n-localize');


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200,
        i18n: true,
        unique: true
    },
    image: {
        type: String,
        default: null,
    },
    price: {
        type: Number,
        default: 0
    },
    category_id: {
        type: ObjectId,
        ref: 'Category',
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

ProductSchema.plugin(mongooseI18n, {
    locales: ['en', 'bn']
});

module.exports = mongoose.model("Product", ProductSchema)
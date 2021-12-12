const mongoose = require('mongoose');
var mongooseI18n = require('mongoose-i18n-localize');
const ObjectId = mongoose.Schema.ObjectId;

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        unique: true,
        i18n: true
    },
    parent_category: {
        type: ObjectId,
        ref: 'Category',
        default: null
    },
    logo: {
        type: String,
        default: null
    },
    banner: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

CategorySchema.plugin(mongooseI18n, {
    locales: ['en', 'bn']
});

module.exports = mongoose.model('Category', CategorySchema)
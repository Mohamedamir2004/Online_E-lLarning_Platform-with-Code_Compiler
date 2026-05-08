const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true
        },
        lastname: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        countrycode: {
            type: String,
            trim: true
        },
        phoneNo: {
            type: String,
            trim: true
        },
        message: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
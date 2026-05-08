// controller for handling "contact us" requests
const Contact = require('../models/contact');

exports.contactUs = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            countrycode,
            phoneNo,
            message,
        } = req.body;

        // basic validation
        if (!firstname || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Firstname, email and message are required.',
            });
        }

        // create document
        const contactEntry = await Contact.create({
            firstname,
            lastname,
            email,
            countrycode,
            phoneNo,
            message,
        });

        return res.status(200).json({
            success: true,
            message: 'Your request has been sent successfully.',
            data: contactEntry,
        });
    } catch (error) {
        console.error('Error in contactUs controller -', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong while submitting your request.',
            error: error.message,
        });
    }
};
const Rajorpay = require('razorpay');
require('dotenv').config();

// Only create Razorpay instance if credentials are provided
let razorpayInstance = null;

if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET &&
    process.env.RAZORPAY_KEY !== 'your_razorpay_key_id' &&
    process.env.RAZORPAY_SECRET !== 'your_razorpay_key_secret') {
    razorpayInstance = new Rajorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET
    });
}

exports.instance = razorpayInstance;
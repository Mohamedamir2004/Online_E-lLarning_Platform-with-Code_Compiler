const express = require('express');
const router = express.Router();

const { contactUs } = require('../controllers/reach');

// public route to receive contact requests
router.post('/contact', contactUs);

module.exports = router;

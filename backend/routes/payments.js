const express = require('express');
const router = express.Router();

const { capturePayment, verifyPayment, getPurchaseHistory, sendPaymentSuccessEmail } = require('../controllers/payments');
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth');

router.post('/capturePayment', auth, isStudent, capturePayment);
router.post('/verifyPayment', auth, isStudent, verifyPayment);
router.post('/sendPaymentSuccessEmail', auth, isStudent, sendPaymentSuccessEmail);
router.get('/getPurchaseHistory', auth, isStudent, getPurchaseHistory);

module.exports = router

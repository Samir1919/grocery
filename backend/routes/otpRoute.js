express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
var a = require('../middleware/auth');

router.post('/sendOtp', otpController.sendOtp);

router.post('/verifyOTP', otpController.verifyOTP);

router.post('/home', a.authenticateUser, (req, res) => {
    console.log('home private route');
    res.status(202).send('Private Protected Route - Home');
});

router.post('/user', a.refreshAuthenticateUser, (req, res) => {
    console.log('home private route');
    res.status(202).send('Private Protected Refresh Route - User');
});




module.exports = router;
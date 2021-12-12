const axios = require('axios').default;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
var a = require('../middleware/auth');

const smsKey = process.env.SMS_SECRET_KEY;


// bdsms.net
var url = 'http://api.greenweb.com.bd/';
var token = process.env.BDSMS_TOKEN;

exports.sendOtp = (req, res) => {
    const phone = req.body.phone;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;
    var message = 'Your+One+Time+Login+Password+For+Samtech+Software+is+';
    var lUri = `api.php?token=${token}&to=${phone}&message=${message}${otp}`;

    axios.get(url + lUri)
        .then(function (response) {
            // handle success
            console.log(response.data, otp);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

    // res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
    res.status(200).send({ phone, hash: fullHash });          // Use this way in Production
};

exports.verifyOTP = (req, res) => {
    const phone = req.body.phone;
    const hash = req.body.hash;
    const otp = req.body.otp;
    let [hashValue, expires] = hash.split('.');

    let now = Date.now();
    if (now > parseInt(expires)) {
        return res.status(504).send({ msg: 'Timeout. Please try again' });
    }
    let data = `${phone}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    if (newCalculatedHash === hashValue) {
        console.log('user confirmed');
        const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
        const refreshToken = jwt.sign({ data: phone }, JWT_REFRESH_TOKEN, { expiresIn: '1y' });
        a.refreshTokens.push(refreshToken);
        res
            .status(202)
            .cookie('accessToken', accessToken, {
                expires: new Date(new Date().getTime() + 30 * 1000),
                sameSite: 'strict',
                httpOnly: true
            })
            .cookie('refreshToken', refreshToken, {
                expires: new Date(new Date().getTime() + 31557600000),
                sameSite: 'strict',
                httpOnly: true
            })
            .cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict' })
            .cookie('refreshTokenID', true, {
                expires: new Date(new Date().getTime() + 31557600000),
                sameSite: 'strict'
            })
            .send({
                msg: 'Device verified',
                accessToken, refreshToken
            });
    } else {
        console.log('not authenticated');
        return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
    }
};
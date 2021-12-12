
const jwt = require('jsonwebtoken');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
let refreshTokens = [];
exports.refreshTokens = refreshTokens;



exports.authenticateUser = async function (req, res, next) {
    const accessToken = req.cookies.accessToken;

    jwt.verify(accessToken, JWT_AUTH_TOKEN, async (err, phone) => {
        if (phone) {
            req.phone = phone;
            next();
        } else if (err.message === 'TokenExpiredError') {
            return res.status(403).send({
                success: false,
                msg: 'Access token expired'
            });
        } else {
            console.log(err);
            return res.status(403).send({ err, msg: 'User not authenticated' });
        }
    });
}

exports.refreshAuthenticateUser = async function (req, res, next) {
    const refreshToken = req.cookies.refreshToken;

    jwt.verify(refreshToken, JWT_REFRESH_TOKEN, async (err, phone) => {
        if (phone) {
            req.phone = phone;
            next();
        } else if (err.message === 'TokenExpiredError') {
            return res.status(403).send({
                success: false,
                msg: 'Access token expired'
            });
        } else {
            console.log(err);
            return res.status(403).send({ err, msg: 'User not authenticated' });
        }
    });
}


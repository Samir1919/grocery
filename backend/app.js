require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var engine = require('ejs-locals')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.locals.baseURL = "http://localhost:5000/"

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

// MongoDB
const connectDB = require('./config/db');
connectDB();

// translation
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        backend: {
            loadPath: './locales/{{lng}}/translation.json'
        }
    })
app.use(middleware.handle(i18next));

// otp route
app.use('/otp/', require('./routes/otpRoute'));

// Category route
app.use('/category/', require('./routes/categoryRoute'));
// Product route
app.use('/product/', require('./routes/productRoute'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

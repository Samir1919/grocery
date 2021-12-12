const mongoose = require('mongoose')

// const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL2 = process.env.MONGO_URL2;
// const MONGODB_USER = process.env.MONGODB_USER;
// const MONGODB_PASS = process.env.MONGODB_PASS;

// const MONGO_URL = 'mongodb://UserAdmin:SamSam90@localhost:27017/ex';
const connectDB = async () => {
    const connection = await mongoose.connect(MONGO_URL2, {
        // "auth": {
        //     "authSource": "admin"
        // },
        // "user": MONGODB_USER,
        // "pass": MONGODB_PASS,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`)
}

module.exports = connectDB
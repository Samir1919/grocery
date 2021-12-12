const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
    name:  {
        type: String,
        default: null,
    },
    mobile:  {
        type: String,
        required: true,
        maxlength: 14,
        unique: true
    },
    password: {
        type: String,
        default: null,
    },
    image:  {
        type: String,
        default: null,
    },
  })

  module.exports = mongoose.model('user', UserSchema)
var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
    uid: String,
    favorites: [String],
    following: [String]
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;



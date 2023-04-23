var mongoose = require('mongoose');


var musicSchema = mongoose.Schema({
    name: String,
    description: String,
    category: String,
    speaker: String,
    file: String,
    uid: String,
    mid: String
});

const Musics = mongoose.model('Musics', musicSchema);

module.exports = Musics;



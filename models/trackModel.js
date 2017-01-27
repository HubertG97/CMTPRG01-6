var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var trackModel = new Schema({
    title: {
        type: String
    },
    artist: {type: String},
    genre: {type: String},
    played: {type :Boolean, default:false},
    _links: {
        self: {
            href: String
        },
        collection: {
            href: String
        }
    }
});

module.exports= mongoose.model('track', trackModel);
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema({
    userId: { type : String, required : true},
    name: { type : String, required : true, unique: true},
    manufacturer: { type : String, required: true},
    description: { type: String, required: true},
    mainPepper: { type : String, required : true},
    imageUrl: { type: String, required: true, unique: true},
    heat: { type : Number, required: true },
    likes: { type : Number, min : 0,  required: true },
    dislikes: { type : Number, min : 0,  required: true},
    usersLiked: { type : Array, required: true},
    usersDisliked: { type : Array, required: true},
});

sauceSchema.plugin(uniqueValidator);

module.exports= mongoose.model('Sauce', sauceSchema);
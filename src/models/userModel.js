const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
    id_from_third_party :{
        type: String,
        unique: true,
        required:true
    },
    third_party_name: {
        type: String,
        required : true
    },
    role:{
        type: String,
        required:true,
        enum: ['admin', 'user', 'client'] 

    },
    about:{
        type:String
    },
    skills:{
        type: String
    }
}, { timestamps: true});

const User = mongoose.model('User',userSchema);
module.exports = { User };
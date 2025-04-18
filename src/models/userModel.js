import mongoose from "mongoose";

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
        enum: ['admin', 'user', 'client'] 

    }
}, { timestamps: true});

const User = mongoose.model('User',userSchema);
export default User;
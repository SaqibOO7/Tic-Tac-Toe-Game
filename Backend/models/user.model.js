import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required : true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    uniqueID: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    avatar: {
        type: String
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GameRoom",
        required: true
    },
    playerStatus: {
        type: String,
        enum: ['online', 'offline', 'playing'],
        default: 'online'
    }

}, {timestamps: true})

const Challenge = new mongoose.model("Challenge", messageSchema);

export default Challenge
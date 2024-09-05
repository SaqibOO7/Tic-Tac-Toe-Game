import mongoose from "mongoose";

const gameroomSchema = new mongoose.Schema({

    player1_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    player2_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    current_turn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    board_state: {
        type: [String],
        default: Array(9).fill(null)
    },
    status: {
        type: String,
        enum: ['waiting', 'ongoing', 'completed'],
        default: 'waiting'
    },
    winner_id: {
        type: String,
        default: null
    },
    count: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const GameRoom = new mongoose.model("GameRoom", gameroomSchema)

export default GameRoom
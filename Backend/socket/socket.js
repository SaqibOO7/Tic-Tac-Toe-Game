import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import GameRoom from '../models/gameroom.model.js';
import Challenge from '../models/challange.model.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})

//For Listening challenges
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

//FOR Online user status
const userSocketMap = {}    //{userId: socket.id};

io.on('connection', (socket) => {
    //console.log("a user connected", socket.id)

    const userId = socket.handshake.query.userId;
    //console.log("a user connected", userId)

    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;
    }

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    //socket.on() is used to listen to the events. that can be used in both client and server side
    socket.on("disconnect", async () => {
        //console.log("user disconnected", socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))


        if(!userId || userId === "undefined"){
            return
        }
        // Handle player disconnection during an ongoing game
        const gameRoom = await GameRoom.findOne({
            $or: [
                { player1_id: userId },
                { player2_id: userId }
            ],
            status: "ongoing"
        });
        

        if (gameRoom) {
            // Delete game room and challenge documents

            const challengemodel = await Challenge.findOne({

                $or: [
                    {
                        senderId: gameRoom.player1_id,
                        receiverId: gameRoom.player2_id,
                        status: "accepted"
                    },
                    {
                        senderId: gameRoom.player2_id,
                        receiverId: gameRoom.player1_id,
                        status: "accepted"
                    }
                ]
    
            })

            await GameRoom.findByIdAndDelete(gameRoom._id);
            //we can also delete challenge with roomId as
            //await Challenge.findOneAndDelete({roomId: gameRoom._id})
            await Challenge.findByIdAndDelete(challengemodel?._id);

            // Notify the other player
            const otherPlayerId = gameRoom.player1_id.toString() === userId ? gameRoom.player2_id.toString() : gameRoom.player1_id.toString();
            const otherPlayerSocketId = getReceiverSocketId(otherPlayerId);

            if (otherPlayerSocketId) {
                io.to(otherPlayerSocketId).emit("opponentDisconnected", { message: "Your opponent disconnected, the game has ended." });
            }
        }



    })
})


export { app, io, server };

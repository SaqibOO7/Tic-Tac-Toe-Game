import Challenge from "../models/challange.model.js";
import GameRoom from "../models/gameroom.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendChallenge = async(req, res) => {
    try {

        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        //If a user sending more than one request
        const alreadySent = await Challenge.findOne({ $and: [ { senderId }, { receiverId }, {status: "pending"} ]});

        if(alreadySent){
            return res.status(201).json({message: "The request has already sent"})
        }

        //creating room if the challenge is successfully sent
        const roomSender = new GameRoom({
            player1_id: senderId,
            player2_id: receiverId,
            current_turn: senderId,
        })
        await roomSender.save();
        const roomId = roomSender._id;

        //creating the challenge between the two players
        const challenge = new Challenge({
            senderId,
            receiverId,
            status: 'pending',
            roomId,
        })
        await challenge.save();

        //Real Time Socket.io functionality for real time sending request
        const populatedChallenge = await challenge.populate({
            path: 'senderId',
            select: '-password',
        })
        
        const receiverScoketId = getReceiverSocketId(receiverId);
        if(receiverScoketId){

            //io.to().emit() is used to send events to specific clients
            
            io.to(receiverScoketId).emit("challenge", populatedChallenge)
        }


        res.status(201).json({
            senderId,
            receiverId,
            status : 'pending',
            roomId,
            message: "challenge sent..."
        })
        
    } catch (error) {
        console.log("Error in sendChallenge controller: ", error.message)
        res.status(500).json({error: "Internal server eroor"});
    }
}

export const acceptChallenge = async(req, res) => {
    try {

        const {id: receiverId} = req.params;  
        const senderId = req.user._id;

        //finding in the document if that particular user challenges me
        const challenge = await Challenge.findOne({ $and: [ {receiverId: senderId}, {senderId: receiverId}, {status: "pending"} ]});

        //checking if user is in room or not.If it is in room than we can not accept his challnege
        const checkIFUserinRoom = await GameRoom.findOne({
            $and: [
                {
                    $or: [
                        {player1_id: receiverId},
                        {player2_id: receiverId}
                    ]
                },
                {status: "ongoing"}
            ]
        })

        if(checkIFUserinRoom){
            return res.status(400).json({error: "Player is in Game room"});
        }

        if(!challenge){
            return res.status(404).json({error: "challenge not found"});
        }

        challenge.status = 'accepted';
        const getRoomId = challenge.roomId;
        await challenge.save();

        const Room = await GameRoom.findById(getRoomId);
        if(!Room){
            return res.status(404).json({error: "room not found"});
        }
        Room.status = "ongoing";
        await Room.save();

        //sending the info to the user who challenged me
        const senderSocketId = getReceiverSocketId(receiverId); // Sender and receiver are swapped here
        if (senderSocketId) {
            io.to(senderSocketId).emit("challengeAccepted", Room);
        }

        res.status(200).json(Room);

        
    } catch (error) {
        console.log("Error in acceptChanllenge controller: ", error.message)
        res.status(500).json({error: "Internal server eroor"});
    }
}

export const rejectChallenge = async(req, res) => {
    try {

        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        //rejecting/deleting the challenge of a paritcular user who challenges me
        const challenge = await Challenge.deleteOne({ $and: [ {receiverId: senderId}, {senderId: receiverId}, {status: "pending"} ]});
        if(!challenge){
            return res.status(404).json({error: "challenge not found"});
        }

        //removing the gameRoom which is created when the user send's the challenge
        const gameRoom = await GameRoom.deleteOne({ $and: [ {player1_id: receiverId}, {player2_id: senderId} ] });

        if(!gameRoom){
            return res.status(404).json({error: "gameRoom not found"});
        }
        res.status(200).json({message: `challenge rejected by ${senderId}`});
        
    } catch (error) {
        console.log("Error in rejectChallenge controller: ", error.message)
        res.status(500).json({error: "Internal server eroor"});
    }
}

export const getChallenge = async(req, res) => {

    try {
        const senderId = req.user._id;

        //reteriving user who challenge me
        //searching the receiverId that match with my id(sendersId) && status is pending
        const challengers = await Challenge.find({
             $and: [ {receiverId: senderId}, {status: 'pending'} ] 
        }).populate({
            path: 'senderId',
            select: '-password',
        });

        //this is for reteriving gameRoom OR entering in the gameRoom if any particular user accepts our challenge at any time
        const gameAuthUser = await Challenge.findOne({ 
            $and: [ { senderId }, {status: "accepted"} ]            
        }).populate("roomId");

        if(!challengers){
            return res.status(200).json([]);
        }

        if(challengers[0]?.length == 0){
            return res.status(200).json([])
        }

        return res.status(200).json([challengers, gameAuthUser?.roomId]);

    } catch(error){
        console.log("Error in getChallenge controller: ", error.message)
        res.status(500).json({error: "Internal server eroor"});
    }
}

export const getLobbyUsers = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;

        //reteriving the all the logedIn user except me
        const filterUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filterUser);
    } catch (error) {
        console.log("Error in getLobbyUsers controllers", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

export const getBtnOrPlayerStat = async(req, res) => {

    try {
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        //This is for button status knowing if we send the challenge to particular user
        const challenge = await Challenge.findOne({ $and: [ { senderId }, { receiverId }, {status: "pending"} ]});

        if(!challenge){
            return res.status(201).json({message: "there are no chellenge" });
        }

        return res.status(200).json(challenge);


    } catch (error) {
        console.log("Error in getBtnOrPlayerStat controller: ", error.message)
        res.status(500).json({error: "Internal server eroor"});
    }
}

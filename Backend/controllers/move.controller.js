import Challenge from "../models/challange.model.js";
import GameRoom from "../models/gameroom.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const moveOfplayer = async (req, res) => {

    try {
        const { id: roomId } = req.params;      //gameRoom Id
        const { index } = req.body;             //Index of array/board
        const senderId = req.user._id;          //Id of the user of sends the move

        //finding the gameRoom by given Id
        const gameroom = await GameRoom.findById(roomId).populate({
            path: 'player1_id',
            select: '-password',
        }).populate({                   //excluding password field
            path: 'player2_id',
            select: '-password',
        });

        if (!gameroom) {
            return res.status(200).json({ message: "No Game room found" });
        }

        //handling some cases
        if (gameroom.status != "ongoing") {
            return res.status(400).json({ message: "game is either completed or not created" });
        }

        const GameCurr = gameroom.current_turn.toString();
        const UserCurr = senderId.toString();

        //Checking if it was our turn or not
        if (GameCurr !== UserCurr) {
            return res.status(400).json({message: "NOT YOUR TURN"});
        }

        //Checking if the position is empty or not
        if (gameroom.board_state[index] !== null) {
            return res.status(400).json({ message: "Position already taken" })
        }

        //based on the player assigning the symbols
        gameroom.board_state[index] = UserCurr === gameroom.player1_id._id.toString() ? 'X' : 'O';

        //checking for the winning condition
        let checker = checkWinner(gameroom.board_state);

        //taking the record of the number of moves
        gameroom.count += 1;
        if(gameroom.count === 9){               //Drow condition
            gameroom.status = "completed";
            gameroom.winner_id = null;
            gameroom.count = 0;
        }
        
        if (checker != null) {                  //Winning condition
            gameroom.status = "completed";
            gameroom.winner_id = checker === 'X' ? gameroom.player1_id.username : gameroom.player2_id.username;
            gameroom.count = 0;
        }

        //changing the current turn 
        gameroom.current_turn = gameroom.current_turn.equals(gameroom.player1_id._id) ? gameroom.player2_id._id : gameroom.player1_id._id;
        await gameroom.save();

        //Real time functionality for sending the moves
        let receiverId = null;
        if (senderId.toString() === gameroom.player1_id._id.toString()) {
            receiverId = gameroom.player2_id._id;

        }
        else {
            receiverId = gameroom.player1_id._id;
        }
        const receiverScoketId = getReceiverSocketId(receiverId);
        if (receiverScoketId) {
            io.to(receiverScoketId).emit("sendMove", (gameroom));
        }

        res.status(200).json(gameroom);


    } catch (error) {
        console.log("Error in moveOfplayer controller: ", error.message)
        res.status(500).json({ error: "Internal server eroor" });
    }

}

export const receiveMoveOfPlayer = async (req, res) => {
    try {
        const { id: roomId } = req.params;

        //reteriving the moves based of the given Room id
        const gameroom = await GameRoom.findById(roomId).populate({
            path: 'player1_id',
            select: '-password',
        }).populate({               //excluding password field
            path: 'player2_id',
            select: '-passwrod',
        });

        if (!gameroom) {
            return res.status(400).json({ message: "no game room found" });
        }

        return res.status(200).json(gameroom)


    } catch (error) {
        console.log("Error in receiveMoveOfPlayer controller: ", error.message)
        res.status(500).json({ error: "Internal server eroor" });
    }
}

export const removeGameRoom = async (req, res) => {
    try {

        const { id: roomId } = req.params;
        const senderId = req.user._id;

        const gameroom = await GameRoom.findById(roomId);

        let receiverId = null;
        if (senderId.toString() === gameroom.player1_id._id.toString()) {
            receiverId = gameroom.player2_id._id;
        }
        else {
            receiverId = gameroom.player1_id._id;
        }

        //deleting the gameRoom and Challenge document between the two players which was created
        const challengeDoc = await Challenge.findOneAndDelete({roomId});
        const result = await GameRoom.findByIdAndDelete(roomId);

        if(!challengeDoc){
            return res.status(400).json({message: "No challenge found in the given roomID"})
        }
        if (!result) {
            return res.status(404).json({ message: 'NO game ROOm found' });
        }

        //sending the real time status of delete function to other user
        const val = null;
        const receiverScoketId = getReceiverSocketId(receiverId);
        if (receiverScoketId) {
            io.to(receiverScoketId).emit("sendDelete", (val));
        }
        return res.status(200).json({ message: 'GameRoom and challenge deleted successfully' });

    } catch (error) {
        console.log("Error in removeGameRoom controller: ", error.message)
        res.status(500).json({ error: "Internal server eroor" });
    }
}

export const updateGameRoom = async (req, res) => {
    try {
        const {id: roomId} = req.params;
        const senderId = req.user._id;

        const gameroom = await GameRoom.findById(roomId).populate({
            path: 'player1_id',
            select: '-password',
        }).populate({
            path: 'player2_id',
            select: '-password',
        });

        if(!gameroom){
            return res.status(200).json({message : "No game room found"})
        }

        //Restarting the game room based on the user choice
        gameroom.status = "ongoing";
        gameroom.winner_id = null;
        gameroom.count = 0;
        gameroom.board_state = Array(9).fill(null);

        await gameroom.save();

        //sending the status of upadated GameRoom to other user in real time
        let receiverId = null;
        if (senderId.toString() === gameroom.player1_id._id.toString()) {
            receiverId = gameroom.player2_id._id;
        }
        else {
            receiverId = gameroom.player1_id._id;
        }
        const receiverScoketId = getReceiverSocketId(receiverId);
        if (receiverScoketId) {
            io.to(receiverScoketId).emit("sendUpdate", (gameroom));
        }

        return res.status(200).json(gameroom);

    } catch (error) {
        console.log("Error in updateGameRoom controller: ", error.message)
        res.status(500).json({ error: "Internal server eroor" });
    }
}



// Helper function to check for a winner
const checkWinner = (boardState) => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],      // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],      // Columns
        [0, 4, 8], [2, 4, 6]                  // Diagonals
    ];

    for (let combination of winningCombinations) {
        
        let pos1 = boardState[combination[0]];
        let pos2 = boardState[combination[1]];
        let pos3 = boardState[combination[2]];


        if (pos1 != null && pos2 != null && pos3 != null) {
            
            if (pos1 === pos2 && pos2 === pos3) {
                return pos1;
            }
        }

    }
    return null;
};
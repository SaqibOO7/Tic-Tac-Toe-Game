import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { moveOfplayer, receiveMoveOfPlayer, removeGameRoom, updateGameRoom } from '../controllers/move.controller.js';

const router = express.Router();

router.route("/makeMove/:id").post(protectRoute, moveOfplayer)
router.route("/getMove/:id").get(protectRoute, receiveMoveOfPlayer)
router.route("/remove/:id").post(protectRoute, removeGameRoom)
router.route("/updateRoom/:id").post(protectRoute, updateGameRoom)

export default router
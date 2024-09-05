import express from 'express'
import protectRoute from '../middleware/protectRoute.js';
import { sendChallenge, acceptChallenge, rejectChallenge, getChallenge, getLobbyUsers, getBtnOrPlayerStat} from '../controllers/challenge.controller.js';

const router = express.Router();

router.route("/send/:id").post(protectRoute, sendChallenge)
router.route("/:id/accept").post(protectRoute, acceptChallenge)
router.route("/:id/reject").post(protectRoute, rejectChallenge)
router.route("/getchellenges").get(protectRoute, getChallenge)
router.route("/getBtnOrPlayerstat/:id").get(protectRoute, getBtnOrPlayerStat)
router.route("/").get(protectRoute, getLobbyUsers)


export default router
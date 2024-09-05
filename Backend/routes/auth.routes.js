import express from 'express'
import { loginUser, logoutUser, signupUser } from '../controllers/auth.controller.js';
import { upload } from '../middleware/muter.middleware.js';

const router = express.Router();

router.route('/signup').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),
    signupUser
)

router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)

export default router
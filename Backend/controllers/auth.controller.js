import bcrypt from 'bcryptjs'
import User from "../models/user.model.js"
import generateTokenAndSetCookie from '../utils/generateToken.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { io } from '../socket/socket.js';


export const signupUser = async (req, res) => {

    try {
        const { username, uniqueID, password, confirmPassword, gender } = req.body;

        if ([username, password, confirmPassword, uniqueID, gender].some((field) => field?.trim() === "")) {

            return res.status(401).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ error: "Password do not match" })
        }

        const user = await User.findOne({
            $or: [{ username }, { uniqueID }]
        });

        if (user) {
            return res.status(401).json({ error: "User already exits" })
        }

        //Hasing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //handling image files
        let avatarLocalPath;
        if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {

            avatarLocalPath = req.files.avatar[0].path;
        }

        //Uploading on Cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        //CREATING NEW USER
        const newUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
            uniqueID: uniqueID,
            gender,
            avatar: avatar?.url || ""
        })

        if (newUser) {

            //GENERATE JWT TOKEN HERE
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            io.emit('newUser', {
                _id: newUser._id,
                username: newUser.username,
                uniqueID: newUser.uniqueID,
                gender: newUser.gender,
                avatar: newUser.avatar
            });

            res.status(200).json({
                id: newUser._id,
                username: newUser.username,
                uniqueID: newUser.uniqueID,
                gender: newUser.gender,
                avatar: newUser.avatar
            })
        }
        else {
            res.status(401).json({ error: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { uniqueID, password } = req.body;

        const user = await User.findOne({ uniqueID });

        if (!user) {
            return res.status(400).json({ error: "Invalid username" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid password" });
        }

        //generating token and set cookies
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            id: user._id,
            username: user.username,
            uniqueID: user.uniqueID,
            avatar: user.avatar,
            message: "User logged in successfully"
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }

}

export const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })

    } catch (error) {
        console.log("Error in loggeout controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

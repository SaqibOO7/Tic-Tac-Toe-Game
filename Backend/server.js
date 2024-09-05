import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from "./routes/auth.routes.js"
import challengeRoute from "./routes/challenge.routes.js"
import playMoves from "./routes/playMoves.routes.js"

import connectToMongoDB from './db/connectToMongoDb.js'
import { app, server } from './socket/socket.js'


dotenv.config()
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

app.use(express.json());        
//app.use(express.static("public"))
app.use(cookieParser())


//FOR AUTHENTICATION
app.use('/api/auth', authRoutes)

//FOR SENDING [REQUEST, ACCEPT, REJECT]
app.use('/api/challenges', challengeRoute);

//FOR GAME ROOM
app.use('/api/board', playMoves);


app.use(express.static(path.join(__dirname, "/Frontend/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"))
})


server.listen(PORT, ()=>{
    connectToMongoDB();
    console.log(`Server is connected on port ${PORT}`);
})
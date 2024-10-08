import React, { createContext, useState, useEffect, useContext } from 'react'
import { useAuthContext } from './AuthContext';
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([])
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("https://tic-tac-toe-game-prod.onrender.com", {
                query: {
                    userId: authUser.id,        //this authUser.id  not ._id
                }
            });

            setSocket(socket);

            //socket.on() is used to listen to the events. can be used both on clients and server side
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            })

            return () => socket.close();
        }
        else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser])
    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}



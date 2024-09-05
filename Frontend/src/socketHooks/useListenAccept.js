import React, { useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useSocketContext } from '../context/SocketContext';

const useListenAccept = () => {
    const { gameAuthUser, setGameAuthUser } = useAuthContext();
    const { socket } = useSocketContext();

    useEffect(() => {

        socket?.on("challengeAccepted", (Room) => {
            localStorage.setItem("gameAuth-user", JSON.stringify(Room));
            setGameAuthUser(Room);
        })

        return () => socket?.off("challengeAccepted");

    }, [socket, setGameAuthUser, gameAuthUser]);

}


export default useListenAccept







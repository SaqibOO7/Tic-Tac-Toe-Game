import React, { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import { useAuthContext } from '../context/AuthContext';

const useListenDelete = () => {

    const { socket } = useSocketContext();
    const { globalGame, setGlobalGame, setGameAuthUser } = useAuthContext();

    useEffect(() => {

        socket?.on("sendDelete", (val) => {
            setGlobalGame(val);
            setGameAuthUser(val);
        })

        return () => socket?.off("sendDelete");

    }, [socket, globalGame, setGlobalGame])
}

export default useListenDelete

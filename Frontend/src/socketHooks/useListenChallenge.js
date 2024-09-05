import React, { useEffect, useState } from 'react'
import { useSocketContext } from '../context/SocketContext'
import { useAuthContext } from '../context/AuthContext';

function useListenChallenge() {

    const { socket } = useSocketContext();
    const { globalValues, setGlobalValues } = useAuthContext();

    useEffect(() => {
        socket?.on("challenge", (populatedChallenge) => {
            setGlobalValues(populatedChallenge);

        })

        return () => socket?.off("challenge");
    }, [socket, globalValues, setGlobalValues]);

}

export default useListenChallenge

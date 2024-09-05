import React, { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useListenOfflineStat = () => {
    const { socket } = useSocketContext();
    const { setGameAuthUser } = useAuthContext();

    useEffect(() => {
        socket?.on("opponentDisconnected", (data) => {
            toast(data.message, {
                style: {
                    borderRadius: '10px',
                    background: 'white',
                    color: 'black',
                }
            });
            setGameAuthUser(null);
        });

        return () => {
            socket?.off("opponentDisconnected");
        };
    }, [socket]);

}

export default useListenOfflineStat
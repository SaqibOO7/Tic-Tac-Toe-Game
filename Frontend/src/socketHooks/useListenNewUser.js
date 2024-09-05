import React, {useEffect, useState } from 'react'
import { useSocketContext } from '../context/SocketContext';

const useListenNewUser = ()  => {
    const { socket } = useSocketContext();
    const [newUserData, setNewUserData] = useState();

    useEffect(() => {
        socket?.on('newUser', (newUser) => {
            setNewUserData(newUser);

        })

        return () => socket?.off('newUser');
    }, [socket]);

    return {newUserData}
}

export default useListenNewUser

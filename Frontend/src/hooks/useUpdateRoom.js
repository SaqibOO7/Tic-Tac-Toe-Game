import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast';

const useUpdateRoom = () => {

    const { setGlobalGame, setGameAuthUser } = useAuthContext();
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const updateRoom = async (RoomID) => {
        setLoadingUpdate(true);
        try {
            const res = await fetch(`/api/board/updateRoom/${RoomID}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setGlobalGame(data);
            setGameAuthUser(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingUpdate(false);
        }
    }
    return { loadingUpdate, updateRoom };

}

export default useUpdateRoom

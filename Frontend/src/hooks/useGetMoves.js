import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useGetMoves = () => {

    const [loading1, setLoading1] = useState(false);
    const { gameAuthUser, setGlobalGame, setGameAuthUser } = useAuthContext();

    const getMoves = async (roomId) => {
        setLoading1(true);
        try {

            const res = await fetch(`/api/board/getMove/${roomId}`);
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setGlobalGame(data);
            setGameAuthUser(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading1(false);
        }
    }
    useEffect(() => {
        getMoves(gameAuthUser._id);

    }, [gameAuthUser?._id])

    return { loading1 }
}

export default useGetMoves

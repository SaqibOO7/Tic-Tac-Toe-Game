import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useSendMoves = () => {
    const [loading, setLoading] = useState(false);
    const { setGameAuthUser, setGlobalGame, gameAuthUser } = useAuthContext();

    const sendMove = async (index) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/board/makeMove/${gameAuthUser._id}`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ index }),
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
            setLoading(false);
        }

    }
    return { loading, sendMove }

}

export default useSendMoves

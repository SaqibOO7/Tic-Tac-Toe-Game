import React, { useState } from 'react'
import toast from 'react-hot-toast';

const useGetBtnAndPlayerStatus = () => {
    const [loading1, setLoading1] = useState(false);
    const [playerData, setPlayerData] = useState();

    const getBtnPlayer = async (conversation) => {
        setLoading1(true);
        try {
            const res = await fetch(`/api/challenges/getBtnOrPlayerstat/${conversation}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setPlayerData(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading1(false);
        }
    }

    return { loading1, playerData, getBtnPlayer }

}

export default useGetBtnAndPlayerStatus

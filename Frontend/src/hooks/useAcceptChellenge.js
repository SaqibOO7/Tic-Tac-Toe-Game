import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useAcceptChellenge = () => {

    const [loading1, setLoading1] = useState(false);
    const { setGameAuthUser } = useAuthContext();

    const acceptChellenge = async (chellenge) => {
        setLoading1(true);
        try {
            const res = await fetch(`/api/challenges/${chellenge}/accept`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            //localstorage
            localStorage.setItem("gameAuth-user", JSON.stringify(data))
            //context
            setGameAuthUser(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading1(false);
        }
    }
    return { loading1, acceptChellenge }

}

export default useAcceptChellenge

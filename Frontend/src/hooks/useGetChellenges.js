import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useGetChellenges = () => {

    const [loading, setLoading] = useState(false);
    const [challenges, setChellenges] = useState();
    const { setGameAuthUser } = useAuthContext();

    useEffect(() => {
        const getChallenges = async () => {
            setLoading(true);
            try {

                const res = await fetch("/api/challenges/getchellenges");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setChellenges(data[0]);


                //localstorage
                localStorage.setItem("gameAuth-user", JSON.stringify(data[1]))
                //context
                setGameAuthUser(data[1]);

            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getChallenges();
    }, [])

    return { loading, challenges, setChellenges };
}

export default useGetChellenges

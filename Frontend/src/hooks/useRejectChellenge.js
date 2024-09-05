import React, { useState } from 'react'
import toast from 'react-hot-toast';

const useRejectChellenge = () => {

    const [loading, setLoading] = useState(false);

    const rejectChallenge = async (challenge) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/challenges/${challenge}/reject`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }

            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success("Challenge rejected")
            //we can use data later

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return { loading, rejectChallenge };
}

export default useRejectChellenge

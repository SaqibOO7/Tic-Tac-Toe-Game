import React, { useState } from 'react'
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';

const useSendChellenge = () => {
    const [loading, setLoading] = useState(false);

    const { setRoomId } = useConversation();

    const sendChellenge = async (conversation) => {
        setLoading(true);
        try {

            const res = await fetch(`/api/challenges/send/${conversation}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setRoomId(data.roomId);
            toast.success("challenge Sent");

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return { loading, sendChellenge }
}

export default useSendChellenge

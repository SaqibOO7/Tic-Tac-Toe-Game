import React, { useState, useEffect } from 'react'
import useConversation from '../../zustand/useConversation'
import useSendChellenge from '../../hooks/useSendChellenge';
import useGetBtnAndPlayerStatus from '../../hooks/useGetBtnAndPlayerStatus';
import { useSocketContext } from '../../context/SocketContext';
import useListenChallenge from '../../socketHooks/useListenChallenge';

function Conversation({ conversation, latIdx }) {

    const { loading, sendChellenge } = useSendChellenge();
    const { loading1, playerData, getBtnPlayer } = useGetBtnAndPlayerStatus();
    const { onlineUsers } = useSocketContext();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const [isClicked, setIsClicked] = useState(false);

    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = onlineUsers.includes(conversation._id)

    useListenChallenge();       //listening the challenges of challenges me for users in navbar

    useEffect(() => {
        getBtnPlayer(conversation?._id);
    }, [conversation]);

    const handleClick = async () => {           //for sending the challlenge
        setIsClicked(true);
        await sendChellenge(conversation?._id);
    }

    let userProfile = "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png"
    if (conversation.avatar && conversation.avatar !== "") {
        userProfile = conversation.avatar;
    }

    return (
        <>
            <div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 
                ${isSelected ? "bg-sky-500" : ""}`}
                onClick={() => setSelectedConversation(conversation)}
            >
                {/* Profile pricture */}
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='w-12 rounded-full'>
                        <img
                            src={userProfile}
                            alt='user avatar'
                        />
                    </div>
                </div>

                {/* User name */}
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p className='font-bold text-gray-200'>{conversation.username}</p>


                        {/* Button */}

                        {playerData?.status === "pending" ? <button className='text-white btn btn-sm bg-green-500'>sent</button> :

                            <button
                                onClick={handleClick}
                                className={`text-white btn btn-sm ${isClicked ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                disabled={loading}
                            >
                                {!loading
                                    ? isClicked
                                        ? 'Sent'
                                        : 'Send Request'
                                    : (
                                        <span className="loading loading-spinner"></span>
                                    )}
                            </button>
                        }

                    </div>
                </div>
            </div>

            {!latIdx && <div className='divider my-0 py-0 h-1' />}

        </>
    )
}

export default Conversation

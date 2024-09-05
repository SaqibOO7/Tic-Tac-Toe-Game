import React, { useState } from 'react'
import useRejectChellenge from '../../hooks/useRejectChellenge';
import useAcceptChellenge from '../../hooks/useAcceptChellenge';
import { useSocketContext } from '../../context/SocketContext';

function SentUsers({ challenge, onRemove }) {

  const { loading, rejectChallenge } = useRejectChellenge();
  const { loading1, acceptChellenge } = useAcceptChellenge();
  const { onlineUsers } = useSocketContext();
  const [isVisible, setIsVisible] = useState(true);

  const handleClick1 = async () => {                  //for accept button
    await acceptChellenge(challenge.senderId._id);

  }
  const handleClick = async () => {                    //for reject button
    await rejectChallenge(challenge.senderId._id);
    onRemove(challenge._id)
    setIsVisible(false);

  }

  const isOnline = onlineUsers.includes(challenge.senderId._id);    //for online user status

  let userProfile = "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png"
  if (challenge.senderId.avatar && challenge.senderId.avatar !== "") {
    userProfile = challenge.senderId.avatar;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div>

      <div className="flex items-center justify-between px-2 py-2 gap-1">
        {/* Profile picture */}
        <div className='flex items-center gap-3 flex-1'>
          <div className={`avatar ${isOnline ? "online" : ""} shrink-0`}>
            <div className='w-12 rounded-full'>
              <img
                src={userProfile}
                alt='user avatar'
              />
            </div>
          </div>
          {/* Name of the challenger */}
          <div className="w-14 flex-1">
            <p className="text-sm font-medium text-gray-700 truncate">{challenge.senderId.username}</p>
          </div>
        </div>

        <div className="flex gap-1 items-center">

          {/* Reject button */}
          <button
            onClick={handleClick}
            className="text-white btn btn-error btn-sm"
          >
            {!loading ? "Reject" : <span className='loading loading-spinner'></span>}
          </button>

          {/* Logic for Accept Button */}

          {
            !isOnline ? (<button className="bg-gray-500 text-white font-bold py-1 px-2 rounded-lg cursor-not-allowed opacity-50"
                        disabled
                        >
                        Offline
                        </button>)
                        :
                        (<button
                          onClick={handleClick1}
                          className="text-white btn btn-accent btn-sm"
                        >
                        
                        {!loading1 ? "Accept" : <span className='loading loading-spinner'></span>}

                        </button>)
          }


        </div>
      </div>



    </div>
  )
}

export default SentUsers

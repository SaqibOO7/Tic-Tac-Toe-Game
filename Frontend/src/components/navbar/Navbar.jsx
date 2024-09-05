import React, { useState, useEffect } from 'react'
import SentUsers from './SentUsers';
import { FaBell } from "react-icons/fa";
import useGetChellenges from '../../hooks/useGetChellenges';
import { useAuthContext } from '../../context/AuthContext';
import useListenAccept from '../../socketHooks/useListenAccept';

function Navbar() {

    const { authUser, globalValues } = useAuthContext();
    const { loading, challenges, setChellenges } = useGetChellenges();     //hook to get the challenges

    useListenAccept();      //for listening the incoming challenges in real time

    const [isProfileOpen, setIsProfileOpen] = useState(false);          //for drop down
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    }

    const removeChallenge = (id) => {           //for rejecting/removing the challenges
        setChellenges((prevChallenges) => prevChallenges.filter(challenge => challenge._id !== id));
    }

    useEffect(() => {           //For adding the incoming challenges
        if (globalValues) {
            setChellenges((prevChallenges) => [...(prevChallenges || []), globalValues]);
        }
    }, [globalValues, setChellenges]);

    let userProfile = "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png"
    if(authUser.avatar && authUser.avatar !== ""){
        userProfile = authUser.avatar;
    }

    return (
        <>

            <nav className='flex flex-col md:flex-row bg-slate-800 h-auto md:h-16 items-center p-4'>
                <div className='flex items-center'>
                    <img className='h-12 w-12 rounded-full cursor-pointer' 
                        src={userProfile}
                        alt="" 
                    />
                    <p className='ml-3 font-semibold text-slate-200 text-center md:text-left'>{authUser.username.toUpperCase()}</p>
                </div>

                <div className='mt-2 md:mt-0 md:ml-auto md:mr-auto font-semibold text-slate-200 text-lg md:text-2xl text-center'>
                    Welcome to the Game
                </div>

                <div className=' mt-2 md:mt-0'>
                    <FaBell onClick={toggleProfile} className='cursor-pointer' />
                    {isProfileOpen && (
                        <div className="absolute mt-2 min-w-[19rem] max-w-[40rem] h-60 bg-white rounded-md shadow-xl py-2 z-20 overflow-auto right-0">


                            {challenges.length == 0 ? <p className='text-xl font-semibold text-center mt-10 text-black'>No Chellenge found</p> : challenges.map((challenge) => (
                                <SentUsers
                                    key={challenge._id}
                                    challenge={challenge}
                                    onRemove={removeChallenge}
                                />
                            ))}


                        </div>
                    )}

                </div>

            </nav>
        </>

    )
}

export default Navbar







//     import { useState } from 'react';

// const Navbar = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   return (
//     <nav className="bg-gray-800 p-4 flex justify-between items-center">
//       <div className="text-white">MyApp</div>
//       <div className="relative">
//         <button onClick={toggleProfile} className="text-white focus:outline-none">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 14l9-5-9-5-9 5 9 5zm0 7v-5.13a5.001 5.001 0 00-4 0V21m8-10.87a5.001 5.001 0 00-4 0"
//             />
//           </svg>
//         </button>
//         {isProfileOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
//             <div className="flex items-center px-4 py-2">
//               <img
//                 className="w-10 h-10 rounded-full"
//                 src="https://via.placeholder.com/150"
//                 alt="User profile"
//               />
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-700">John Doe</p>
//               </div>
//             </div>
//             <div className="px-4 py-2">
//               <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md">
//                 Action
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

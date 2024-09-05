import React, { useState } from 'react'
import Conversation from './Conversation'
import useGetConversation from '../../hooks/useGetConversation'
import useListenNewUser from '../../socketHooks/useListenNewUser';

function Conversations() {

	const { loading, conversations } = useGetConversation();  //for getting the lobby players
	const { newUserData } = useListenNewUser();		//Listen for new User

	// Update the conversations list when a new user is detected
	const updatedConversations = newUserData ? [...conversations, newUserData] : conversations;  // Add new user to the existing list



	return (
		<div className='py-2 flex flex-col overflow-auto w-full h-full'>

			{updatedConversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					lastIdx={idx === conversation.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner'></span> : null}


		</div>
	)
}

export default Conversations

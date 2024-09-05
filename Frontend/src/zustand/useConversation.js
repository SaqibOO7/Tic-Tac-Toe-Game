import { create } from 'zustand'

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

    setRoomId: (roomId) => set({ roomId })
}))

export default useConversation;
import React, { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import { useAuthContext } from '../context/AuthContext';

const useListenMoves = () => {

  const { socket } = useSocketContext();
  const { globalGame, setGlobalGame, setGameAuthUser } = useAuthContext();

  useEffect(() => {
    socket?.on("sendMove", (gameroom) => {
      setGlobalGame(gameroom);
      if (gameroom != null) {
        setGameAuthUser(gameroom);
      }
    })

    return () => socket?.off("sendMove");
  }, [socket, globalGame, setGlobalGame])


}

export default useListenMoves

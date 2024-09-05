import React, { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import { useAuthContext } from '../context/AuthContext';

const useListenUpdate = () => {

  const { socket } = useSocketContext();
  const { globalGame, setGlobalGame, setGameAuthUser } = useAuthContext();

  useEffect(() => {
    socket?.on("sendUpdate", (gameroom) => {
      setGlobalGame(gameroom);
      setGameAuthUser(gameroom);
    })

    return () => socket?.off("sendUpdate");
  }, [socket, globalGame, setGlobalGame])

}

export default useListenUpdate

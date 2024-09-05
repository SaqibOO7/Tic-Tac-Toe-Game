import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useDeleteRoom = () => {
  const [loading2, setLoading2] = useState();
  const { setGlobalGame, setGameAuthUser } = useAuthContext();

  const deleteRoom = async (RoomId) => {

    setLoading2(true);
    try {
      const res = await fetch(`/api/board/remove/${RoomId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        }
      })
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGameAuthUser(null);
      setGlobalGame(null);
      localStorage.removeItem("gameAuth - user");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading2(false);
    }
  }

  return { loading2, deleteRoom };
}

export default useDeleteRoom

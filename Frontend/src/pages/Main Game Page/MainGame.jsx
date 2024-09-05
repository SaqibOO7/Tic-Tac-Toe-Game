import React, { useState, useEffect, useCallback, useMemo } from 'react'
import useSendMoves from '../../hooks/useSendMoves';
import { useAuthContext } from '../../context/AuthContext';
import useGetMoves from '../../hooks/useGetMoves';
import useDeleteRoom from '../../hooks/useDeleteRoom';
import useListenMoves from '../../socketHooks/useListenMoves';
import useListenUpdate from '../../socketHooks/useListenUpdate';
import useUpdateRoom from '../../hooks/useUpdateRoom';
import useListenDelete from '../../socketHooks/useListenDelete';
import useListenOfflineStat from '../../socketHooks/useListenOfflineStat';
import toast from 'react-hot-toast';



function MainGame() {

  const [board, setBoard] = useState(Array(9).fill(null));
  const { authUser, gameAuthUser, globalGame } = useAuthContext();
  const { loading, sendMove } = useSendMoves();
  const { loading1 } = useGetMoves();
  const { loading2, deleteRoom } = useDeleteRoom();
  const { loadingUpdate, updateRoom } = useUpdateRoom();
  const [isGameOver, setIsGameOver] = useState(false);


  useListenMoves();
  useListenUpdate();
  useListenDelete();
  useListenOfflineStat();


  const userProfile = useMemo(() => {
    return authUser.avatar && authUser.avatar !== ""
      ? authUser.avatar
      : "https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png";
  }, [authUser.avatar]);

  const rivalProfile = useMemo(() => {
    if (gameAuthUser?.player1_id._id === authUser.id) {
      return gameAuthUser.player2_id;
    }
    return gameAuthUser?.player1_id;
  }, [authUser.id, gameAuthUser]);


  useEffect(() => {
    if (globalGame?.board_state) {
      setBoard(globalGame.board_state);
    }
  }, [globalGame]);


  useEffect(() => {
    if (globalGame?.status === "completed") {
      setIsGameOver(true);
    }
    else {
      setIsGameOver(false);
    }
  }, [gameAuthUser, globalGame?.status, globalGame]);


  const handleClick = useCallback(async (index) => {
    if (board[index]) return;

    if (globalGame.current_turn === authUser.id) {
      await sendMove(index);
      const newBoard = board.slice();
      newBoard[index] = globalGame?.player1_id === authUser.id ? 'X' : 'O';
      setBoard(newBoard);
    }
    else {
      toast.error("Not Your Turn");
    }

  }, [board, authUser.id, globalGame, sendMove]);



  const handleOnclickUpadate = async () => {
    await updateRoom(globalGame?._id);
  }
  const handleOnclickDelete = async () => {
    await deleteRoom(globalGame?._id);
  }


  const renderCell = (index) => (
    <div
      className="w-24 h-24 border flex items-center justify-center text-4xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </div>
  );



  return (
    <div className='min-h-screen bg-cyan-200 p-4'>
      <h1 className="sm:text-4xl text-2xl bg-slate-800 p-2 font-serif text-white text-center rounded-lg">WELCOME TO TIC TAC TOE GAME</h1>

      <div className='flex justify-between items-center sm:mx-10 sm:mt-3 gap-1 mt-3'>

        {/*  User Player Info */}

        <div className='flex flex-col items-center'>
          <div className='sm:h-36 sm:w-36 h-24 w-24 rounded-full bg-center bg-cover overflow-hidden bg-no-repeat shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer'>
            <img src={userProfile} alt="" className="h-full w-full object-cover" />
          </div>
          <div className='sm:text-2xl text-xl font-bold text-green-600 sm:mt-2'>YOU</div>
        </div>

        {/* Move status info */}
        <div className='text-center'>
          <h2 className="sm:text-3xl text-xl font-bold text-blue-700 sm:mb-5">
            {authUser.id === globalGame?.current_turn ? "Your Turn" : "Opponent Turn"}
          </h2>
          <h2 className='text-center sm:text-4xl text-xl font-extrabold text-yellow-600 mb-4'>V/S</h2>
        </div>

        {/* Opponent Info */}
        <div className='flex flex-col items-center'>
          <div className='sm:h-36 sm:w-36 h-24 w-24 rounded-full bg-center bg-cover overflow-hidden bg-no-repeat shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer'>
            <img src={rivalProfile.avatar} alt="" className="h-full w-full object-cover" />
          </div>
          <div className='sm:text-2xl text-xl font-bold text-red-400 sm:mt-2'>
            {rivalProfile.username}
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex flex-col items-center mt-7">
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, index) => (
            <div key={index}>{renderCell(index)}</div>
          ))}
        </div>
      </div>


      {/* Notification window when the game is completed or drow */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="card bg-neutral text-neutral-content w-80 md:w-96">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-xl md:text-2xl">
                {gameAuthUser.winner_id === authUser.username ? <span className='text-green-500'>You Won!</span> : <span className='text-red-600'>You Lose!</span>}
              </h2>
              {globalGame.winner_id !== null ? <p className='text-lg md:text-xl'>The Winner is <b>{globalGame.winner_id}</b></p> : <p className='text-lg md:text-xl'>The Game is Draw</p>}

              <div className="card-actions justify-end">
                <button
                  onClick={handleOnclickUpadate}
                  className="btn btn-primary">
                  {loadingUpdate ? <span className='loading loading-spinner'></span> : "Restart"}
                </button>

                <button
                  onClick={handleOnclickDelete}
                  className="btn btn-error">
                  {loading2 ? <spand className="loading loading-spinner"></spand> : "Exit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default MainGame
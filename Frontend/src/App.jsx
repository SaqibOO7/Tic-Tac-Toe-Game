import Login from "./pages/login/Login"
import SignUp from "./pages/signup/SignUp"
import Home from "./pages/home/Home"
import MainGame from "./pages/Main Game Page/MainGame"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from "./context/AuthContext"
import useConversation from "./zustand/useConversation"
import { useEffect } from "react"

function App() {

    const { authUser, gameAuthUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser) {
            if (gameAuthUser && (gameAuthUser.status === "ongoing" || gameAuthUser.status === "completed")) {
                navigate('/game');
            } else {
                navigate('/auth');
            }
        }
    }, [authUser, gameAuthUser, navigate]);

    return (
        <>
            <Routes>
                <Route path="/" element={authUser ? <Navigate to="/game" /> : <Navigate to="/auth" />} />
                <Route path="/game" element={gameAuthUser && (gameAuthUser.status === "ongoing" || gameAuthUser.status === "completed") ? <MainGame /> : <Navigate to="/auth" />} />
                <Route path="/auth" element={authUser ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
                <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
            </Routes>
            <Toaster />
        </>
    )
}

export default App









{/* <Route path="/" element={authUser ? <Home /> : <Login/>} />
                
<Route path="/" element={authUser && gameAuthUser?.status === "ongoing" ? <MainGame /> : <Navigate to="/"/>}/>
{/* <Route path="/gameroom" element={gameAuthUser ? < Navigate to="/game" /> : <Navigate to="/"/>} /> */}
{/* <Route path='/' element={authUser && gameAuthUser?.status === "ongoing" ? <MainGame /> : <Home />} />
<Route path='/' element={!authUser && !gameAuthUser ? <Home /> : <Navigate to={"/login"} />} /> */}
{/* <Route path='/signup' element={authUser ? <Navigate to="/" /> : <SignUp/>} />
<Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} /> */} 
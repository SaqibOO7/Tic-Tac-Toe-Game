import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("game-user")) || null);
    const [gameAuthUser, setGameAuthUser] = useState(JSON.parse(localStorage.getItem("gameAuth-user")) || null);
    const [globalValues, setGlobalValues] = useState();
    const [globalGame, setGlobalGame] = useState();

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, gameAuthUser, setGameAuthUser, globalValues, setGlobalValues, globalGame, setGlobalGame }}>
            {children}
        </AuthContext.Provider>

    )
}
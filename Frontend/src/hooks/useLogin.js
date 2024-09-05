import { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {

    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async ({ uniqueID, password }) => {
        const success = handleInputErrors({ uniqueID, password });
        if (!success) return

        setLoading(true)
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uniqueID, password }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error)
            }

            //localstorage
            localStorage.setItem("game-user", JSON.stringify(data))
            //context
            setAuthUser(data);


        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }



    }
    return { loading, login }
}

export default useLogin



function handleInputErrors({ uniqueID, password }) {
    if (!uniqueID || !password) {
        toast.error("All fields are required");
        return false
    }
    if (password.length < 6) {
        toast.error("Enter a valid 6 length password")
        return false
    }
    return true
}
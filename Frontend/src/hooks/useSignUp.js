import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignUp = () => {
    const [loading, setLoading] = useState(false);

    const { setAuthUser } = useAuthContext()

    const signup = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
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
    return { loading, signup }

}

export default useSignUp

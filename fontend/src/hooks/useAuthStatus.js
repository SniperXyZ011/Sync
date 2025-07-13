import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAuthUser } from '../redux/userSlice';


const useAuthStatus = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/auth-status`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if(response.status === 200){
                    dispatch(setAuthUser(response.data));
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                dispatch(setAuthUser(null));
            }
        }
        checkAuth();

        return () => {
            isMounted = false;
        }
    }, [dispatch]);
}

export default useAuthStatus;

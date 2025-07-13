import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/`);
        console.log(res);
        dispatch(setOtherUsers(res.data));
      } catch (e) {
        console.log(e);
      }
    };
    fetchOtherUsers();
  }, []);
};

export default useGetOtherUsers;

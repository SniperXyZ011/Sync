import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

const Login = () => {
    const [user , setUser] = useState({
        username : "",
        password : ""
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(user);
        try {
            const res = await axios.post("http://localhost:8080/api/v1/user/login", user, {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            });
      
            if(res.status === 200) {
              console.log(res.data)
              navigate("/");
              dispatch(setAuthUser(res.data));
            } 
      
            console.log(res);
          }catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
          }
        setUser({
            username : "",
            password : ""
        })
    }
  return (
    <div className="min-w-96 mx-auto">
      <div className="h-full w-full p-6 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-gray-800">
                UserName
              </span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              type="text"
              placeholder="UserName"
              className="w-full input input-border h-10 bg-white"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-gray-800">
                Password
              </span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="w-full input input-border h-10 bg-white"
            />
          </div>
          <div className="flex gap-1 text-sm my-2 justify-center"> 
            <p>Don't have an account?</p>
            <Link to="/signup" className=" text-gray-600">
              signup
            </Link>
          </div>
          <div>
            <button className="btn btn-block btn-sm mt-2 text-white" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

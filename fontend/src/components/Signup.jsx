import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "", 
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(user);
    try {
      const res = await axios.post("http://localhost:8080/api/v1/user/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if(res.data.success) {
        toast.success(res.data.message);
        console.log(res.data.message)
        navigate("/login");
      } 

      console.log(res);
    }catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    })
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="h-full w-full p-6 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800">Signup</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="">
            <label className="label p-2">
              <span className="text-base label-text text-gray-800">
                Full Name
              </span>
            </label>
            <input
              value={user.fullName}
              onChange={(e) => {
                setUser({ ...user, fullName: e.target.value });
              }}
              type="text"
              placeholder="Full Name"
              className="w-full input input-border h-10 bg-white"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-gray-800">
                UserName
              </span>
            </label>
            <input
              value={user.username}
              onChange={(e) => {
                setUser({ ...user, username: e.target.value });
              }}
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
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
              type="password"
              placeholder="Password"
              className="w-full input input-border h-10 bg-white"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-gray-800">
                Confirm Password
              </span>
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) => {
                setUser({ ...user, confirmPassword: e.target.value });
              }}
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-border h-10 bg-white"
            />
          </div>
          <div className="flex gap-3 my-2">
            <div className="flex items-center gap-1">
              <p className="text-gray-800 text-sm">Male</p>
              <input
                type="checkbox"
                className="checkbox border border-gray-400" 
                onClick={() => {
                  setUser({ ...user, gender: "male" });
                }}
              />
            </div>
            <div className="flex items-center mx-2 gap-1">
              <p className="text-gray-800 text-sm">Female</p>
              <input
                type="checkbox"
                className="checkbox border border-gray-400"
                onClick={() => {
                  setUser({ ...user, gender: "female" });
                }}
              />
            </div>
          </div>
          <div className="flex gap-1 text-sm justify-center">
            <p> Already have an account?</p>
            <Link to="/login" className=" text-gray-600">
              login
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2 text-white"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

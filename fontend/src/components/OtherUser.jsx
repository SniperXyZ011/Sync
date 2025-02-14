import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { useSelector } from "react-redux";



const OtherUser = ({user}) => {
  // const user = props.user;
  const dispatch = useDispatch();
  const {selectedUser, onlineUsers} = useSelector(store=>store.user);
  const isOnline = onlineUsers?.includes(user._id);
  const selectedUserhandler = (user) => {
    dispatch(setSelectedUser(user));
    console.log(user);
  }

    return <>
        <div className={`${selectedUser?._id == user?._id ? 'bg-zinc-300 text-gray-900' : '' } flex items-center gap-2 hover:bg-zinc-300 rounded-md p-1 cursor-pointer text-gray-200 hover:text-gray-800`} onClick={() => selectedUserhandler(user)}>
        <div className={`avatar ${isOnline ? 'online' : '' }`}>
          <div className="w-10 rounded-full">
            <img src={user?.profilePhoto} />
          </div>
        </div>
        <div className="">
          <div className="gap-2">
            <p>{user?.fullName}</p>
          </div>
        </div>
      </div>
      <div className="divider my-0 py-0 h1"></div>
    </> 
};

export default OtherUser;
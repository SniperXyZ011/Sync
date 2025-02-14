import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = () => {
  useGetOtherUsers(); // this is a custom hook created to fetch all the users in the db
  const {otherUsers} = useSelector(store => store.user);
  if(!otherUsers) {
    return; // early return when there are currently no users
  }
  return (
    <div className="overflow-auto flex-1">
        {
          otherUsers?.map((user) => {
            return <OtherUser key={user._id} user={user}/>
          })
        }
    </div>
  );
};

export default OtherUsers;

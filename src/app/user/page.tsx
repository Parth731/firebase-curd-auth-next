"use client";
import MyFirebaseContext from "@/context/MyFirebaseContext";
import React from "react";

const UserPage = () => {
  const firebase = MyFirebaseContext();
  console.log(firebase?.user);
  return (
    <div>
      <h1>Welcome</h1>
      <h1>{firebase?.user?.email}</h1>
      <h1>{firebase?.user?.displayName}</h1>
    </div>
  );
};

export default UserPage;

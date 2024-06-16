import React, { useContext } from "react";
import { FirebaseContext } from ".";

const MyFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("MyFirebaseContext must be used within a MyProvider");
  }
  return context;
};

export default MyFirebaseContext;

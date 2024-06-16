import { AuthError } from "firebase/auth";
import { toast } from "react-toastify";

export const handleAuthError = (error: AuthError): any => {
  switch (error.code) {
    case "auth/user-not-found":
      //   return new Error("No user found with this email.");
      return toast.error("No user found with this email.");
    case "auth/wrong-password":
      return new Error("Incorrect password.");
    case "auth/invalid-email":
      return new Error("Invalid email format.");
    case "auth/user-disabled":
      return new Error("This user has been disabled.");
    default:
      return new Error("An unexpected error occurred.");
  }
};

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MyFirebaseContext from "@/context/MyFirebaseContext";
import { toast } from "react-toastify";
import { handleAuthError } from "@/utils/utils";

const LoginPage = () => {
  const firebase = MyFirebaseContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (firebase.isLoggedIn) {
      // navigate to home
      router.push("/books");
    }
  }, [firebase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await firebase.singinUserWithEmailAndPass(email, password);
      console.log("Successfull", result);
      toast.success("Log in successfully ....!!");
      setTimeout(() => {
        router.push("/books");
      }, 1000);
    } catch (error: any) {
      //   handleAuthError(error);
      console.log(error);
      toast.error(error?.errors?.message);
    }
  };

  return (
    <div className="container mt-5">
      <Form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <h1 className="mt-5 mb-5">OR</h1>
      <Button onClick={firebase.signinWithGoogle} variant="danger">
        Signin with Google
      </Button>
    </div>
  );
};

export default LoginPage;

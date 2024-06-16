"use client";
import React, { ReactNode, createContext, useEffect, useState } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { COLLECTION_NAME, IMAGE_PATH } from "@/constant/constant";
import { useRouter } from "next/navigation";
import { timeStamp } from "console";
const firebaseConfig = {
  apiKey: "AIzaSyBNjTxI2Nc_yasjIqNZrvngyThijzVAooA",
  authDomain: "next-curd-firebase.firebaseapp.com",
  projectId: "next-curd-firebase",
  storageBucket: "next-curd-firebase.appspot.com",
  messagingSenderId: "876539845562",
  appId: "1:876539845562:web:a7cf6e2db2d55f2a6a1b83",
};

export const FirebaseContext = createContext<MyContextType | null>(null);

// Initialize Firebase

type MyContextType = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  signupUserWithEmailAndPassword: (email: string, password: string) => void;
  singinUserWithEmailAndPass: (email: string, password: string) => void;
  signinWithGoogle: () => void;
  isLoggedIn: boolean;
  user: any;
  handleCreateNewListingByAddDoc: any;
  handleCreateNewListingBySetDoc: any;
  getOrders: (bookId: string) => any;
  fetchMyBooks: (userId: any) => any;
  placeOrder: (bookId: any, qty: any) => any;
  getImageURL: (path: any) => any;
  getBookById: (id: string) => any;
  listAllBooks: () => any;
  updateBooks: any;
  handleDeleteBookFunc: any;
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user: any) => {
      console.log(user);
      if (user) setUser(user);
      else router.push("/login");
    });
  }, []);

  const signupUserWithEmailAndPassword = (email: string, password: string) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password);

  const singinUserWithEmailAndPass = (email: string, password: string) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);

  const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

  // add new books
  const handleCreateNewListingByAddDoc = async (
    name: any,
    isbn: any,
    price: any,
    cover: any,
    imageURL: string
  ) => {
    console.log(name, isbn, price, cover);
    // const imageRef = ref(storage, `${IMAGE_PATH}${Date.now()}-${cover.name}`);
    // const uploadResult = await uploadBytes(imageRef, cover);
    return await addDoc(collection(firestore, COLLECTION_NAME), {
      name: name,
      isbn,
      price,
      imageURL,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      timeStamp: serverTimestamp(),
    });
  };

  const handleCreateNewListingBySetDoc = async (
    values: any,
    imageURL: string
  ) => {
    console.log(values, imageURL);
    // const imageRef = ref(storage, `${IMAGE_PATH}${Date.now()}-${cover.name}`);
    // const uploadResult = await uploadBytes(imageRef, cover);
    return await setDoc(doc(collection(firestore, COLLECTION_NAME)), {
      name: values.bookName,
      isbn: values.isbn,
      price: values.price,
      imageURL: imageURL,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      timeStamp: serverTimestamp(),
    });
  };

  const updateBooks = async (values: any, bookId: number, imageURL: string) => {
    console.log(values, bookId);
    return await updateDoc(doc(firestore, COLLECTION_NAME, bookId), {
      name: values.bookName,
      isbn: values.isbn,
      price: values.price,
      imageURL: imageURL,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      timeStamp: serverTimestamp(),
    });
  };

  const handleDeleteBookFunc = async (id: string) => {
    return await deleteDoc(doc(firestore, "books", id));
  };

  // get all books
  const listAllBooks = () => {
    return getDocs(collection(firestore, "books"));
  };

  // get single book by id
  const getBookById = async (id: string) => {
    const docRef = doc(firestore, "books", id);
    const result = await getDoc(docRef);
    return result;
  };

  // get image url
  const getImageURL = async (path: any) => {
    const imageRef = ref(storage, path);
    return await getDownloadURL(imageRef);
  };

  // place order (create order collection inside books document)
  const placeOrder = async (bookId: string, qty: number) => {
    const collectionRef = collection(firestore, "books", bookId, "orders");
    const result = await addDoc(collectionRef, {
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      qty: Number(qty),
      timeStamp: serverTimestamp(),
    });
    return result;
  };

  // fetch my ordered single books
  const fetchMyBooks = async (userId: any) => {
    const collectionRef = collection(firestore, "books");
    // const q = query(collectionRef, where("userID", "==", userId));
    const q = query(collectionRef);

    const result = await getDocs(q);
    return result;
  };

  // get all orders
  const getOrders = async (bookId: any) => {
    console.log("book =>  ", bookId);
    const collectionRef = await collection(
      firestore,
      "books",
      bookId,
      "orders"
    );
    console.log("collectionRef => ", collectionRef);
    const result = await getDocs(collectionRef);
    console.log(result);
    return result;
  };

  const isLoggedIn = user ? true : false;

  return (
    <FirebaseContext.Provider
      value={{
        name,
        setName,
        signupUserWithEmailAndPassword,
        singinUserWithEmailAndPass,
        signinWithGoogle,
        isLoggedIn,
        user,
        handleCreateNewListingByAddDoc,
        handleCreateNewListingBySetDoc,
        getBookById,
        getImageURL,
        placeOrder,
        listAllBooks,
        getOrders,
        fetchMyBooks,
        updateBooks,
        handleDeleteBookFunc,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;

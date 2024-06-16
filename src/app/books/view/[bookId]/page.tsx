"use client";
import MyFirebaseContext from "@/context/MyFirebaseContext";
import { singleBookType } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

const BookDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  console.log(params);
  const firebase = MyFirebaseContext();

  const [qty, setQty] = useState<number>(1);
  const [loading, setloading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [url, setURL] = useState<any>(null);

  console.log(data);

  useEffect(() => {
    // firebase
    //   .getBookById(params.bookId as string)
    //   .then((value: any) => setData(value.data()));

    const fetchData = async () => {
      setloading(true);
      try {
        const bookItem = await firebase.getBookById(params.bookId as string);
        setData(bookItem.data());
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     const imageURL = data.imageURL;
  //     firebase.getImageURL(imageURL).then((url: any) => setURL(url));
  //   }
  // }, [data]);

  const placeOrder = async () => {
    try {
      const result = await firebase.placeOrder(params.bookId, qty);
      if (result) {
        toast.success("Order Placed successfully");
        router.push("/books/orders");
      }
    } catch (error: any) {
      console.log(error);
      return toast.error(error?.message);
    }
  };

  if (data == null) return <h1>Loading...</h1>;

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : data ? (
        <div className="container mt-5">
          <h1>{data.name}</h1>
          <img
            src={data?.imageURL}
            width="50%"
            style={{ borderRadius: "10px" }}
          />
          <h1>Details</h1>
          <p>Price: Rs. {data.price}</p>
          <p>ISBN Number. {data.isbn}</p>
          <h1>Owner Details</h1>
          <p>Name: {data.displayName}</p>
          <p>Email: {data.userEmail}</p>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Qty</Form.Label>
            <Form.Control
              onChange={(e: any) => setQty(e.target.value)}
              value={qty}
              type="Number"
              placeholder="Enter Qty"
            />
          </Form.Group>
          <Button onClick={placeOrder} variant="success">
            Buy Now
          </Button>
        </div>
      ) : (
        <h1>Book Not Found</h1>
      )}
    </>
  );
};

export default BookDetailPage;

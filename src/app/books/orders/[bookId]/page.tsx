"use client";
import MyFirebaseContext from "@/context/MyFirebaseContext";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
const ViewOrderDetails = () => {
  const params = useParams();
  const firebase = MyFirebaseContext();
  console.log(params);
  const { bookId } = params;
  console.log(bookId);
  const [orders, setOrders] = useState([]);
  const [loading, setloading] = useState<boolean>(false);

  console.log(orders);

  useEffect(() => {
    // if (!firebase.isLoggedIn) return;
    // firebase.getOrders(bookId as any).then((orders: any) => {
    //   setOrders(orders.docs);
    // });
    const fetchData = async () => {
      setloading(true);
      try {
        const bookItem = await firebase.getOrders(bookId as any);
        setOrders(bookItem.docs);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, [bookId]);

  return (
    <div className="container mt-3">
      {loading ? (
        <h1>Loading...</h1>
      ) : orders && orders?.length !== 0 ? (
        <>
          <h1>Orders</h1>
          {orders.map((order: any) => {
            const data = order.data();
            console.log(data);
            return (
              <div
                key={order.id}
                className="mt-5"
                style={{ border: "1px solid", padding: "10px" }}
              >
                <h5>Order By: {data.displayName}</h5>
                <h6>Qty: {data.qty}</h6>
                <p>Email: {data.userEmail}</p>
              </div>
            );
          })}
        </>
      ) : (
        <h1>No orders found</h1>
      )}
    </div>
  );
};

export default ViewOrderDetails;

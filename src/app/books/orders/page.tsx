"use client";
import BookCard from "@/components/Card";
import MyFirebaseContext from "@/context/MyFirebaseContext";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const OrdersPage = () => {
  const firebase = MyFirebaseContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // if (firebase.isLoggedIn)
    // firebase
    //   .fetchMyBooks(firebase?.user?.uid)
    //   ?.then((books: any) => setBooks(books.docs));
    const fetchData = async () => {
      setLoading(true);
      try {
        const bookslist = await firebase.fetchMyBooks(firebase?.user?.uid);
        setBooks(bookslist.docs);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firebase]);

  console.log(books);

  if (!firebase.isLoggedIn) return <h1>Please log in</h1>;

  return (
    <div className="container mt-5">
      {/* {books.map((book: any) => (
        <BookCard
          link={`/books/orders/${book.id}`}
          key={book.id}
          id={book.id}
          {...book.data()}
        />
      ))} */}
      {loading ? (
        <div>Loading...</div>
      ) : books?.length !== 0 ? (
        <Row>
          {books.map((book: any) => (
            <Col
              key={book.id}
              xs={12}
              sm={6}
              md={4}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <BookCard
                link={`/books/orders/${book.id}`}
                key={book.id}
                id={book.id}
                {...book.data()}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          <h1>No Data Found</h1>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

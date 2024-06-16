"use client";
import React, { useEffect, useState } from "react";
import CardGroup from "react-bootstrap/CardGroup";

import BookCard from "../components/Card";
import MyFirebaseContext from "@/context/MyFirebaseContext";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const firebase = MyFirebaseContext();
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    // firebase.listAllBooks().then((books: any) => {
    //   console.log(books.docs);
    //   setBooks(books.docs);
    // });
    const fetchData = async () => {
      setloading(true);
      try {
        const bookslist = await firebase.listAllBooks();
        setBooks(bookslist.docs);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, []);

  // console.log(books.map((book: any) => book.data()));

  const handleDeleteBook = async (id: string) => {
    try {
      await firebase.handleDeleteBookFunc(id);
      setBooks(books.filter((book: any) => book.id !== id));
      toast.success("book is delete successfully");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div>Loading</div>
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
                link={`/books/view/${book.id}`}
                editlink={`/books?edit=true&uid=${book.id}`}
                deletelink={`/books?edit=true&uid=${book.id}`}
                key={book.id}
                id={book.id}
                handleDeleteBook={handleDeleteBook}
                {...book.data()}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          <h1>No books found</h1>
        </div>
      )}
    </div>
  );
};

export default HomePage;

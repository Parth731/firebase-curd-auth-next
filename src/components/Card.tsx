import MyFirebaseContext from "@/context/MyFirebaseContext";
import { BookType } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";

const BookCard = (props: any) => {
  console.log(props);
  const firebase = MyFirebaseContext();
  const router = useRouter();

  const [url, setURL] = useState<string>("");

  // useEffect(() => {
  //   firebase
  //     .getImageURL(props.imageURL)
  //     .then((url: string) => setURL(url))
  //     .catch((error: any) => toast.error("Error fetching image: " + error));
  // }, []);

  console.log(props);

  return (
    <Card
      style={{
        width: "25rem",
        margin: "10px",
        height: "25rem",
        borderRadius: "10px",
      }}
    >
      {/* <Image
        src={url}
        alt="images"
        height={500}
        width={400}
        style={{
          objectFit: "cover",
          backgroundImage: "cover",
          borderRadius: "10px",
        }}
      /> */}
      <Card.Img
        variant="top"
        src={props?.imageURL}
        style={{
          borderRadius: "10px",
        }}
      />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
          This book has a title {props.name} and this book is sold by{" "}
          {props.displayName} and this book costs Rs.{props.price}
        </Card.Text>
        <Button onClick={(e) => router.push(props.link)} variant="primary">
          View
        </Button>
        {props.editlink && (
          <Button
            onClick={(e) => router.push(props.editlink!)}
            variant="secondary"
            style={{ marginLeft: "10px" }}
          >
            Edit
          </Button>
        )}
        {props.deletelink && (
          <Button
            onClick={(e) => props.handleDeleteBook(props.id)}
            variant="secondary"
            style={{ marginLeft: "10px" }}
          >
            Delete
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookCard;

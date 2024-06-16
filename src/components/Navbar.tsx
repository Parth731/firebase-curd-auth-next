"use client";
import Link from "next/link";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const MyNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Navbar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} href="/" className="m-3">
            Home
          </Nav.Link>
          <Nav.Link as={Link} href="/books" className="m-3">
            Add Listing
          </Nav.Link>
          <Nav.Link as={Link} href="/books/orders" className="m-3">
            Orders
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;

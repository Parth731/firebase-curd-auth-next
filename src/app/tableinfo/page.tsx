"use client";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Avatar } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "image",
    headerName: "Image",
    width: 150,
    renderCell: (params: any) => (
      <Avatar alt={params.row.username} src={params.value} />
    ),
  },
  { field: "username", headerName: "Username", width: 150 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "address", headerName: "Address", width: 300 },
];

const rows = [
  {
    id: 1,
    image: "/path/to/image1.jpg",
    username: "User1",
    email: "user1@example.com",
    address: "123 Main St",
  },
  {
    id: 2,
    image: "/path/to/image2.jpg",
    username: "User2",
    email: "user2@example.com",
    address: "456 Elm St",
  },
  {
    id: 3,
    image: "/path/to/image3.jpg",
    username: "User3",
    email: "user3@example.com",
    address: "789 Pine St",
  },
  // Add more rows as needed
];

const DataGridTablePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ height: 400, width: "80%" }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default DataGridTablePage;

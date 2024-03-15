import React from "react";
import { Stack } from "@mui/material";
import "./YourCart.css";

const YourCart = () => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="start"
        alignItems="center"
        className="container"
      >
        <h3 className="yourcartheading"> Your Cart</h3>
      </Stack>
    </>
  );
};

export default YourCart;

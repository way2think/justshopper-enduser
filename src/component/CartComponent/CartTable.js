import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./CartTable.css";
import { Box, Button, Stack } from "@mui/material";

const CartTable = () => {
  const checkout = {
    background: "#dc3237",
    color: "#fff",
    fontSize: "18px",
    "&:hover": {
      border: "2px solid #dc3237",
      background: "transparent",
      color: "#dc3237",
      fontSize: "18px",
    },
  };
  return (
    <div class="container mt-5">
      <table class="table table-xs">
        <tr className="tableheadrow">
          <th></th>
          <th className="text-left tableheaditem">Product Name</th>
          <th className="text-right tableheaditem">Quantity </th>
          <th className="text-right tableheaditem">Price</th>
          <th className="text-right tableheaditem">Total Price</th>
        </tr>
        <tr className="item-row">
          <td>
            {" "}
            <img src="../images/chocolate.jpg" alt="" className="imagecion" />
          </td>
          <td className="Items">
            <p className="itemname">
              {" "}
              <strong>Choco Bar</strong>
            </p>
            <p className="itemdesc">STATIONERY - Notes</p>
          </td>
          <td className="text-right" title="Amount">
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              className="cartqty"
            >
              <RemoveIcon htmlColor="#dc3237" sx={{ cursor: "pointer" }} />
              <p className="qty">1</p>
              <AddIcon htmlColor="#dc3237" sx={{ cursor: "pointer" }} />
            </Stack>
          </td>
          <td className="text-right price" title="Price">
            499.00
          </td>
          <td className="text-right price" title="Total">
            499.00
          </td>
        </tr>
        <tr className="item-row item-row-last">
          <td>
            {" "}
            <img src="../images/biscuit.jpg" alt="" className="imagecion" />
          </td>
          <td className="Items">
            <p className="itemname">
              {" "}
              <strong>Choco Biscuit</strong>
            </p>
            <p className="itemdesc">STATIONERY - Notes</p>
          </td>
          <td className="text-right" title="Amount">
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              className="cartqty"
            >
              <RemoveIcon htmlColor="#dc3237" sx={{ cursor: "pointer" }} />
              <p className="qty">1</p>
              <AddIcon htmlColor="#dc3237" sx={{ cursor: "pointer" }} />
            </Stack>
          </td>
          <td className="text-right price" title="Price">
            499.00
          </td>
          <td className="text-right price" title="Total">
            499.00
          </td>
        </tr>
        <tr className="total-row info">
          <td className="text-right price" colspan="4">
            Sub Total
          </td>
          <td className="text-right price">898.00</td>
        </tr>
        <tr className="total-row info">
          <td className="text-right price" colspan="4">
            Total
          </td>
          <td className="text-right price">898.00</td>
        </tr>
      </table>
      <Stack direction="row" justifyContent="end" alignItems="center">
        {/* <td className="text-right price">Checkout</td> */}
        {/* <td className="text-right price">898.00</td> */}
        <Button sx={checkout} className="checkoutbtn" variant="contained">
          Checkout
        </Button>
      </Stack>
    </div>
  );
};

export default CartTable;
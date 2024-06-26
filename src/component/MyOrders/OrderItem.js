import React from "react";
import "./MyOrders.css";

import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatAmount } from "../../utils";
import { addItem } from "../../store/cartSlice";
import ReviewModal from "../../Reusable/ReviewModal";
import {
  errorNotification,
  successNotification,
} from "../../utils/notifications";
import {
  useCreateReviewMutation,
  useLazyGetReviewByUserAndProductQuery,
} from "../../api/review";
import { useRTKLocalUpdate } from "../../hooks/rtk-hooks";
import { review as reviewApi } from "../../api/review";

const useStyles = styled((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  itemImg: {
    width: 120,
    height: 120,
    borderRadius: 4,
  },
}));

const review = {
  background: "#fff",
  color: "#000",
  fontFamily: "Poppins",
};

const OrderItem = ({ item, userDetail, order, rupeeSymbol }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const [getReviewByUserAndProduct, { data: resultQuery }, lastPromiseInfo] =
    useLazyGetReviewByUserAndProductQuery();

  const [createNewReview, {}] = useCreateReviewMutation();

  // console.log("result: ", resultQuery);

  const handleBuyItAgain = () => {
    // console.log("handleBuyItAgain: ", item);
    dispatch(addItem(item));
    navigate("/cart");
    // successNotification(`${item.name} added to cart`);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [handleLocalRTKUpdate] = useRTKLocalUpdate();

  const handleProductReview = async () => {
    // check if any review is written from this user to this product, if yes, then route to that product and show the review
    // else he can write a new review, after dispatched (D + 2 days)
    // console.log(item, userDetail);

    // console.log("conditions: ", conditions);
    const result = await getReviewByUserAndProduct(
      { productId: item.id, userId: userDetail.user_id },
      true
    ); // true is preferCacheValue
    // console.log("result review: ", result.data);
    const reviews = result.data;
    if (reviews) {
      if (reviews.length === 0) {
        // write review after dispatched
        handleOpen(); // show this write review button, only after dispatched
      } else if (reviews.length > 0) {
        // route to that product and show the review
        alert("Already review given to this product, please edit if you need.");
        navigate(`/product/${item.id}#review`);
      }
    } else {
      errorNotification(result.error.message || "Network error");
    }
  };

  const handleCreateNewReview = async ({
    rating,
    review,
    productName,
    productColor,
  }) => {
    const timestamp = new Date().getTime();
    const { name, email, phone, user_id } = userDetail;

    const result = await createNewReview({
      created_timestamp: timestamp,
      images: [], // later if required
      product_id: item.id,
      product_name: productName,
      product_color: productColor,
      review,
      rating,
      status: "pending",
      updated_timestamp: timestamp,
      user_details: {
        name,
        email,
        phone,
        user_id,
      },
    });

    // console.log("check: ", result);

    if (result.data) {
      successNotification("Review submitted!!!");
      handleLocalRTKUpdate(
        reviewApi,
        "getReviewByUserAndProduct",
        {
          productId: item.id,
          userId: userDetail.id,
        },
        [result.data]
      );
      handleClose();
    } else {
      console.log("handleCreateNewReview: ", result.error);
      errorNotification(result.error.message);
    }
  };

  return (
    <Stack>
      <Grid container spacing={2}>
        <Grid item sm={12} xs={12} md={5} lg={5} sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="start" alignItems="center">
            <div className={classes.itemImg}>
              <img
                src={
                  item.image ||
                  item.images[0]?.url ||
                  item.images[0] ||
                  "../images/dummy-image.jpg"
                }
                style={{
                  width: "100px",
                  height: "100px",
                  marginRight: "20px",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
                alt={item.name}
              />
            </div>
            <div className="itemDesc">
              <h5 className="titlename1">
                {item.name}{" "}
                {item.color &&
                  `(${item.color[0].toUpperCase() + item.color.substring(1)})`}
              </h5>
              <p>Sold by: Just Shopper</p>
              <p>Quantity: {item.quantity}</p>
              <p>
                Item price: <p style={rupeeSymbol}>&#8377;</p>
                {formatAmount(item.discount_price)}
              </p>
              <p>
                Total item price: <p style={rupeeSymbol}>&#8377;</p>
                {formatAmount(item.total_price)}
              </p>
            </div>
          </Stack>
        </Grid>

        <Grid item sm={12} xs={12} md={4} lg={4}>
          {order.status === "dispatched" && (
            <Box>
              <p className="trackid">
                <b className="track">Tracking Id :</b>{" "}
                {order.logistics.tracking_number}
              </p>
              <p className="trackid">
                <b className="track">Tracking Url :</b>{" "}
                <a
                  target="_blank"
                  href={order.logistics.tracking_url}
                  rel="noreferrer"
                >
                  {order.logistics.carrier_name.toUpperCase()}
                </a>
              </p>
            </Box>
          )}
        </Grid>

        <Grid className="trackbtn" sm={12} xs={12} md={3} lg={3}>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <div className="btn_group">
              {/* <ReturnIcon /> */}
              {/* <button className="buy_again">Return or replace items</button> */}

              {/* <button className="gift_btn">Write product review </button> */}
              <Button
                onClick={handleProductReview}
                className="mb-3"
                sx={review}
              >
                Write product review
              </Button>

              {open && (
                <ReviewModal
                  title={`Write Review for ${item.name} ${
                    item.color &&
                    `(${item.color[0].toUpperCase() + item.color.substring(1)})`
                  }`}
                  open={open}
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                  productName={item?.name}
                  productColor={item?.color}
                  handleCreateNewReview={handleCreateNewReview}
                />
              )}

              <button
                className="gift_btn"
                type="button"
                onClick={handleBuyItAgain}
              >
                Buy it again
              </button>
            </div>
          </Stack>
        </Grid>
      </Grid>
      <hr />
    </Stack>
  );
};

export default OrderItem;

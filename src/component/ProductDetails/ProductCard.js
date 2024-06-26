import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import classes from "../ProductDetails/ProductCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShareIcon from "@mui/icons-material/Share";
import {
  addItem,
  addItemQty,
  changeColor,
  removeItemQty,
  selectCartItems,
} from "../../store/cartSlice";
import { formatAmount, scrollToTop } from "../../utils";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useUpdateFavouritesMutation } from "../../api/user";
import {
  selectFavourite,
  selectUser,
  updateFavourites,
} from "../../store/userSlice";
import { errorNotification } from "../../utils/notifications";
import { useNavigate } from "react-router-dom";
// import DoneIcon from "@mui/icons-material/Done";

const ProductCard = ({ product }) => {
  const buy = {
    backgroundColor: "#dc3237",
    color: "#fff",
    fontSize: "18px",
    fontFamily: "amazonbold",
    marginRight: "30px",
    "&:hover": {
      backgroundColor: "#dc3237",
      color: "#fff",

      fontFamily: "amazonbold",
      marginRight: "30px",
    },
    "@media only screen and (min-width: 320px) and (max-width: 600px)": {
      fontSize: "14px",
      width: "35%",
      marginRight: "0px",
      marginBottom: "10px",
      "&:hover": { marginRight: "0px" },
    },
    "@media only screen and (min-width: 768px) and (max-width: 1023px)": {
      fontSize: "14px",
    },
  };
  const favIcon = {
    width: "40px",
    height: "40px",
    mr: 1,
    cursor: "Pointer",
    "& path": {
      fill: "#000",
    },
    "@media only screen and (min-width: 320px) and (max-width: 600px)": {
      width: "30px",
      height: "30px",
    },
  };
  const addtocart = {
    border: "1px solid #dc3237",
    color: "#dc3237",
    fontSize: "18px",
    fontFamily: "amazonbold",
    marginRight: "30px",

    "&:hover": {
      border: "1px solid #dc3237",
      color: "#dc3237",
      fontFamily: "amazonbold",
      marginRight: "30px",
    },
    "@media only screen and (min-width: 320px) and (max-width: 600px)": {
      fontSize: "14px",
      width: "35%",
      marginRight: "10px",
      marginBottom: "10px",
      "&:hover": { marginRight: "0px" },
    },
    "@media only screen and (min-width: 768px) and (max-width: 1023px)": {
      fontSize: "14px",
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(selectCartItems);
  const favourites = useSelector(selectFavourite);
  const user = useSelector(selectUser);
  const [updateFavouritesDB, {}] = useUpdateFavouritesMutation();
  const [color, setColor] = useState("");
  const [colorBasedQuantity, setColorBasedQuantity] = useState([]);

  useEffect(() => {
    if (product?.is_multi_color && product?.color_based_quantity) {
      const colorsInArray = Object.entries(product?.color_based_quantity).map(
        ([color_name, { quantity, minimum_quantity }]) => ({
          color_name,
          quantity,
          minimum_quantity,
        })
      );

      const productImages = product.images;

      // Sort the colorsInArray based on the order of colors defined in product.images
      colorsInArray.sort((a, b) => {
        // Find the index of color a.color_name in product.images
        const indexA = productImages.findIndex(
          (img) => img.color === a.color_name
        );

        // Find the index of color b.color_name in product.images
        const indexB = productImages.findIndex(
          (img) => img.color === b.color_name
        );

        // Compare the indices to determine the sorting order
        return indexA - indexB;
      });

      setColorBasedQuantity(colorsInArray);

      const index = cartItems.findIndex((item) => item.id === product.id);
      // console.log("coming", index !== -1);

      if (index !== -1) {
        setColor(cartItems[index].color);
      } else {
        !color && setColor(colorsInArray[0]?.color_name);
      }
    }
  }, [cartItems, color, product?.color_based_quantity, product.id, product.images, product?.is_multi_color]);

  const noOfItems = useMemo(() => {
    const item = cartItems.find((item) => item.id === product.id);
    return item ? item.cart_quantity : 0;
  }, [cartItems, product.id]);

  const isFavourite = useMemo(() => {
    return favourites.findIndex((fav) => fav.id === product.id) !== -1;
  }, [favourites, product.id]);

  const handleAddCartItem = () => {
    dispatch(addItem({ ...product, color }));
  };

  const handleAddItemQty = () => {
    dispatch(addItemQty(product));
  };

  const handleRemoveItemQty = () => {
    dispatch(removeItemQty(product));
  };

  const handleShare = async () => {
    // console.log("handleShre");
    try {
      await navigator.share({
        title: `Just Shopper - ${product.name}`,
        text: product.description,
        url: `https://${
          window.location.hostname === "localhost"
            ? "localhost:3000"
            : window.location.hostname
        }/product/${product.id}`,
      });
      // console.log("Successfully shared");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleUpdateFavourites = async (type) => {
    if (user.isAuthenticated) {
      const newFav = {
        id: product.id,
        name: product.name,
      };

      let updatedFavList = [];
      if (type === "add") {
        updatedFavList = [...favourites, newFav];
      } else {
        updatedFavList = favourites.filter((fav) => fav.id !== product.id);
      }

      const result = await updateFavouritesDB({
        docId: user.id,
        dataObject: {
          favourites: updatedFavList,
        },
      });

      if (result.data) {
        dispatch(updateFavourites(updatedFavList));
      } else {
        errorNotification(`Network error: ${result.error.message}`);
      }
    } else {
      errorNotification(`Please login to add to your favourites!!!`);
    }
  };

  const handleColorChange = (colorItem) => {
    setColor(colorItem.color_name);
    dispatch(changeColor({ cartItem: product, color: colorItem.color_name }));
  };

  const handleBuyNow = () => {
    handleAddCartItem();
    navigate(`/cart`);
    scrollToTop();
  };

  return (
    <>
      <main>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          className={classes.overallbtnmobile}
        >
          {noOfItems <= 0 ? (
            <Button sx={addtocart} onClick={handleAddCartItem}>
              Add to Cart
            </Button>
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                  "@media only screen and (min-width: 320px) and (max-width: 600px)":
                    {
                      border: "1px solid #dc3237",
                      mb: 2,
                      borderRadius: "5px",
                      // width: "100%",
                    },
                }}
              >
                <Button
                  size="small"
                  className="cart"
                  onClick={handleRemoveItemQty}
                >
                  <RemoveIcon sx={{ color: "#dc3237" }} />
                </Button>
                {noOfItems}
                <Button
                  size="small"
                  className="cart"
                  onClick={handleAddItemQty}
                >
                  <AddIcon sx={{ color: "#dc3237" }} />
                </Button>
              </Stack>
            </>
          )}

          <Button sx={buy} onClick={handleBuyNow}>
            Buy Now
          </Button>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h3 className={classes.productdetailsHeading}>{product.name}</h3>
          <Box className={classes.icons}>
            {isFavourite ? (
              <FavoriteIcon
                sx={favIcon}
                onClick={() => handleUpdateFavourites("remove")}
              />
            ) : (
              <FavoriteBorderIcon
                sx={favIcon}
                onClick={() => handleUpdateFavourites("add")}
              />
            )}
            {/* <img
              src="../images/share (2).png"
              alt={`Share ${product.name}`}
              className={classes.yellowshare}
              onClick={handleShare}
              // style={{ cursor: "pointer" }}
            /> */}
            <ShareIcon
              sx={{
                fontSize: "2.5rem",
                color: "#000",
                "@media only screen and (min-width: 320px) and (max-width: 600px)":
                  {
                    fontSize: "2.0rem",
                  },
              }}
              className={classes.yellowshare}
              onClick={handleShare}
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="start" alignItems="center">
          <Box className={classes.mainSubtitle}>
            <h3 className={classes.Subtitle}>{product.category}</h3>
            <p className={classes.descripation}>{product.description}</p>
          </Box>
        </Stack>
        {product.is_multi_color && (
          <Stack direction="row" justifyContent="start" alignItems="center">
            <Box className={classes.maincolors}>
              <h3 className={classes.colors}>Colors : </h3>
              <Box className={classes.colorsCircle}>
                {colorBasedQuantity?.map(
                  (item) =>
                    item.quantity > 0 && (
                      <span
                        className={classes.colorcircle}
                        key={item._id + item.color_name}
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          backgroundColor: item.color_name,
                          boxShadow:
                            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                          cursor: "pointer",
                          marginRight: "10px",
                          border:
                            color === item.color_name
                              ? "3px solid #fff"
                              : "none",
                          outline:
                            color === item.color_name
                              ? "1px solid #000"
                              : "none",
                        }}
                        onClick={() => handleColorChange(item)}
                      ></span>
                    )
                )}
              </Box>
            </Box>
          </Stack>
        )}

        <Stack direction="row" justifyContent="start" alignItems="center">
          <Box className={classes.price}>
            <h3 className={classes.price1}>
              <CurrencyRupeeIcon className={classes.rupee1} />
              {formatAmount(product?.discount_price)}
            </h3>
            <h3 className={classes.price2}>
              <CurrencyRupeeIcon className={classes.rupee2} />
              {formatAmount(product?.selling_price)}
            </h3>
          </Box>
        </Stack>
        <Stack
          direction={{ sm: "column", md: "row" }}
          justifyContent="start"
          alignItems="center"
          className={classes.overallbtn}
        >
          {noOfItems <= 0 ? (
            <Button sx={addtocart} onClick={handleAddCartItem}>
              Add to Cart
            </Button>
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                  "@media only screen and (min-width: 320px) and (max-width: 600px)":
                    {
                      border: "1px solid #dc3237",
                      mb: 2,
                      borderRadius: "5px",
                      width: "100%",
                    },
                }}
              >
                <Button
                  size="small"
                  className="cart"
                  onClick={handleRemoveItemQty}
                >
                  <RemoveIcon sx={{ color: "#dc3237" }} />
                </Button>
                {noOfItems}
                <Button
                  size="small"
                  className="cart"
                  onClick={handleAddItemQty}
                >
                  <AddIcon sx={{ color: "#dc3237" }} />
                </Button>
              </Stack>
            </>
          )}

          <Button sx={buy} onClick={handleBuyNow}>
            Buy Now
          </Button>
        </Stack>
      </main>
    </>
  );
};

export default ProductCard;

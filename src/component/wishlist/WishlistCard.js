import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./WishlistCard.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFavourite,
  selectUserId,
  updateFavourites,
} from "../../store/userSlice";
import {
  useGetAllFavouritesQuery,
  useUpdateFavouritesMutation,
} from "../../api/user";
import { formatAmount } from "../../utils";
import { addItem } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { errorNotification } from "../../utils/notifications";
import { setIsLoading } from "../../store/appSlice";

const WishlistCard = () => {
  const cart = {
    padding: "8px 15px",
    bgcolor: "#DC3237",
    fontWeight: 600,
    "&:hover": {
      border: "2px solid #DC3237 ",
      bgcolor: "#fff",
      color: "#DC3237",
    },
    "@media only screen and (min-width: 320px) and (max-width: 600px)": {
      width: "100%",
    },
  };

  const deleteicon = {
    padding: "8px 15px",
    marginLeft: 2,
    bgcolor: "#000",
    fontWeight: 600,
    "&:hover": {
      border: "2px solid #000",
      bgcolor: "#fff",
      color: "#000",
    },
  };

  const favIcon = {
    padding: "8px 15px",
    marginLeft: 2,
    bgcolor: "#DC3237",
    fontWeight: 600,
    fontFamily: "Poppins",
    fontWeight: 600,
    fontStyle: "normal",
    "&:hover": {
      border: "2px solid #DC3237",
      bgcolor: "#fff",
      color: "#DC3237",
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favourites = useSelector(selectFavourite);
  const userId = useSelector(selectUserId);
  const { data, isFetching, isLoading } = useGetAllFavouritesQuery({
    collectionId: "product",
    favourites: favourites || [],
  });
  const [updateFavouritesDB, {}] = useUpdateFavouritesMutation();
  // console.log("fav products: ", data);

  const handleAddToCart = (item) => {
    item.is_multi_color
      ? dispatch(
          addItem({
            ...item,
            color: item.color_based_quantity[0].color_name,
          })
        )
      : dispatch(addItem(item));
  };

  const handleRemoveFromFavourites = async (item) => {
    if (userId) {
      dispatch(setIsLoading(true));

      let updatedFavList = favourites.filter((fav) => fav.id !== item.id);

      const result = await updateFavouritesDB({
        docId: userId,
        dataObject: {
          favourites: updatedFavList,
        },
      });
      if (result.data) {
        dispatch(updateFavourites(updatedFavList));
        dispatch(setIsLoading(false));
      } else {
        errorNotification(`Network error: ${result.error.message}`);
        dispatch(setIsLoading(false));
      }
    } else {
      errorNotification(`Please login to add favourites`);
    }
  };

  const getRightImage = (item) => {
    // console.log("te: ", item);
    // item.images[0].url || "../images/dummy-image.jpg"
    if (item.color) {
      if (item?.image) {
        return item?.image;
      } else {
        const index = item.images.findIndex(
          (imgObj) => imgObj.color === item.color
        );

        if (index === -1) {
          return item.images[0];
        } else {
          return item.images[index].url;
        }
      }
    }
    return item.images[0].url || "../images/dummy-image.jpg";
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="start"
        alignItems="center"
        className="container"
      >
        <h3 className="yourcartheading">Favourites</h3>
      </Stack>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        className="my-4 container wishlist-box"
        direction="row"
      >
        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            overflowY: "scroll",
            maxHeight: "400px",
          }}
        >
          {data?.length <= 0 ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <img src="../images/arrow.png " alt="" className="favimage" />
              <h5 className="nofav">No Item in the Favorites</h5>
              <Button
                variant="contained"
                sx={favIcon}
                onClick={() => navigate(`/shop-by-category`)}
              >
                Shop
              </Button>
            </Stack>
          ) : (
            data?.map((item) => (
              <Grid
                key={item.id}
                container
                spacing={2}
                sx={{
                  mb: 10,
                  "@media only screen and (min-width: 320px) and (max-width: 600px)":
                    {
                      mb: 8,
                    },
                }}
              >
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={getRightImage(item)}
                      alt={item?.name}
                      className="product-img"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        marginLeft: 3,
                      }}
                    >
                      <h4 className="product-name">{item.name}</h4>
                      <p className="product-category">
                        {item.category} {item.theme && `- ${item.theme}`}
                      </p>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#7B7979" }}
                      >
                        ₹{formatAmount(item.discount_price)}
                        <span>
                          <del
                            style={{
                              fontWeight: "bold",
                              color: "#AAAAAA",
                              marginLeft: 5,
                              fontSize: "18px",
                            }}
                          >
                            ₹{formatAmount(item.selling_price)}
                          </del>
                        </span>
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} className="add-cart">
                  <Button
                    sx={cart}
                    variant="contained"
                    // onClick={() => handleAddToCart(item)}
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    sx={deleteicon}
                    variant="contained"
                    onClick={() => handleRemoveFromFavourites(item)}
                  >
                    <DeleteIcon />
                  </Button>
                </Grid>
              </Grid>
            ))
          )}

          {/* <Grid container spacing={2} sx={{ mb: 10 }}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src="../images/biscuit.jpg"
                  alt=""
                  className="product-img"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    marginLeft: 3,
                  }}
                >
                  <h4 className="product-name"> Choco Biscuits</h4>
                  <p className="product-category">Stationery notes</p>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#7B7979" }}
                  >
                    {" "}
                    ₹499
                    <span>
                      <del
                        style={{
                          fontWeight: "bold",
                          color: "#AAAAAA",
                          marginLeft: 5,
                          fontSize: "18px",
                        }}
                      >
                        ₹799
                      </del>
                    </span>
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} className="add-cart">
              <Button sx={cart} variant="contained">
                Add to Cart
              </Button>
              <Button sx={deleteicon} variant="contained">
                <DeleteIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 10 }}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src="../images/biscuit.jpg"
                  alt=""
                  className="product-img"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    marginLeft: 3,
                  }}
                >
                  <h4 className="product-name"> Choco Biscuits</h4>
                  <p className="product-category">Stationery notes</p>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#7B7979" }}
                  >
                    {" "}
                    ₹499
                    <span>
                      <del
                        style={{
                          fontWeight: "bold",
                          color: "#AAAAAA",
                          marginLeft: 5,
                          fontSize: "18px",
                        }}
                      >
                        ₹799
                      </del>
                    </span>
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} className="add-cart">
              <Button sx={cart} variant="contained">
                Add to Cart
              </Button>
              <Button sx={deleteicon} variant="contained">
                <DeleteIcon />
              </Button>
            </Grid>
          </Grid> */}
        </Box>
      </Stack>
    </>
  );
};

export default WishlistCard;

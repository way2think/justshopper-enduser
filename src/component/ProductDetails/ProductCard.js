import React from "react";
import { Box, Button, Stack } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import classes from "../ProductDetails/ProductCard.module.css";

const ProductCard = () => {
  return (
    <>
      <main>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h3 className={classes.productdetailsHeading}>Choco Biscuits</h3>
          <Box className={classes.icons}>
            <img
              src="../images/Heartred.png"
              alt=""
              className={classes.redheart}
            />
            <img
              src="../images/Shareyellow.png"
              alt=""
              className={classes.yellowshare}
            />
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="start" alignItems="center">
          <Box className={classes.mainSubtitle}>
            <h3 className={classes.Subtitle}>STATIONERY - Notes </h3>
            <p className={classes.descripation}>
              Indulge your senses with the heavenly scent of chocolate, creating
              a unique and delightful writing experience. Indulge your senses
              with the heavenly scent of chocolate, creating a unique and
              delightful writing experience. Indulge your senses with the
              heavenly scent of chocolate, creating a unique and delightful
              writing experience.
            </p>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="start" alignItems="center">
          <Box className={classes.maincolors}>
            <h3 className={classes.colors}>Colors : </h3>
            <Box className={classes.colorsCircle}>
              <span className={classes.color1}></span>
              <span className={classes.color2}></span>
              <span className={classes.color3}></span>
              <span className={classes.color4}></span>
              <span className={classes.color5}></span>
            </Box>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="start" alignItems="center">
          <Box className={classes.price}>
            <h3 className={classes.price1}>
              <CurrencyRupeeIcon className={classes.rupee1} />
              499.00
            </h3>
            <h3 className={classes.price2}>
              <CurrencyRupeeIcon className={classes.rupee2} />
              799.00
            </h3>
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="start"
          alignItems="center"
          className={classes.overallbtn}
        >
          <Button className={classes.addtocart}>Add to Cart</Button>
          <Button className={classes.buy}>Buy Now</Button>
        </Stack>
      </main>
    </>
  );
};

export default ProductCard;

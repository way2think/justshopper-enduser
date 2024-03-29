import React from "react";
import { Navigate, useNavigate, useRoutes } from "react-router-dom";
import DashBoardLayout from "./Layout/dashboard/DashboardLayout";
import Home from "./pages/Home/Home";
import ContactUs from "./pages/Contactus/ContactUs";
import Wishlist from "./pages/Wishlist/Wishlist";
import CartPage from "./pages/Cart/CartPage";
import ShopCategory from "./pages/Category/ShopCategory";
import ProductDetails from "./pages/Product/ProductDetails";
import Profile from "./pages/Profile/Profile";
import Order from "./pages/Order/Order";


export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <DashBoardLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "contact-us", element: <ContactUs /> },
        { path: "shop-by-category", element: <ShopCategory /> },
        { path: "Product-details", element: <ProductDetails /> },
        { path: "favorites", element: <Wishlist /> },
        { path: "cart", element: <CartPage /> },
        { path: "profile", element: <Profile /> },
        { path: "orders", element: <Order /> },
      ],
    },
  ]);
  return routes;
}

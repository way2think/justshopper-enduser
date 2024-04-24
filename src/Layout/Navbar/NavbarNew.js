import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../../component/Login/LoginModal";
import SignupModal from "../../component/Signup/SignupModal";
import { Badge, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { selectCartSize } from "../../store/cartSlice";
import { useSelector } from "react-redux";
import {
  selectFavouriteSize,
  selectIsAuthenticated,
} from "../../store/userSlice";
import { useSignOutUserMutation } from "../../api/auth";
import { selectCategory, selectTheme } from "../../api/api";
import "./Navbar.css";
import SideNav from "./SideNav";
import {
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
} from "mdb-react-ui-kit";

const NavbarNew = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartTotalQuantity = useSelector(selectCartSize);
  const favouriteTotalQuantity = useSelector(selectFavouriteSize);

  const [openBasic, setOpenBasic] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [open, setOpen] = useState({
    login: false,
    signup: false,
  });

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const categoryListDetail = useSelector(selectCategory);
  const themeListDetail = useSelector(selectTheme);

  const categoryList = useMemo(() => {
    return categoryListDetail?.filter((cat) => cat.show_in_top_navbar === true);
  }, [categoryListDetail]);

  const themeList = useMemo(() => {
    return themeListDetail?.filter(
      (theme) => theme.show_in_top_navbar === true
    );
  }, [themeListDetail]);

  const [signOutUser, { isError, error, data, isLoading }] =
    useSignOutUserMutation();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 992) {
        setMobileNav(true);
      } else {
        setMobileNav(false);
      }
    }

    // Set initial mobileNav state on page load
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log("mobile", mobileNav);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      // right: -3,
      // top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      color: "#fff",
      backgroundColor: "#dc3237",
    },
  }));

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light navbarnew"
        style={{ background: "#fff" }}
      >
        <Link className="navbar-brand" to="/">
          <img src="../images/JS logo png.png" className="logo" alt="" />
        </Link>
        <button
          className="navbar-toggler togglenavbar"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item active navitem">
              <Link
                className="nav-link"
                to="/"
                style={{
                  color: location.pathname.match(/^\/$/) ? "#dc3237" : "#000",
                }}
              >
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>

            <li className="nav-item dropdown navitem">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  color: location.pathname.includes("/shop-by-category")
                    ? "#dc3237"
                    : "#000",
                }}
              >
                Shop by Category
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                {categoryList?.map((item) =>
                  item?.show_in_top_navbar ? (
                    <Link
                      key={item?.name}
                      to={`/shop-by-category?category=${item?.name}`}
                      onClick={() => {
                        navigate(`/shop-by-category?category=${item?.name}`);
                      }}
                    >
                      <li className="nav-item dropdown">
                        <Link className="nav-link">{item?.name}</Link>
                      </li>
                    </Link>
                  ) : null
                )}
              </div>
            </li>
            <li className="nav-item dropdown navitem">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  color: location.pathname.includes("/shop-by-theme")
                    ? "#dc3237"
                    : "#000",
                }}
              >
                Shop by Theme
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                {themeList?.map((item) =>
                  item?.show_in_top_navbar ? (
                    <Link
                      key={item?.name}
                      to={`/shop-by-theme?theme=${item?.name}`}
                      onClick={() =>
                        navigate(`/shop-by-theme?theme=${item?.name}`)
                      }
                    >
                      <li className="nav-item dropdown">
                        <Link className="nav-link">{item?.name}</Link>
                      </li>
                    </Link>
                  ) : null
                )}
              </div>
            </li>
            <li className="nav-item  navitem">
              <Link
                className="nav-link"
                to="contact-us"
                style={{
                  color: location.pathname.includes("/contact-us")
                    ? "#dc3237"
                    : "#000",
                }}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <ul className="shopingnavbar">
          <li className="nav-item navitem" style={{ marginBottom: "6px" }}>
            <Link
              to="cart"
              style={{
                color: location.pathname.includes("/cart") ? "#dc3237" : "#000",
              }}
            >
              <StyledBadge
                badgeContent={cartTotalQuantity || 0}
                color="primary"
              >
                {/* <MDBIcon fas icon="shopping-cart" /> */}
                <img
                  src="../images/Shopping Bag.png"
                  alt=""
                  width={25}
                  height={25}
                />
              </StyledBadge>
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item  navitem">
                <Link
                  to="favorites"
                  style={{
                    color: location.pathname.includes("/favorites")
                      ? "#dc3237"
                      : "#000",
                  }}
                >
                  <StyledBadge
                    badgeContent={favouriteTotalQuantity || 0}
                    color="primary"
                  >
                    <img
                      src="../images/heart.png"
                      alt=""
                      width={25}
                      height={25}
                    />
                  </StyledBadge>
                </Link>
              </li>
              <li className="nav-item  navitem">
                <MDBDropdown>
                  <MDBDropdownToggle
                    tag="a"
                    className="nav-link p-0 mx-2"
                    role="button"
                  >
                    <img
                      src="../images/male User.png"
                      alt=""
                      width={25}
                      height={25}
                    />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu style={{ padding: "10px 10px" }}>
                    <Link to={"/profile"}>
                      <MDBDropdownItem className="MDBDropdownItem">
                        Profile
                      </MDBDropdownItem>
                    </Link>
                    <Link to={"/orders"}>
                      <MDBDropdownItem className="MDBDropdownItem">
                        Orders
                      </MDBDropdownItem>
                    </Link>
                    <Link
                      className="MDBDropdownItem"
                      onClick={() => signOutUser()}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </Link>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </li>
            </>
          ) : (
            <li className="nav-item  navitem">
              <LoginModal
                open={open.login}
                setOpen={(isOpen, type) =>
                  setOpen((prevState) => {
                    if (type === "login") {
                      return {
                        signup: false,
                        login: isOpen,
                      };
                    } else {
                      return {
                        signup: isOpen,
                        login: false,
                      };
                    }
                  })
                }
              />
              <SignupModal
                open={open.signup}
                setOpen={(isOpen, type) =>
                  setOpen((prevState) => ({
                    ...prevState,
                    signup: isOpen,
                  }))
                }
              />
            </li>
          )}

          <SideNav />
        </ul>
      </nav>
    </>
  );
};

export default NavbarNew;

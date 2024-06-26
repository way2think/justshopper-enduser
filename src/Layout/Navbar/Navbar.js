import React, { useEffect, useMemo, useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";
// import Search from "./Search";
import { Badge, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginModal from "../../component/Login/LoginModal";
import {
  selectFavouriteSize,
  selectIsAuthenticated,
} from "../../store/userSlice";
import { useSignOutUserMutation } from "../../api/auth";
import { selectCategory, selectTheme } from "../../api/api";
import SignupModal from "../../component/Signup/SignupModal";

import "./Navbar.css";
import { selectCartSize } from "../../store/cartSlice";

export default function Navbar() {
  const location = useLocation();
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
    <MDBNavbar expand="lg" style={{ background: "#fdf8f0" }}>
      <MDBContainer fluid>
        <MDBNavbarBrand href="/">
          <img src="../images/JS logo png.png" className="logo" alt="" />
        </MDBNavbarBrand>
        <Stack direction="row">
          {mobileNav && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ listStyleType: "none" }}
              className="mobileviewcart"
            >
              {/* <MDBNavbarItem className="me-3 me-lg-0">
                <MDBNavbarLink href="#">
                  <Search />
                </MDBNavbarLink>
              </MDBNavbarItem> */}
              <MDBNavbarItem className="me-2 me-lg-0">
                <Link
                  to="cart"
                  style={{
                    color: location.pathname.includes("/cart")
                      ? "#dc3237"
                      : "#000",
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
              </MDBNavbarItem>

              {isAuthenticated ? (
                <>
                  <MDBNavbarItem className="me-2 me-lg-0">
                    <MDBNavbarLink href="/favorites">
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
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBDropdown>
                      <MDBDropdownToggle
                        tag="a"
                        className="nav-link"
                        role="button"
                      >
                        <img
                          src="../images/male User.png"
                          alt=""
                          width={25}
                          height={25}
                        />
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
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
                        <MDBDropdownItem
                          className="MDBDropdownItem"
                          onClick={() => signOutUser()}
                        >
                          Logout
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>
                </>
              ) : (
                <MDBNavbarItem className="me-3 me-lg-0">
                  {/* <MDBNavbarLink href="#"> */}
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
                  {/* </MDBNavbarLink> */}
                </MDBNavbarItem>
              )}
            </Stack>
          )}
          <MDBNavbarToggler
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setOpenBasic(!openBasic)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
        </Stack>

        <MDBCollapse navbar open={openBasic} style={{ textAlign: "left" }}>
          <MDBNavbarNav className="mr-auto mb-2 mb-lg-0 justify-content-end align-items-center">
            <MDBNavbarItem className="navitem">
              <Link
                active
                aria-current="page"
                to="/"
                style={{
                  color: location.pathname.match(/^\/$/) ? "#dc3237" : "#000",
                }}
              >
                Home
              </Link>
            </MDBNavbarItem>
            <MDBNavbarItem className="navitem">
              <MDBDropdown>
                <MDBDropdownToggle
                  style={{
                    color: location.pathname.includes("/shop-by-category")
                      ? "#dc3237"
                      : "#000",
                  }}
                  tag="a"
                  className="nav-link"
                  role="button"
                >
                  Shop by Category
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  {categoryList?.map((item) =>
                    item?.show_in_top_navbar ? (
                      <Link
                        key={item?.name}
                        to={`/shop-by-category?category=${item?.name}`}
                        // onClick={() =>
                        //   navigate("/shop-by-category", {
                        //     state: item,
                        //   })
                        // }
                      >
                        <MDBDropdownItem className="MDBDropdownItem" link>
                          {item?.name}
                        </MDBDropdownItem>
                      </Link>
                    ) : null
                  )}
                  {/* <Link to="shop-by-category">
                    <MDBDropdownItem className="MDBDropdownItem" link>
                      Pen
                    </MDBDropdownItem>
                  </Link>
                  <Link to="shop-by-category">
                    <MDBDropdownItem className="MDBDropdownItem" link>
                      Notes
                    </MDBDropdownItem>
                  </Link> */}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
            <MDBNavbarItem className="navitem">
              <MDBDropdown>
                <MDBDropdownToggle
                  style={{
                    color: location.pathname.includes("/shop-by-theme")
                      ? "#dc3237"
                      : "#000",
                  }}
                  tag="a"
                  className="nav-link"
                  role="button"
                >
                  Shop by Theme
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  {themeList?.map((item) =>
                    item?.show_in_top_navbar ? (
                      <Link
                        key={item?.name}
                        to={`/shop-by-theme?theme=${item?.name}`}
                        // onClick={() =>
                        //   navigate("/shop-by-category", {
                        //     state: item,
                        //   })
                        // }
                      >
                        <MDBDropdownItem className="MDBDropdownItem" link>
                          {item?.name}
                        </MDBDropdownItem>
                      </Link>
                    ) : null
                  )}
                  {/* <Link to="shop-by-category">
                    <MDBDropdownItem className="MDBDropdownItem" link>
                      Stationery
                    </MDBDropdownItem>
                  </Link>
                  <Link to="shop-by-category">
                    <MDBDropdownItem className="MDBDropdownItem" link>
                      Pen
                    </MDBDropdownItem>
                  </Link>
                  <Link to="shop-by-category">
                    <MDBDropdownItem className="MDBDropdownItem" link>
                      Notes
                    </MDBDropdownItem>
                  </Link> */}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            <MDBNavbarItem className="navitem">
              <Link
                to="contact-us"
                style={{
                  color: location.pathname.includes("/contact-us")
                    ? "#dc3237"
                    : "#000",
                }}
              >
                Contact Us
              </Link>
            </MDBNavbarItem>

            {!mobileNav && (
              <>
                {/* <MDBNavbarItem className="me-3 me-lg-0">
                  <MDBNavbarLink href="#">
                    <MDBIcon fas icon="search" />
                    <img src="../images/Search.png" alt="" width={25} height={25}  />
                    <Search />
                  </MDBNavbarLink>
                </MDBNavbarItem> */}
                <MDBNavbarItem className="me-3 mx-2 me-lg-0">
                  <Link
                    to="cart"
                    style={{
                      color: location.pathname.includes("/cart")
                        ? "#dc3237"
                        : "#000",
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
                </MDBNavbarItem>

                {/* <MDBNavbarItem className="me-3 me-lg-0">
              <MDBNavbarLink href="#">
                <img
                  src="../images/male User.png"
                  alt=""
                  width={25}
                  height={25}
                />
              </MDBNavbarLink>
            </MDBNavbarItem> */}
                {isAuthenticated ? (
                  <>
                    <MDBNavbarItem className="me-3 mx-2 me-lg-0">
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
                    </MDBNavbarItem>
                    <MDBNavbarItem>
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
                        <MDBDropdownMenu>
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
                          <MDBDropdownItem
                            className="MDBDropdownItem"
                            onClick={() => signOutUser()}
                          >
                            Logout
                          </MDBDropdownItem>
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </MDBNavbarItem>
                  </>
                ) : (
                  <MDBNavbarItem className="me-3 me-lg-0">
                    {/* <MDBNavbarLink href="#"> */}
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
                    {/* </MDBNavbarLink> */}
                  </MDBNavbarItem>
                )}
              </>
            )}
          </MDBNavbarNav>

          {/* <form className="d-flex input-group w-auto">
            <input
              type="search"
              className="form-control"
              placeholder="Type query"
              aria-label="Search"
            />
            <MDBBtn color="primary">Search</MDBBtn>
          </form> */}
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

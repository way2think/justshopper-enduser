import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// import CountryAndStates from "./CountryAndStates";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhoneNumber,
} from "../utils/validator";

import { auth, db } from "../config/firebase";
import { errorNotification } from "../utils/notifications";

import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 630,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  "@media (max-width: 768px)": {
    width: 350,
    maxHeight: "450px",
    overflowY: "scroll",
  },
};

const signup = {
  // background: "#f19e38",
  color: "#dc3237",
  marginTop: "5px",
  fontSize: "12px",
  fontweight: 800,
  fontfamily: "amazonbold",
  // "&:hover": {
  //   // background: "#f19e38",
  //   color: "#fff",
  //   fontsize: "14px",
  //   fontweight: 500,
  //   fontfamily: "'Poppins', sans-serif",
  // },
};

const Signupbtn = {
  width: "100%",
  background: "#dc3237",
  color: "#fff",
  fontsize: "18px",
  "&:hover": {
    background: "#fff",
    color: "#dc3237",
    fontsize: "18px",
    border: "1px solid #dc3237",
  },
};

export default function AddressModal({ open, setOpen }) {
  const [selectedAddress, setSelectedAddress] = useState({
    id: "",
    name: "",
    line: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [countryName, setCountryName] = useState("");
  const [stateName, setstateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [addressDetails, setAddressDetails] = useState({
    name: "",
    line: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const user = useSelector(selectUser);

  useEffect(() => {}, [selectedAddress]);

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  function reset() {
    setSelectedAddress({
      id: "",
      name: "",
      line: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setAddressDetails({
      name: "",
      line: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setAddNewAddress(false);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" component="h5">
            {addNewAddress ? "Add New Address" : "Saved Addresses"}
          </Typography>
          {addNewAddress ? (
            <>
              <Grid container mt={5}>
                <Grid xs={12} className="gridsignup">
                  <TextField
                    fullWidth
                    id="name"
                    label="Name"
                    variant="outlined"
                    name="name"
                    type="text"
                    className="name"
                    value={addressDetails.name}
                    onChange={handleInputChange}
                    sx={{
                      mb: 2,
                      // width: "90%",
                      // "@media (max-width: 768px)": {
                      //   width: "100%",
                      // },
                    }}
                  />
                </Grid>
                {/* <Grid md={6} xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    variant="outlined"
                    name="phonenumber"
                    type="tel"
                    value={addressDetails.phonenumber}
                    onChange={handleInputChange}
                    className="phone"
                    sx={{ mb: 2 }}
                  />
                </Grid> */}
              </Grid>
              <Grid container>
                <Grid xs={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Address Line"
                    placeholder="Door / House No, Street Name, Area"
                    name="addressLine"
                    value={addressDetails.line}
                    onChange={(e) => {
                      setAddressDetails((prevState) => {
                        return {
                          ...prevState,
                          line: e.target.value,
                        };
                      });
                    }}
                    sx={{ mb: 2, width: "100%" }}
                  />
                </Grid>

                <Grid md={6} xs={6} pr={2}>
                  <CountrySelect
                    onChange={(e) => {
                      setCountryid(e.id);
                      setCountryName(e.name);
                      setAddressDetails((prevState) => {
                        return {
                          ...prevState,
                          country: e.name,
                        };
                      });
                    }}
                    placeHolder="Select Country"
                  />
                </Grid>

                <Grid md={6} xs={6}>
                  <StateSelect
                    countryid={countryid}
                    onChange={(e) => {
                      setstateid(e.id);
                      setstateName(e.name);
                      setAddressDetails((prevState) => {
                        return {
                          ...prevState,
                          state: e.name,
                        };
                      });
                    }}
                    placeHolder="Select State"
                  />
                </Grid>

                <Grid md={6} xs={6} pr={2} mt={2}>
                  <CitySelect
                    countryid={countryid}
                    stateid={stateid}
                    onChange={(e) => {
                      setCityName(e.name);
                      setAddressDetails((prevState) => {
                        return {
                          ...prevState,
                          city: e.name,
                        };
                      });
                    }}
                    placeHolder="Select City"
                  />
                </Grid>

                <Grid md={6} xs={6} mt={2}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Pincode"
                    multiline
                    rows={1}
                    name="pincode"
                    value={addressDetails.pincode}
                    onChange={(e) => {
                      setAddressDetails((prevState) => {
                        return {
                          ...prevState,
                          pincode: e.target.value,
                        };
                      });
                    }}
                    sx={{ mb: 2, width: "100%" }}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <button
                  onClick={() => {
                    reset();
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    reset();
                  }}
                >
                  Save
                </button>
              </Grid>
            </>
          ) : (
            <>
              <div className="card my-2">
                <div
                  className={`p-2 ${
                    selectedAddress.id === user.address.id
                      ? "bg-primary text-white"
                      : ""
                  }`}
                  style={{
                    boxShadow: "0 2px 5px #7d7d7d",
                    borderRadius: "8px",
                  }}
                >
                  <label
                    className="m-0 ms-2 me-4"
                    htmlFor="shipping"
                    role="button"
                  >
                    <span>{user.name + ", " + user.address.line}</span>
                    <div>{user.address.city + ", " + user.address.state}</div>
                    <div>
                      {user.address.country + " - " + user.address.pincode}{" "}
                      (Same as Billing Address)
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <hr />
              </div>
              {user.shipping_addresses &&
                (user.shipping_addresses.length === 0 ? (
                  <div className="card my-2">
                    <button onClick={() => setAddNewAddress(true)}>
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <>
                    {user.shipping_addresses.map((add) => (
                      <div className="card my-2">
                        <div
                          className={`p-2 ${
                            selectedAddress.id === add.address.id
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          style={{
                            boxShadow: "0 2px 5px #7d7d7d",
                            borderRadius: "8px",
                          }}
                        >
                          <label
                            className="m-0 ms-2 me-4"
                            htmlFor="shipping"
                            role="button"
                          >
                            <span>{add.name + ", " + add.address.line}</span>
                            <div>
                              {add.address.city + ", " + add.address.state}
                            </div>
                            <div>
                              {add.address.country +
                                " - " +
                                add.address.pincode}{" "}
                              (Same as Billing Address)
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                    <div className="card my-2">
                      <button onClick={() => setAddNewAddress(true)}>
                        Add New Address
                      </button>
                    </div>
                  </>
                ))}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { collection, doc, updateDoc } from "firebase/firestore";
// import { db } from "../../services/firebase";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  GetCountries,
  GetState,
  GetCity,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

import classes from "./ProfileDetail.module.css";
import { selectUser, updateProfileDetail } from "../../store/userSlice";

import {
  errorNotification,
  successNotification,
} from "../../utils/notifications";
import {
  isValidAddress,
  isValidAddressObject,
  isValidName,
  isValidPhoneNumber,
  isValidPincode,
} from "../../utils/validator";
import { useUpdateProfileDetailMutation } from "../../api/user";
import { setIsLoading } from "../../store/appSlice";
import { countryIndia } from "../../utils/constants";

const save = {
  background: "#dc3237",
  color: "#fff",
  fontSize: "16px",
  "&:hover": {
    background: "#dc3237",
    color: "#fff",
  },
  "@media only screen and (max-width: 600px)": {
    fontSize: "12px",
    marginTop: "14px !important",
  },
};
const Cancel = {
  border: "1px solid #dc3237",
  color: "#dc3237",
  fontSize: "16px",
  "&:hover": {
    border: "1px solid #dc3237",
    color: "#dc3237",
  },
  "@media only screen and (max-width: 600px)": {
    fontSize: "12px",
  },
};

const profilehalf = {
  padding: "0 50px",
  "@media (max-width: 768px)": {
    padding: "0",
  },
};
const sechalf = {
  padding: "0 50px",
  "@media (max-width: 768px)": {
    padding: "0",
  },
};

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [disableProfileEdit, setDisableProfileEdit] = useState(true);
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    phone: "",
    email: "",
    address: {
      line: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });
  const [country, setCountry] = useState({});
  const [state, setState] = useState({});
  const [city, setCity] = useState({});

  const [updateProfile, {}] = useUpdateProfileDetailMutation();

  useEffect(() => {
    setDefaultValues((prevState) => {
      return {
        ...prevState,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      };
    });
  }, [user]);

  useEffect(() => {
    if (user.address.country && user.address.state && user.address.city) {
      GetCountries().then((result) => {
        const countryObj = countryIndia;

        setCountry(countryObj);

        GetState(countryObj.id).then((resultState) => {
          const stateObj = resultState.find(
            (state) => state.name === user.address.state
          );
          // console.log("stateObj: ", stateObj);
          setState(stateObj);
          GetCity(countryObj.id, stateObj.id).then((resultCity) => {
            const cityObj = resultCity.find(
              (state) => state.name === user.address.city
            );
            // console.log("cityObj: ", cityObj);
            setCity(cityObj);
          });
        });
      });
    }
  }, [user.address]);

  const onChangeHandler = (e) => {
    setDefaultValues((prevState) => {
      const { name, value } = e.target;

      if (name === "line" || name === "pincode") {
        return {
          ...prevState,
          address: {
            ...prevState.address,
            [name]: value,
          },
        };
      }

      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onChangeDropdown = async (type, object) => {
    if (type === "country") {
      setCountry(object);
    } else if (type === "state") {
      setState(object);
      const result = await GetCity(country.id, object.id);
      setCity(result[0]);
    } else if (type === "city") {
      setCity(object);
    }

    setDefaultValues((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [type]: object.name,
      },
    }));
  };

  const handleSaveChanges = async () => {
    dispatch(setIsLoading(true));
    const { name, phone, address } = defaultValues;
    // console.log("handleSaveChanges: ", defaultValues);

    if (
      isValidName(name) &&
      isValidPhoneNumber(phone) &&
      isValidAddressObject(address) &&
      isValidPincode(address.pincode)
    ) {
      const result = await updateProfile({
        docId: user.id,
        dataObject: { name, phone, address },
      });
      // console.log("result: ", result);

      if (result.data) {
        successNotification(`Profile Updated Successfully!!!`);
        dispatch(updateProfileDetail(defaultValues));
        dispatch(setIsLoading(false));
      } else {
        errorNotification(result.error.message);
        dispatch(setIsLoading(false));
      }
    } else {
      errorNotification(`Invalid details!!!`);
      dispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <Stack className={`${classes.pro} container`}>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", mb: 2 }}
          >
            <Typography
              id="modal-modal-profile"
              variant="h4"
              component="h2"
              sx={{ color: "#000", fontWeight: "bold" }}
            >
              Profile
            </Typography>
            {disableProfileEdit && (
              <IconButton aria-label="Edit">
                <EditIcon
                  sx={{ color: "#dc3237" }}
                  onClick={() => setDisableProfileEdit(false)}
                />
              </IconButton>
            )}
          </Stack>
          <Grid container spacing={2} sx={profilehalf}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                id="outlined-basic1"
                label="Name"
                disabled={disableProfileEdit}
                onChange={onChangeHandler}
                value={defaultValues.name}
                variant="outlined"
                name="name"
                type="text"
                className="name"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                id="outlined-basic1"
                label="Email"
                value={defaultValues.email}
                onChange={onChangeHandler}
                disabled
                variant="outlined"
                name="email"
                type="mail"
                className="name"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                id="outlined-basic1"
                label="Phone Number"
                value={defaultValues.phone}
                onChange={onChangeHandler}
                disabled={disableProfileEdit}
                variant="outlined"
                name="phone"
                type="mail"
                className="name"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="outlined-multiline-static"
                label="Address Line"
                placeholder="Door / House No, Street Name, Area"
                value={defaultValues.address.line}
                onChange={onChangeHandler}
                disabled={disableProfileEdit}
                name="line"
                sx={{ mb: 2, width: "100%" }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-multiline-static"
                // label="Country"
                multiline
                rows={1}
                value={country.name}
                sx={{ width: "100%" }}
                disabled={true}
              />
              {/* <CountrySelect
                defaultValue={country}
                onChange={(object) => onChangeDropdown("country", object)}
                placeHolder="Select Country"
              /> */}
            </Grid>
            <Grid item md={6} xs={12}>
              <StateSelect
                defaultValue={state}
                countryid={country.id}
                onChange={(object) => onChangeDropdown("state", object)}
                placeHolder="Select State"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <CitySelect
                defaultValue={city}
                countryid={country.id}
                stateid={state.id}
                onChange={(object) => onChangeDropdown("city", object)}
                placeHolder="Select City"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                id="outlined-basic1"
                name="pincode"
                value={defaultValues.address.pincode}
                onChange={onChangeHandler}
                disabled={disableProfileEdit}
                variant="outlined"
                className="name"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          {!disableProfileEdit && (
            <Stack
              spacing={2}
              direction="row"
              justifyContent="end"
              alignItems="end"
            >
              <Button variant="contained" sx={save} onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button
                variant="outlined"
                sx={Cancel}
                onClick={() => setDisableProfileEdit(true)}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>
    </>
  );
};

export default ProfileDetail;

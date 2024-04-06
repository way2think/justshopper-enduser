import { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SignupModal from "../Signup/SignupModal";
import { isValidEmail, isValidPassword } from "../../utils/validator";
import {
  errorNotification,
  successNotification,
} from "../../utils/notifications";
import { useSignInWithEmailAndPasswordMutation } from "../../api/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,

  "@media (max-width: 768px)": {
    width: 400,
    maxHeight: "450px",
    overflowY: "scroll",
  },
};

const loginModalBtn = {
  border: "1px solid #dc3237",
  color: "#dc3237",
  fontSize: "14px",
  fontWeight: 500,
  margin: "0 10px",

  fontFamily: "amazonbold",
  "@media (max-width: 768px)": {
    marginBottom: "10px",
    marginLeft: "0px",
    marginRight: "10px",
    border: "none",
    fontWeight: "bold",
  },
};
const loginbtn = {
  // border: "1px solid #dc3237",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 500,
  background: "#dc3237",
  fontFamily: "amazonbold",
  width: "100%",
  "&:hover": {
    background: "#fff",
    color: "#dc3237",
    fontsize: "18px",
    border: "1px solid #dc3237",
  },
};

// const forgot = {
//   color: "#f19e38",
//   fontSize: "18px",
//   fontWeight: 500,
//   fontFamily: "'Poppins', sans-serif",
// };

export default function LoginModal() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithEmailAndPassword, { isLoading, isError, data, error }] =
    useSignInWithEmailAndPasswordMutation();

  // console.log("result: ", isLoading, data, error);

  const [userCred, setUserCred] = useState({
    email: "",
    password: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const closeModal = () => {
    setOpen(false);
    setUserCred({
      email: "",
      password: "",
    });
  };

  //for user verificationa nd login(submit)

  const handleLogin = async () => {
    const { email, password } = userCred;
    if (isValidEmail(email) && isValidPassword(password)) {
      const result = await signInWithEmailAndPassword({ email, password });
      console.log("result: ", result);
      const user = result.data;
      if (user) {
        const { id, name, email, phone, role, favourite, saved_address } = user;
        dispatch(
          setUser({
            id,
            name,
            email,
            phone,
            role,
            favourite,
            saved_address,
            isAuthenticated: true,
          })
        );
        successNotification(`Successfully Signed In!!!`);
        closeModal();
      } else {
        errorNotification(result.error.message);
      }
    } else {
      errorNotification("Invalid Email/Password");
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} sx={loginModalBtn}>
        Login
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            mb={2}
          >
            <a
              href="https://www.facebook.com/"
              className="facebooklink"
              target="_blank"
            >
              <img src="./images/facebook.png" alt="" className="facebook" />
            </a>
            <a
              href="https://accounts.google.com/v3/signin/identifier?hl=en-gb&ifkv=ASKXGp2RgVfjRJrNXC3fG72rtTTUc_MMfXlYJvdK3nF-TsiIdpmnApC7DGyHyja_uF0xuFnmQzrw&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S688583639%3A1701781129051920&theme=glif"
              className="facebooklink"
              target="_blank"
            >
              <img src="./images/google.png" alt="" className="facebook" />
            </a>
            <a
              href="https://www.icloud.com/?s=Iseo"
              className="facebooklink"
              target="_blank"
            >
              <img src="./images/apple.png" alt="" className="facebook" />
            </a>
          </Stack>
          <p className="or">Or</p> */}
          <Stack direction="column">
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <img
                src="../images/JS logo png.png"
                alt=""
                style={{ width: "55px ", borderRadius: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                id="modal-modal-title"
                variant="h4"
                component="h2"
                sx={{
                  textAlign: "center",
                  marginBottom: 1,
                  fontFamily: "amazonbold",
                }}
              >
                Login
              </Typography>
              <Grid container>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    name="email"
                    type="email"
                    sx={{ mb: 2 }}
                    value={userCred.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ mb: 2, width: "100%" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={userCred.password}
                      onChange={handleInputChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Stack
                direction="row"
                alignItems="end"
                justifyContent="end"
                sx={{ mb: 2 }}
              >
                {/* <Checkbox name="remember" label="Remember me" /> */}
                <Link
                  variant="subtitle2"
                  underline="hover"
                  sx={{ color: "#9F3239" }}
                >
                  Forgot password?
                </Link>
              </Stack>
              <Button sx={loginbtn} onClick={handleLogin}>
                Login
              </Button>

              <SignupModal />
            </Grid>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

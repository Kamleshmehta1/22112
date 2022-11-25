import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllDataQuery, useAddSinglePostMutation } from "../../features";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { loginMethod } from "../../createSlice";
import bcrypt from 'bcryptjs';

function Page(props) {
  const [input, setInput] = useState({
    email: [""],
    password: [""],
    confirmPassword: [""],
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllDataQuery({}, { refetchOnMountOrArgChange: true });
  const [addSinglePost, { isLoading: isPosting }] = useAddSinglePostMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.type === "LOGIN") {
      if (input.email[0] === "" || input.password[0] === "") {
        toast.error("Kindly enter proper input!");
        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
        return;
      }
      if (data.some((ele) => ele.email === input.email[0] && bcrypt.compareSync(input.password[0], ele.password))) {
        let hour = new Date(new Date().getTime() + 60 * 60 * 1000);
        Cookies.set("loginState", input.email[0], { expires: hour });

        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
        if (Cookies.get("loginState")) {
          dispatch(loginMethod(true));
          toast.success("Login successfully !");
          navigate("/feed");
        }
      } else {
        toast.warning("Invalid email or password");
      }
    } else {
      if (input.email[0] === "" || input.password[0] === "" || input.confirmPassword[0] === "") {
        toast.error("Kindly enter proper input!");
        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
        return;
      }
      if (input.password[0] !== input.confirmPassword[0]) {
        toast.warning("Password is not matching!");
        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
        return;
      }
      if (!isLoading && data.some((ele) => ele.email === input.email[0])) {
        toast.warning("Email id already Present!");
        return;
      } else {
        addSinglePost({ email: input.email[0], password: bcrypt.hashSync(input.password[0], 10), pageName: "" })
        toast.success("Sign Up successfully !");
        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
      }
    }
  };

  const theme = createTheme();

  const handleChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: [e.target.value],
    }));
  };

  if (isPosting) {
    return <h1>Loading...</h1>
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {props.type}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              value={input.email[0] || ""}
              label="Email Address"
              name="email"
              autoComplete="off"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={input.password[0] || ""}
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
              autoComplete="off"
            />
            {props.type === "SIGNUP" ? (
              <TextField
                margin="normal"
                required
                fullWidth
                value={input.confirmPassword[0] || ""}
                name="confirmPassword"
                label="Confirm Password"
                type="confirmPassword"
                id="confirmPassword"
                onChange={handleChange}
                autoComplete="off"
              />
            ) : null}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {props.type}
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default Page;

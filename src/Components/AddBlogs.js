import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useAddSinglePostMutation } from "../postFeature";


function AddBlogs() {
  const [input, setInput] = useState({ name: [""], image: [""], post: [""] });
  const [addSinglePost, { isLoading: isAdding }] = useAddSinglePostMutation();

  const getRandomNumber = () => Math.floor(Date.now() + Math.random(1000)).toString();

  const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  let today = new Date();
  var options = { day: "numeric", month: "long" };
  var year = today.getUTCFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.name[0] === "" || input.image[0] === "" || input.post[0] === "") {
      toast.error("Kindly enter valid input!");
      return;
    }
    if (!isValidUrl(input.image[0])) {
      toast.error("Kindly enter valid URL");
      return;
    }
    addSinglePost({
      rootUser: Cookies.get("loginState"),
      id: getRandomNumber(),
      name: input.name[0],
      image: input.image[0],
      post: input.post[0],
      date: today.toLocaleDateString("en-US", options) + ", " + year
    })
    toast.success("Post added successfully");
    setInput({ name: [""], image: [""], post: [""] });
  };

  const theme = createTheme();


  const handleChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: [e.target.value]
    }));
  }

  if (isAdding) {
    return <h1>Loading...</h1>
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography className="title" component="h1" variant="h4">
            ADD POST
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              value={input.name[0]}
              label="Post Name"
              name="name"
              autoComplete="off"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="image"
              value={input.image[0]}
              label="Image Link"
              name="image"
              autoComplete="off"
              autoFocus
              onChange={handleChange}
            />
            <TextareaAutosize
              aria-label="minimum height"
              minRows={4}
              name="post"
              value={input.post[0]}
              id="textAreaSize"
              required
              placeholder="Enter Post"
              onChange={handleChange}
              style={{ width: "100 %" }}
            />
            <Button type="submit" className="loginInput" variant="contained" sx={{ mt: 1, mb: 5 }}>
              ADD BLOG
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default AddBlogs;

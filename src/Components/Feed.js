import React, { useState } from "react";
import Cookies from "js-cookie";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import { useNavigate, useLocation } from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetAllPostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../postFeature";
import ReactReadMoreReadLess from "react-read-more-read-less";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import AddBlogs from "./AddBlogs";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Player } from "video-react";
import "../../node_modules/video-react/dist/video-react.css"; // import css
import poster from "../image/play-button.png";
import { useSelector } from "react-redux";

function Feed(props) {
  console.log(props);
  const navigate = useNavigate();
  const [input, setInput] = useState({ name: [""], image: [""], post: [""] });
  const [updateId, setUpdateId] = useState("");

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

  const [open, setOpen] = useState(false);
  const blogType = useSelector((state) => state.loginData.blogType);

  const { data: post, isLoading } = useGetAllPostsQuery({ user: "" });

  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(urlString);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (input.name[0] === "" || input.image[0] === "" || input.post[0] === "") {
      toast.error("Kindly enter valid input!");
      return;
    }
    if (!isValidUrl(input.image[0])) {
      toast.error("Kindly enter valid URL");
      return;
    }
    console.log("UPDATE");
    updatePost({
      rootUser: Cookies.get("loginState"),
      id: updateId,
      name: input.name[0],
      image: input.image[0],
      post: input.post[0],
    });
    setInput({ name: [""], image: [""], post: [""] });
    toast.success("Updated Successfully!");
    setOpen(false);
  };

  const handleEdit = (userId) => {
    setOpen(true);
    setUpdateId(userId);
    let Obj = post.find((ele) => ele.id === userId);
    setInput({ name: [Obj.name], image: [Obj.image], post: [Obj.post] });
  };
  const location = useLocation();
  const handleDelete = (id) => {
    let boolValue = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (boolValue) {
      deletePost(id);
      let path = location.pathname;
      navigate(path);
      toast.success("Post deleted successfully!");
    }
  };

  const handleChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: [e.target.value],
    }));
  };

  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  if (isDeleting || isUpdating || isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <div>
        {blogType === "USER_BLOGS" && <AddBlogs />}
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {props.posts.map((ele) => (
            <Grid item xs={12} sm={12} md={12} key={ele.id}>
              <Card
                sx={{ maxWidth: 500, margin: "40px auto 40px auto" }}
                key={ele.id}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                      {ele.rootUser.slice(0, 1).toUpperCase()}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={ele.name}
                  subheader={ele.date || "September 14, 2016"}
                />
                {isImage(ele.image) ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={ele.image}
                    alt="Not Found"
                  />
                ) : (
                  <Player playsInline poster={poster} src={ele.image} />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {ele.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <ReactReadMoreReadLess
                      charLimit={60}
                      readMoreText={"Read more ▼"}
                      readLessText={"Read less ▲"}
                      readMoreClassName="read-more-less--more"
                      readLessClassName="read-more-less--less"
                    >
                      {ele.post}
                    </ReactReadMoreReadLess>
                  </Typography>
                </CardContent>
                {ele.rootUser ===
                  Cookies.get("loginState")?.split("=")[0] && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ margin: "10px" }}
                        onClick={(e) => handleEdit(ele.id)}
                      >
                        EDIT
                      </Button>
                      <Modal
                        keepMounted
                        open={open}
                        sx={{ marginTop: "100px" }}
                        onClose={() => setOpen(false)}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                      >
                        <Container component="main" maxWidth="xs">
                          <CssBaseline />
                          <Box
                            sx={{
                              marginTop: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              component="form"
                              onSubmit={handleUpdate}
                              noValidate
                              sx={{ mt: 1 }}
                            >
                              <TextField
                                margin="normal"
                                required
                                fullWidth
                                sx={{ backgroundColor: "#fff" }}
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
                                sx={{ backgroundColor: "#fff" }}
                                id="image"
                                type="url"
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
                              <Button
                                type="submit"
                                className="loginInput"
                                variant="contained"
                                sx={{ mt: 1, mb: 5 }}
                              >
                                UPDATE POST
                              </Button>
                            </Box>
                          </Box>
                        </Container>
                      </Modal>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ margin: "10px" }}
                        onClick={() => handleDelete(ele.id)}
                      >
                        DELETE
                      </Button>
                    </>
                  )}
              </Card>
            </Grid>
          ))}

          <ToastContainer />
        </Grid>
      </div>
    </>
  );
}

export default Feed;

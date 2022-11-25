import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loginMethod, searchMethod, blogTypeMethod } from "../createSlice";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';


function Header() {
  const loginState = useSelector((state) => state.loginData.loginState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogout = () => {
    Cookies.remove("loginState");
    if (!Cookies.get("loginState")) {
      toast.success("Logout successfully");
      dispatch(loginMethod(false));
      navigate("/user");
    }
  };
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  const handleSearch = (e) => dispatch(searchMethod(e.target.value));

  const currentUser = Cookies.get("loginState")?.split("=")[0].slice(0, 1).toUpperCase();
  const handleBlogs = (type) => {
    dispatch(blogTypeMethod(type));
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            className="logo"
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BLOG
          </Typography>
          <Typography
            variant="h5"
            noWrap
            className="logo"
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BLOG
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <Link className="navLinks" to="/">
                DASHBOARD
              </Link>
            </Button>
            {loginState ? (
              <>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  <Link className="navLinks" to="/feed" onClick={() => handleBlogs("ALL_BLOGS")}>
                    Feeds
                  </Link>
                </Button>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  <Link className="navLinks" to="/feed" onClick={() => handleBlogs("USER_BLOGS")}>
                    Personal Feeds
                  </Link>
                </Button>
              </>
            ) : null}
          </Box>
          {
            location.pathname === "/feed" &&
            <>
              <Search sx={{ marginRight: "100px" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={handleSearch}
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </>
          }
          {loginState ? (
            <>
              <Avatar sx={{ cursor: "pointer", backgroundColor: "orange" }} alt={currentUser || "G"} src="/static/images/avatar/2.jpg">
                {currentUser || "G"}
              </Avatar>
              <Button color="error" sx={{ margin: "0 0 2px 5px" }} variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : <Button color="success" sx={{ margin: "0 0 2px 5px" }} variant="contained">
            <Link className="userProfile" to="/user">
              LOGIN
            </Link>
          </Button>}
        </Toolbar>
      </Container>
      <ToastContainer />
    </AppBar>
  );
}

export default Header;

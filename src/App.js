import React, { useEffect } from "react";
import Header from "./Components/Header";
import User from "./Components/User/User";
import Page from "./Components/User/Page";
import Home from "./Components/Home";
import { useSelector, useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { loginMethod } from "./createSlice";
import { Route, Routes, useLocation } from "react-router-dom";
import AllFeed from "./Components/AllFeed";

function App() {
  const loginState = useSelector((state) => state.loginData.loginState);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!Cookies.get("loginState")) {
      dispatch(loginMethod(false));
    }
  }, [location, dispatch])



  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {loginState ? (
          <>
            <Route path="/feed" element={<AllFeed />} />
          </>
        ) : (
          <Route path="/user" element={<User />}>
            <Route path="login" element={<Page />} />
            <Route path="signUp" element={<Page />} />
          </Route>
        )}
        <Route path="*" element={<h1 style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>401 Unauthorized (session timeout)</h1>} />
      </Routes>
    </div >
  );
}

export default App;

import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useFindUserQuery } from "../features";
import { useSelector } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useDispatch } from "react-redux";
import { findUserMethod } from "../createSlice";
import { useGetAllPostsQuery } from "../postFeature";
import { useAddNewFriendMutation, useGetAllDataQuery } from "../features";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import lodash from 'lodash'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function FindUsers() {
  const dispatch = useDispatch();

  const searchUserData = useSelector((state) => state.loginData.findUser);
  const handleFindUser = (e, value) => {
    console.log(value);
    dispatch(findUserMethod(value || e.target.value));
  };

  //   finding friend-------------------------------------------------------------------------
  const { data: users, isLoading: isSearching } = useFindUserQuery(
    searchUserData ? `?email=${searchUserData}` : ""
  );
  //   ----------------------------------------------------------------------------------------
  //   finding friend-------------------------------------------------------------------------
  // const { data: allUsers, isLoading: allUsersLoading } = useGetAllDataQuery();
  const { data: allUsers, isLoading: allUsersLoading } = useFindUserQuery(
    `?email=${Cookies.get("loginState")}`
  );

  //   ----------------------------------------------------------------------------------------

  //   get selected user posts-----------------------------------------------------------------
  let { data, isLoading } = useGetAllPostsQuery({
    user: searchUserData ? `?rootUser=${searchUserData}` : "",
  });
  let { data: currentUserPosts, isLoading: currentPosts } = useGetAllPostsQuery({ user: "" });
  //   ----------------------------------------------------------------------------------------

  //   adding friend's posts to database-----------------------------------------------------------------
  const [addNewFriend, { isLoading: isAdding }] = useAddNewFriendMutation();
  //   ----------------------------------------------------------------------------------------

  const handleAddFriend = () => {
    if (!isLoading && !allUsersLoading && !currentPosts) {
      console.log(allUsers);
      let currentUser = allUsers.find(
        (ele) => ele.email === Cookies.get("loginState")
      );
      let currentPosts = currentUserPosts.filter(
        (ele) => ele.rootUser === Cookies.get("loginState")
      );
      console.log(currentPosts);
      let unique = lodash.differenceBy(data, currentUser.friendList, "id")
      // let unique1 = lodash.differenceBy(currentPosts, currentUser.friendList, "rootUser")
      // let arr = [...currentUser.friendList, ...unique, ...unique1];
      let arr = [...currentUser.friendList, ...unique];
      addNewFriend({ ...currentUser, friendList: arr });
      allUsers.forEach((ele) => {
        if (ele.email === searchUserData) {
          addNewFriend({ ...ele, friendList: currentPosts });
        }
      })
      toast.success(`${searchUserData} is added!`);
    }
  };


  const handleRemoveFriend = () => {
    if (!isLoading && !allUsersLoading) {
      let currentUser = allUsers.find(
        (ele) => ele.email === Cookies.get("loginState")
      );
      const unique = currentUser.friendList.filter((ele) => ele.rootUser !== searchUserData)
      addNewFriend({ ...currentUser, friendList: unique });
      allUsers.forEach((ele) => {
        console.log(ele);
      })
      toast.success(`${searchUserData} is removed!`);
    }
  }


  if (isSearching) {
    return <h1>Searching...</h1>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        width: "50%",
        margin: "50px auto 0 auto",
      }}
    >
      <div style={{
        flex: "45%", width: "100%",
        margin: "0 10px 0 0",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
      }}>
        <Autocomplete
          id="combo-box-demo"
          options={users}
          getOptionLabel={(option) => option.email}
          style={{ width: "100%" }}
          onInputChange={handleFindUser}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Find Friend"
              variant="outlined"
              sx={{ width: "100%" }}
              fullWidth
            />
          )}
        />
      </div>
      {searchUserData && (
        <div
          style={{
            flex: "45%",
            width: "100%",
            fontSize: "1.2rem",
            textAlign: "left",
            borderRadius: "5px",
            padding: "8px 0 0 10px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          }}
        >
          {searchUserData}
          <span
            style={{
              cursor: "pointer",
              margin: "20px 0 0 10px",
              padding: "20px 0 0 10px",
            }}
          >
            {searchUserData && <span style={{ marginTop: "10px" }}><PersonAddIcon style={{
              margin: "0 0 0 5px", color: "blue"
            }} onClick={handleAddFriend} /><DeleteForeverIcon onClick={handleRemoveFriend} style={{ margin: "0 0 0 5px", color: "red" }} /></span>}
          </span>
        </div>
      )
      }
      <ToastContainer />
    </div >
  );
}

export default FindUsers;

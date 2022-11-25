import { createSlice } from "@reduxjs/toolkit"
import Cookies from 'js-cookie';

const initialState = {
    loginState: Cookies.get("loginState") || false, searchData: "", 
    blogType: "ALL_BLOGS", 
    findUser: ""
}

export const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        signUpMethod: (state, action) => {
            state.userData = [...state.userData, action.payload];
        },
        loginMethod: (state, action) => {
            state.loginState = action.payload
        },
        searchMethod: (state, action) => {
            state.searchData = action.payload
        },
        blogTypeMethod: (state, action) => {
            state.blogType = action.payload
        },
        findUserMethod: (state, action) => {
            state.findUser = action.payload
        }
    }
})

export const { signUpMethod, loginMethod, findUserMethod, searchMethod, blogTypeMethod } = dataSlice.actions;
export default dataSlice.reducer;
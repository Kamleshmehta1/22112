import { configureStore } from "@reduxjs/toolkit"
import loginReducer from "../createSlice"
import { dataApi } from "../features"
import { postApi } from "../postFeature"

export const store = configureStore({
    reducer: {
        loginData: loginReducer,
        dataApi: dataApi.reducer,
        postApi: postApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([
            dataApi.middleware, postApi.middleware
        ]),

})

store.subscribe(() => {
    // console.log(store.getState());
    localStorage.setItem("credentials", JSON.stringify(store.getState().loginData.userData));
    localStorage.setItem("loginStatus", JSON.stringify(store.getState().loginData.userStatus));
})
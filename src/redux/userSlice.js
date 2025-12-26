import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    //Check local Storage 
    currentUser : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("userRole") || null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
        //if login success 
        loginSuccess: (state, action) => {
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
            //save localstorage so no data is missing when it refress
            localStorage.setItem("user" , JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem          ("userRole", action.payload.          role);

        },
        //logout part
        logout:(state) => {
            state.currentUser = null;
            state.token = null;
            state.role = null;
            //clear data
            localStorage.clear();
        }
    }
})


export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer
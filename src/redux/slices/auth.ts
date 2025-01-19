import { createAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
// import { HYDRATE } from "next-redux-wrapper";
// const HYDRATE_ACTION = createAction(HYDRATE)

export interface AuthUser {
  authUser: any;
}

const initialState: AuthUser = {
  authUser: null,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action) {
      state.authUser = action.payload;
    },
  }
});

export const { setAuthUser } = auth.actions;

export const getAuthUserState = (state: AppState) => state.auth?.authUser;

// export default auth.reducer;

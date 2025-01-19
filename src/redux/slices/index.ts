import { combineReducers } from "@reduxjs/toolkit";
import { auth } from "./auth";
import { clientThemeConfig } from "./clientThemeConfig";
import { activeModalPage } from "./common";
import { loader } from "./loader";
import { toast } from "./toast";

const rootReducer = combineReducers({
  [auth.name]: auth.reducer,
  [loader.name]: loader.reducer,
  [activeModalPage.name]: activeModalPage.reducer,
  [toast.name]: toast.reducer,
  [clientThemeConfig.name]: clientThemeConfig.reducer
});
export default rootReducer;
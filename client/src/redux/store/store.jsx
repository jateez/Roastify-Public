import { configureStore } from "@reduxjs/toolkit";
import history from "../app/historySlice";

export default configureStore({
  reducer: {
    history,
  },
});

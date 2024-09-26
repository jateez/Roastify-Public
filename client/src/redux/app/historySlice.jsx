import { createSlice } from "@reduxjs/toolkit";
import instance from "../../config/instance";
import { toast } from "react-toastify";

export const historySlice = createSlice({
  name: "histories",
  initialState: {
    value: [],
    loading: false,
    error: "",
  },
  reducers: {
    setHistories: (state, action) => {
      state.value = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const fetchHistories = () => {
  return async function (dispatch) {
    try {
      dispatch(setLoading(true));
      const { data } = await instance({
        method: "get",
        url: "/roasts",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(data, "<<< slice");
      dispatch(setHistories(data.data));
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteHistory = (id) => {
  return async function (dispatch) {
    try {
      dispatch(setLoading(true));
      const { data } = instance({
        method: "delete",
        url: `/roasts/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      dispatch(fetchHistories());
    } catch (error) {
      dispatch(setLoading(false));
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const { setHistories, setLoading, setError } = historySlice.actions;
export default historySlice.reducer;

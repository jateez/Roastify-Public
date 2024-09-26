import { createBrowserRouter, redirect } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import MainLayout from "../pages/MainLayout";
import Register from "../pages/Register";
import Home from "../pages/Home";
import SpotifyCallback from "../pages/SpotifyCallback";
import SpotifyRoast from "../pages/SpotifyRoast";
import Histories from "../pages/Histories";
import HistoryDetails from "../pages/HistoryDetails";
import Profile from "../pages/Profile";
import CustomRoast from "../pages/CustomRoast";

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <LandingPage />,
    loader: () => {
      if (!localStorage.getItem("access_token")) {
        return null;
      }
      return redirect("/");
    },
  },
  {
    path: "/register",
    element: <Register />,
    loader: () => {
      if (!localStorage.getItem("access_token")) {
        return null;
      }
      return redirect("/");
    },
  },
  {
    path: "/login",
    element: <Login />,
    loader: () => {
      if (!localStorage.getItem("access_token")) {
        return null;
      }
      return redirect("/");
    },
  },
  {
    path: "/logout",
    loader: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("spotify_access_token");
      return redirect("/welcome");
    },
  },
  {
    path: "/",
    element: <MainLayout />,
    loader: () => {
      if (localStorage.getItem("access_token")) {
        return null;
      }
      return redirect("/welcome");
    },
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/callback",
        element: <SpotifyCallback />,
      },
      {
        path: "/spotify-roast",
        element: <SpotifyRoast />,
      },
      {
        path: "/histories",
        element: <Histories />,
      },
      {
        path: "/histories/:historyId",
        element: <HistoryDetails />,
      },
      {
        path: "/users",
        element: <Profile />,
      },
      {
        path: "/custom-roast",
        element: <CustomRoast />,
      },
    ],
  },
]);
export default router;

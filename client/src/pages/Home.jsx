import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../config/instance";
import { toast } from "react-toastify";

export default function Home() {
  const [loginUrl, setLoginUrl] = useState("");
  async function fetchLoginUrl() {
    try {
      const { data } = await instance({
        method: "get",
        url: "/spotify-login",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setLoginUrl(data.loginUrl);
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
    }
  }
  useEffect(() => {
    fetchLoginUrl();
  }, []);

  function handleSpotifyLogin() {
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      toast.error("Login URL Does not exists", {
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
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen mx-auto gap-y-5">
        <p className="text-2xl md:text-4xl font-medium text-spotify-white">Which one do you prefer today?</p>
        <div className="divider divider-success mb-5"></div>
        <div className="flex flex-col gap-y-5 w-full">
          <button onClick={handleSpotifyLogin} className="btn btn-lg bg-spotify-green hover:bg-spotify-light-green hover:ring-2 hover:ring-spotify-green text-spotify-off-white transition duration-300 hover:text-spotify-black">
            Roast My Spotify Account
          </button>
          <Link to={"/custom-roast"} className="btn btn-lg outline outline-1 hover:ring-2 hover:ring-spotify-green outline-spotify-light-green bg-spotify-dark-gray hover:bg-spotify-green text-spotify-light-green hover:text-spotify-white">
            Custom Roast
          </Link>
        </div>
      </div>
    </>
  );
}

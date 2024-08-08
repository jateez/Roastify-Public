import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import instance from "../config/instance";

export default function SpotifyCallback() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  let params = new URLSearchParams(location.search);

  function fetchToken() {
    const spotify_access_token = params.get("spotify_access_token");
    console.log(spotify_access_token);
    if (spotify_access_token) {
      localStorage.setItem("spotify_access_token", spotify_access_token);
      console.log("Token set:", localStorage.getItem("spotify_access_token"));
      navigate("/spotify-roast");
    }
  }
  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen mx-auto gap-y-5">
        <p className="text-2xl md:text-4xl font-medium text-spotify-white">Authenticating with Spotify...</p>
      </div>
    </>
  );
}

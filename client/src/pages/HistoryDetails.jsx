import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../config/instance";
import { toast } from "react-toastify";

export default function HistoryDetails() {
  const [isLoading, setIsLoading] = useState();
  const [roast, setRoast] = useState();
  const { historyId } = useParams();
  async function fetchRoast() {
    try {
      setIsLoading(true);
      const { data } = await instance({
        method: "get",
        url: `roasts/${historyId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setRoast(data.data);
    } catch (error) {
      setIsLoading(false);
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
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchRoast();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex w-full min-h-screen flex-col justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }
  return (
    <>
      {roast && (
        <div className="flex flex-col items-center justify-center w-full mx-auto gap-y-5 p-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center text-spotify-white">Roast History</h2>
            <div className="card w-full bg-base-100 shadow-xl mb-4">
              <div className="card-body">
                <h3 className="card-title">Tipe Roasting: {roast.roastType === "spotify_account" ? "Akun Spotify" : "Artist atau Track pilihan"}</h3>
                <p className="text-gray-500">{new Date(roast.createdAt).toISOString().split("T")[0]}</p>
                <p className="mt-2">{roast.roastData}</p>
                <div className="divider"></div>

                <div>
                  <h4 className="text-xl font-semibold">Tracks:</h4>
                  <ul className="list-disc list-inside">
                    {roast.tracks.map((track, index) => (
                      <li key={index}>
                        <span className="font-bold">{track.name}</span> by {track.artists} from the album <span className="italic">{track.album.name}</span> (Released: {track.album.release_data})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="divider"></div>

                <div>
                  <h4 className="text-xl font-semibold">Artists:</h4>
                  <ul className="list-disc list-inside">
                    {roast.artists.map((artist, index) => (
                      <li key={index}>
                        <span className="font-bold">{artist.name}</span> ({artist.genres}) - Followers: {artist.total_followers}, Popularity: {artist.popularity_score}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

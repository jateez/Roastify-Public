import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../config/instance";

export default function SpotifyRoast() {
  const [roastData, setRoastData] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  async function fetchRoastData() {
    const spotify_access_token = localStorage.getItem("spotify_access_token");
    if (!spotify_access_token) {
      // navigate("/");
      console.log("Token set:", localStorage.getItem("spotify_access_token"));
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await instance({
        method: "get",
        url: `/spotify-roast?spotify_access_token=${spotify_access_token}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(data, "<<< data");
      setRoastData(data);
      console.log(roastData, "<<<< ROAST DATA");
      console.log(roastData.output.roastData, "<<<< ROAST DATA inside OUTPUT");
    } catch (error) {
      console.error("Error fetching roast data:", error);
      // localStorage.removeItem("spotify_access_token");
      // Toast Error first must login again
      // navigate("/");
      // Handle error (e.g., redirect to login if token is invalid)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // fetchRoastData();
  }, []);

  if (isLoading) {
    return <div className="mt-24">Loading...</div>;
  }

  return (
    <>
      <div className="bg-spotify-black min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl bg-spotify-dark-gray rounded-lg shadow-lg p-8">
          <h2 className="text-spotify-green text-2xl font-bold mb-4">Your Music Roast</h2>
          <p className="text-spotify-white text-lg leading-relaxed">
            Kamu bener-bener suka sama musik siapa sih? TWICE sama aespa? Gawat, itu kayak milih antara nasi basi dan kerupuk pecah. Sekarang ini, NewJeans udah jadi ratu dengan followers yang lebih banyak dan musik yang bikin orang pengen
            joget, sedangkan TWICE dengan "FANCY"-nya yang udah basi banget, itu cuma kayak nonton sinetron remaja. Apalagi kalau dibandingin sama Taylor Swift yang bikin lagu-lagu relatable, kamu flirt sama musik K-pop yang liriknya
            se-itu-itu aja. Dan mau komen soal "Armageddon"? Kapan mati suri-nya? Coba deh, sekali-sekali d
          </p>
          <div className="mt-6 flex justify-center">
            <Link to={"/custom-roast"}>
              <button className="bg-spotify-green hover:bg-spotify-light-green text-spotify-black font-bold py-2 px-4 rounded-full transition duration-300">Get Another Roast</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

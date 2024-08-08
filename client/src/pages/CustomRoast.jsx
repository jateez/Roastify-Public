import { useEffect, useState } from "react";
import instance from "../config/instance";

export default function CustomRoast({ imageUrl }) {
  const [input, setInput] = useState([]);
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("artist%2Ctrack");
  const [error, setError] = useState(null);

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (!search) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const { data } = await instance({
          method: "post",
          url: `/spotify-search?search=${search}&type=${type}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          data: {
            spotify_access_token: localStorage.getItem("spotify_access_token"),
          },
        });
        setResults(data);
        console.log(data, "<<< data");
        // const response = await axios.get(`https://your-api-endpoint.com/search?q=${search}`);
        // setResults(response.data);
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [search]);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <>
      <div className="flex w-full min-h-screen flex-col items-center">
        <div className="w-full flex flex-col justify-start items-center p-10">
          <div className="h-20 w-[60%]">
            <label className="input input-bordered input-md flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
              <input type="text" className="grow" placeholder="Search" onChange={handleInputChange} value={search} />
            </label>
          </div>
          <div className="flex gap-x-5 mt-5">
            <button
              className="btn sm:btn-sm md:btn-md bg-spotify-green hover:bg-spotify-light-green text-spotify-off-white"
              onClick={(e) => {
                e.preventDefault();
                setType("artist%2Ctrack");
              }}
            >
              All
            </button>
            <button
              className="btn sm:btn-sm md:btn-md bg-spotify-green hover:bg-spotify-light-green text-spotify-off-white"
              onClick={(e) => {
                e.preventDefault();
                setType("track");
              }}
            >
              Tracks
            </button>
            <button
              className="btn sm:btn-sm md:btn-md bg-spotify-green hover:bg-spotify-light-green text-spotify-off-white"
              onClick={(e) => {
                e.preventDefault();
                setType("artist");
              }}
            >
              Artists
            </button>
            <button className="btn sm:btn-sm md:btn-md bg-spotify-green hover:bg-spotify-light-green text-spotify-off-white">Roast</button>
          </div>
          <div className="divider divider-lg pt-10"></div>
          <div className="flex w-full pt-10 px-10 shadow-md justify-center h-80">
            <div className="w-1/2 h-40">
              <span className="text-md md:text-2xl text-spotify-white font-medium">Top Result</span>
              <div className="p-5 w-full h-full flex flex-col gap-y-2">
                {imageUrl ? (
                  <div className="avatar">
                    <div className="w-32 rounded-xl">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                ) : (
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content w-32 rounded-xl">
                      <span className="text-xl">{"judul lagu"}</span>
                    </div>
                  </div>
                )}
                <p className="text-lg text-spotify-white font-medium pt-4">Judul lagu</p>
                <div className="flex">
                  <p className="text-md text-spotify-white font-light">
                    Song <span className="font-normal">Artist</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-1/2 h-40">
              <span className="text-md md:text-2xl text-spotify-white font-medium">Songs</span>
              <div className="p-5 w-full h-1/4 flex flex-col gap-y-2">
                <div className="flex w-full">
                  <div className="w-1/6">
                    {imageUrl ? (
                      <div className="avatar">
                        <div className="w-12 rounded-xl">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-xl">
                          <span className="text-xl">{"judul lagu"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-4/6 flex flex-col justify-evenly">
                    <p>Judul</p>
                    <p>Artist</p>
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-1/6">
                    {imageUrl ? (
                      <div className="avatar">
                        <div className="w-12 rounded-xl">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-xl">
                          <span className="text-xl">{"judul lagu"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-4/6 flex flex-col justify-evenly">
                    <p>Judul</p>
                    <p>Artist</p>
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-1/6">
                    {imageUrl ? (
                      <div className="avatar">
                        <div className="w-12 rounded-xl">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-xl">
                          <span className="text-xl">{"judul lagu"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-4/6 flex flex-col justify-evenly">
                    <p>Judul</p>
                    <p>Artist</p>
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-1/6">
                    {imageUrl ? (
                      <div className="avatar">
                        <div className="w-12 rounded-xl">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-xl">
                          <span className="text-xl">{"judul lagu"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-4/6 flex flex-col justify-evenly">
                    <p>Judul</p>
                    <p>Artist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full pt-10 px-10 shadow-md justify-center h-80">
            <div className="w-full">
              <span className="text-md md:text-2xl text-spotify-white font-medium">Artists</span>
              <div className="flex w-full pt-5">
                <div className="w-1/5">
                  {imageUrl ? (
                    <div className="avatar shadow">
                      <div className="w-32 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder shadow">
                      <div className="bg-neutral text-neutral-content w-32 rounded-full">
                        <span className="text-xl">{"judul lagu"}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-lg text-spotify-white font-medium pt-4">Nama Artist</p>
                  <p className="text-md text-spotify-white font-normal pt-1 opacity-75">Artist</p>
                </div>
                <div className="w-1/5">
                  {imageUrl ? (
                    <div className="avatar shadow">
                      <div className="w-32 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder shadow">
                      <div className="bg-neutral text-neutral-content w-32 rounded-full">
                        <span className="text-xl">{"judul lagu"}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-lg text-spotify-white font-medium pt-4">Nama Artist</p>
                  <p className="text-md text-spotify-white font-normal pt-1 opacity-75">Artist</p>
                </div>
                <div className="w-1/5">
                  {imageUrl ? (
                    <div className="avatar shadow">
                      <div className="w-32 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder shadow">
                      <div className="bg-neutral text-neutral-content w-32 rounded-full">
                        <span className="text-xl">{"judul lagu"}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-lg text-spotify-white font-medium pt-4">Nama Artist</p>
                  <p className="text-md text-spotify-white font-normal pt-1 opacity-75">Artist</p>
                </div>
                <div className="w-1/5">
                  {imageUrl ? (
                    <div className="avatar shadow">
                      <div className="w-32 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder shadow">
                      <div className="bg-neutral text-neutral-content w-32 rounded-full">
                        <span className="text-xl">{"judul lagu"}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-lg text-spotify-white font-medium pt-4">Nama Artist</p>
                  <p className="text-md text-spotify-white font-normal pt-1 opacity-75">Artist</p>
                </div>
                <div className="w-1/5">
                  {imageUrl ? (
                    <div className="avatar shadow">
                      <div className="w-32 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder shadow">
                      <div className="bg-neutral text-neutral-content w-32 rounded-full">
                        <span className="text-xl">{"judul lagu"}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-lg text-spotify-white font-medium pt-4">Nama Artist</p>
                  <p className="text-md text-spotify-white font-normal pt-1 opacity-75">Artist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

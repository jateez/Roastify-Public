import { useEffect, useState } from "react";
import instance from "../config/instance";
import { toast } from "react-toastify";

export default function CustomRoast() {
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [results, setResults] = useState([]);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [type, setType] = useState("artist%2Ctrack");
  const [error, setError] = useState(null);
  const [showRoast, setShowRoast] = useState(false);

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
        if (type) {
        }
        setArtists(data.artists.items);
        setTracks(data.tracks.items);
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
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [search, type]);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };
  const handleItemClick = (item) => {
    const isItemSelected = selectedItems.some((i) => i.id === item.id);
    if (isItemSelected) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const handleRoastClick = async () => {
    try {
      setIsLoading(true);
      const { data } = await instance({
        method: "post",
        url: "/custom-roast",
        data: {
          selectedItems: selectedItems,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setOutput(data.output);
      setSelectedItems([]);
      setShowRoast(true);
    } catch (error) {
      setIsLoading(false);
      if (error.message) {
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
      } else {
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
      }
    } finally {
      setIsLoading(false);
    }
  };
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
            <button className="btn sm:btn-sm md:btn-md bg-spotify-green hover:bg-spotify-light-green text-spotify-black" onClick={handleRoastClick}>
              Roast
            </button>
          </div>
          {showRoast && (
            <div className="w-full max-w-2xl mt-8 p-6 bg-spotify-dark-gray rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-spotify-white mb-4">Your Roast</h3>
              <p className="text-gray-300">{output}</p>
              <button className="mt-4 btn btn-sm btn-outline btn-success" onClick={() => setShowRoast(false)}>
                Close
              </button>
            </div>
          )}

          <div className="divider divider-lg pt-10"></div>
          <div className="flex w-full pt-10 px-10 shadow-md justify-evenly h-96">
            {tracks.length > 0 && (
              <>
                <div className={`w-1/2 h-fit hover:bg-spotify-dark-gray hover:opacity-70 ${selectedItems.some((i) => i.id === tracks[0].id) ? "border-b border-spotify-light-green" : ""}`} onClick={() => handleItemClick(tracks[0])}>
                  <span className="text-md md:text-2xl text-spotify-white font-medium">Top Result</span>
                  <div className="p-5 w-full h-full flex flex-col gap-y-2">
                    {tracks[0].album.images[0].url ? (
                      <div className="avatar">
                        <div className="w-32 rounded-xl">
                          <img src={tracks[0].album.images[0].url} />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-32 rounded-xl">
                          <span className="text-xl">{tracks[0].album.name[0]}</span>
                        </div>
                      </div>
                    )}
                    <p className="text-lg text-spotify-white font-medium pt-4">{tracks[0].album.name}</p>
                    <div className="flex">
                      <p className="text-md text-spotify-white font-light">
                        {tracks[0].album.album_type} <span className="font-normal">{tracks[0].artists[0].name}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-fit">
                  <span className="text-md md:text-2xl text-spotify-white font-medium">Songs</span>
                  <div className="p-5 w-full h-1/4 flex flex-col gap-y-2 ">
                    {tracks.length > 0 &&
                      tracks.map((track, i) => {
                        if (i !== 0) {
                          return (
                            <div key={track.id} className={`flex w-full hover:bg-spotify-dark-gray ${selectedItems.some((i) => i.id === track.id) ? "border-r border-spotify-light-green" : ""}`} onClick={() => handleItemClick(track)}>
                              <div className="w-1/6">
                                {track.album.images[0].url ? (
                                  <div className="avatar">
                                    <div className="w-12 rounded-xl">
                                      <img src={track.album.images[0].url} />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-12 rounded-xl">
                                      <span className="text-xl">{track.album.name}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="w-4/6 flex flex-col justify-evenly">
                                <p className="font-medium">{track.album.name}</p>
                                <p className="font-light">{track.artists[0].name}</p>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex w-full pt-10 px-10 shadow-md justify-evenly h-96">
            <div className="w-full">
              {artists.length > 0 && (
                <>
                  <span className="text-md md:text-2xl text-spotify-white font-medium">Artists</span>
                  <div className="flex w-full pt-5 gap-x-3">
                    {artists.map((artist, i) => (
                      <div key={i + 1} className={`w-1/5 hover:bg-spotify-dark-gray ${selectedItems.some((i) => i.id === artist.id) ? "border-b border-spotify-light-green" : ""}`} onClick={() => handleItemClick(artist)}>
                        {artist.images[0].url ? (
                          <div className="avatar shadow">
                            <div className="w-32 rounded-full">
                              <img src={artist.images[0].url} />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder shadow">
                            <div className="bg-neutral text-neutral-content w-32 rounded-full">
                              <span className="text-xl">{artist.name}</span>
                            </div>
                          </div>
                        )}
                        <p className="text-lg text-spotify-white font-medium pt-4">{artist.name}</p>
                        <p className="text-md text-spotify-white font-normal pt-1 opacity-75">{artist.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

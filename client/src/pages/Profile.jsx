import { Link, useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import instance from "../config/instance";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistories } from "../redux/app/historySlice";
import { toast } from "react-toastify";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState("");
  const [fullName, setFullName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [email, setEmail] = useState("");
  const [spotifyId, setSpotifyId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const histories = useSelector((state) => state.history.value);
  const loadingHistory = useSelector((state) => state.history.loading);

  function rowHandler(id) {
    navigate(`/histories/${id}`);
  }

  async function uploadImage(e) {
    try {
      setIsLoading(true);
      setImageFile(e.target.files[0]);
      console.log(e.target.files[0]);
      let formData = new FormData();
      formData.append("image", imageFile);
      await instance({
        method: "patch",
        url: "/profile",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: formData,
      });
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

      setIsLoading(false);
    } finally {
      setIsLoading(false);
      fetchData();
    }
  }

  async function fetchData() {
    try {
      const data = (
        await instance({
          method: "get",
          url: "/profile",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
      ).data.profile;
      setProfile(data);
      setEmail(data.email);
      setFullName(data.fullName);
      setImageUrl(data.imageUrl);
      setSpotifyId(data.spotifyId);
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
    fetchData();
    dispatch(fetchHistories());
  }, []);

  if (isLoading || loadingHistory) {
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
      <div className="flex flex-col items-center justify-center h-screen gap-y-5 mx-40">
        <p className="text-xl md:text-4xl font-medium text-spotify-white pb-10">Profile</p>
        <div className="w-full flex gap-x-20">
          <div className="w-1/3 h-full flex flex-col items-center justify-center gap-y-5">
            <Avatar fullName={fullName} imageUrl={imageUrl} />
            <h1 className="text-md font-medium text-center">{fullName}</h1>
            <h2 className="text-md font-medium text-center">{email}</h2>
            <h3 className="text-sm lg:text-md font-medium text-center">
              {"Spotify Account Linked: "} <span className="text-spotify-green font-semibold">{spotifyId ? "Yes" : "No"}</span>
            </h3>
            <label htmlFor="imageButton" className="btn sm:btn-sm md:btn-md bg-spotify-green hover:bg-spotify-light-green text-spotify-off-white">
              Update Profile Image
            </label>
            <input id="imageButton" type="file" className="hidden" onChange={(e) => uploadImage(e)} />
            <Link to={"/logout"} className="btn sm:btn-sm md:btn-md btn-outline btn-error w-40">
              Logout
            </Link>
          </div>
          <div className="divider divider-horizontal divider-success opacity-70"></div>
          <div className="w-2/3 max-h-full">
            <h2 className="text-2xl font-bold mb-4">Roast History</h2>
            <div className="overflow-y-auto w-full h-[24rem]">
              {histories.length > 0 && (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-spotify-green opacity-70">No</th>
                      <th className="hidden lg:table-cell text-spotify-green opacity-70">Roast Type</th>
                      <th className="text-spotify-green opacity-70">Roast Data</th>
                      <th className="hidden lg:table-cell text-spotify-green opacity-70">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {histories.map((history, index) => (
                      <tr key={history.id} className="hover" onClick={() => rowHandler(history.id)}>
                        <td>{index + 1}</td>
                        <td className="hidden lg:table-cell">{history.roastType}</td>
                        <td className="truncate max-w-xs">{history.roastData}</td>
                        <td className="hidden lg:table-cell">{new Date(history.createdAt).toLocaleString().split(",")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

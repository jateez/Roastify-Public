import { Link, useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import instance from "../config/instance";

export default function Profile() {
  const navigate = useNavigate();
  const historyData = [
    {
      id: 1,
      roastType: "spotify_account",
      roastData: "Lo ya, musik lo itu ibarat popcorn di bioskop, banyak orang suka tapi ga ada isi yang berharga...",
      createdAt: "2024-08-07T22:18:02.632Z",
    },
    {
      id: 2,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
    {
      id: 3,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
    {
      id: 4,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
    {
      id: 5,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
    {
      id: 6,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
    {
      id: 7,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
    {
      id: 8,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
    {
      id: 9,
      roastType: "custom_roast",
      roastData: "Musik lo kayak paket komplit di restoran fast food, ada semuanya tapi ga ada yang spesial...",
      createdAt: "2024-07-15T18:30:22.111Z",
    },
  ];
  function rowHandler(id) {
    navigate("");
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-y-5 mx-40">
        <p className="text-xl md:text-4xl font-medium text-spotify-white pb-10">Profile</p>
        <div className="w-full flex gap-x-20">
          <div className="w-1/3 h-full flex flex-col items-center justify-center gap-y-5">
            <Avatar fullName={"Arya"} />
            <h1 className="text-md font-medium text-center">{"User"}</h1>
            <h2 className="text-md font-medium text-center">{"Email"}</h2>
            <h3 className="text-sm lg:text-md font-medium text-center">
              {"Spotify Account Linked: "} <span className="text-spotify-green font-semibold">{"Yes"}</span>
            </h3>
            <label htmlFor="imageFile" className="btn sm:btn-sm md:btn-md bg-spotify-green hover:bg-spotify-light-green text-spotify-off-white">
              Upload Image Profile
            </label>
            <input id="imageFile" type="file" className="hidden" />
          </div>
          <div className="divider divider-horizontal divider-success opacity-70"></div>
          <div className="w-2/3 max-h-full">
            <h2 className="text-2xl font-bold mb-4">Roast History</h2>
            <div className="overflow-y-auto w-full h-[24rem]">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th className="text-spotify-green opacity-70">ID</th>
                    <th className="hidden lg:table-cell text-spotify-green opacity-70">Roast Type</th>
                    <th className="text-spotify-green opacity-70">Roast Data</th>
                    <th className="hidden lg:table-cell text-spotify-green opacity-70">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((history) => (
                    <tr key={history.id} className="hover" onClick={() => rowHandler(id)}>
                      <td>{history.id}</td>
                      <td className="hidden lg:table-cell">{history.roastType}</td>
                      <td className="truncate max-w-xs">{history.roastData}</td>
                      <td className="hidden lg:table-cell ">{new Date(history.createdAt).toLocaleString().split(",")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

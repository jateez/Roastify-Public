import { useEffect, useState } from "react";

export default function Histories() {
  const [isLoading, setIsLoading] = useState(false);
  const [histories, setHistories] = useState([]);

  async function fetchHistories() {
    try {
      setIsLoading(true);
      const response = await instance({
        method: "get",
        url: "/roasts",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setHistories(response.data.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHistories();
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
      <p>{JSON.stringify(histories)}</p>
      <div className="flex flex-col items-center justify-center h-screen w-full mx-auto gap-y-5">
        <div className="overflow-x-auto w-full">
          {histories.length > 0 && (
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-spotify-green opacity-70">ID</th>
                  <th className="hidden lg:table-cell text-spotify-green opacity-70">Roast Type</th>
                  <th className="text-spotify-green opacity-70">Roast Data</th>
                  <th className="hidden lg:table-cell text-spotify-green opacity-70">Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {histories.map((history) => (
                  <tr key={history.id} className="hover" onClick={() => rowHandler(history.id)}>
                    <td>{history.id}</td>
                    <td className="hidden lg:table-cell">{history.roastType}</td>
                    <td className="truncate max-w-xs">{history.roastData}</td>
                    <td className="hidden lg:table-cell">{new Date(history.createdAt).toLocaleString().split(",")[0]}</td>
                    <td className="gap-x-5">
                      <button className="btn btn-ghost btn-xs">details</button>
                      <button className="btn btn-ghost btn-xs">delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

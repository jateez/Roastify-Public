import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteHistory, fetchHistories } from "../redux/app/historySlice";
import { toast } from "react-toastify";

export default function Histories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const histories = useSelector((state) => state.history.value);
  const isLoading = useSelector((state) => state.history.loading);

  function deleteHandler(e, id) {
    e.preventDefault();
    dispatch(deleteHistory(id));
  }

  useEffect(() => {
    dispatch(fetchHistories());
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
      <div className="flex flex-col items-center justify-center h-screen w-full mx-auto gap-y-5">
        <h1 className="text-2xl font-bold mb-4">Roast History</h1>
        <div className="overflow-y-auto w-full px-10 pb-10 h-[80%]">
          {histories.length > 0 && (
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-spotify-green opacity-70">No</th>
                  <th className="hidden lg:table-cell text-spotify-green opacity-70">Roast Type</th>
                  <th className="text-spotify-green opacity-70">Roast Data</th>
                  <th className="hidden lg:table-cell text-spotify-green opacity-70">Date</th>
                  <th className="hidden lg:table-cell text-spotify-green opacity-70 w-36 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {histories.map((history, index) => (
                  <tr key={history.id} className="hover">
                    <td>{index + 1}</td>
                    <td className="hidden lg:table-cell">{history.roastType}</td>
                    <td className="truncate max-w-xs">{history.roastData}</td>
                    <td className="hidden lg:table-cell">{new Date(history.createdAt).toLocaleString().split(",")[0]}</td>
                    <td className="gap-x-5 w-36">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/histories/${history.id}`);
                        }}
                      >
                        details
                      </button>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={(e) => {
                          deleteHandler(e, history.id);
                        }}
                      >
                        delete
                      </button>
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

export default function Histories() {
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
  ];
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-full mx-auto gap-y-5">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>ID</th>
                <th>Roast Type</th>
                <th>Roast Data</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((history) => (
                <tr key={history.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>{history.id}</td>
                  <td>{history.roastType}</td>
                  <td className="truncate max-w-xs">{history.roastData}</td>
                  <td>{new Date(history.createdAt).toLocaleString()}</td>
                  <td className="gap-x-5">
                    <button className="btn btn-ghost btn-xs">details</button>
                    <button className="btn btn-ghost btn-xs">delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Roast Type</th>
                <th>Roast Data</th>
                <th>Date</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

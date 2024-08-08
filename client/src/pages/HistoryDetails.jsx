export default function HistoryDetails() {
  const history = {
    output: {
      id: 1,
      UserId: null,
      roastType: "spotify_account",
      roastData:
        "Lo ya, musik lo itu ibarat popcorn di bioskop, banyak orang suka tapi ga ada isi yang berharga. Kalo lo masih nge-fans sama TWICE yang followers-nya lebih banyak dari penduduk beberapa negara tapi tetep kalah sama Taylor Swift, ya wajar sih, karena lo emang lebih suka tawa daripada musik berkualitas. Dan aespa? Gak usah dibandingkan deh, kayak band rock indie ketemu girl group K-Pop, kalah jauh! Lo pasti menikmati segala sesuatu yang bisa dipikirin pakai emoji. Plus, lagu 'FANCY' lo itu fancy banget buat di skip, bro. Jangan-jangan lo cuman dengerin ini buat vibes di TikTok doang, kan",
      tracks: [
        {
          name: "Espresso",
          album: {
            name: "Espresso",
            total_track: 1,
            release_data: "2024-04-12",
          },
          artists: "Sabrina Carpenter",
          explicit: true,
          popularity: 98,
        },
        {
          name: "Hold On Tight",
          album: {
            name: "Hold On Tight",
            total_track: 1,
            release_data: "2023-03-30",
          },
          artists: "aespa",
          explicit: false,
          popularity: 70,
        },
        {
          name: "You Were Beautiful",
          album: {
            name: "SUNRISE",
            total_track: 14,
            release_data: "2017-06-07",
          },
          artists: "DAY6",
          explicit: false,
          popularity: 63,
        },
        {
          name: "Armageddon",
          album: {
            name: "Armageddon - The 1st Album",
            total_track: 10,
            release_data: "2024-05-27",
          },
          artists: "aespa",
          explicit: false,
          popularity: 78,
        },
        {
          name: "With",
          album: {
            name: "Twenty-Five Twenty-One OST",
            total_track: 43,
            release_data: "2022-04-03",
          },
          artists: "Kim Taeri, Nam Joohyuk, Bona(WJSN), Choi Hyunwook, Lee Joomyung",
          explicit: false,
          popularity: 59,
        },
      ],
      artists: [
        {
          name: "TWICE",
          genres: "k-pop, k-pop girl group, pop",
          total_followers: 20477565,
          popularity_score: 79,
        },
        {
          name: "aespa",
          genres: "k-pop girl group",
          total_followers: 6021364,
          popularity_score: 80,
        },
        {
          name: "NewJeans",
          genres: "k-pop, k-pop girl group",
          total_followers: 8621656,
          popularity_score: 82,
        },
        {
          name: "Taylor Swift",
          genres: "pop",
          total_followers: 117189999,
          popularity_score: 100,
        },
        {
          name: "YOASOBI",
          genres: "j-pop, japanese teen pop",
          total_followers: 8078920,
          popularity_score: 75,
        },
      ],
      updatedAt: "2024-08-07T22:18:02.632Z",
      createdAt: "2024-08-07T22:18:02.632Z",
    },
  };

  const { roastType, roastData, tracks, artists, createdAt } = history.output;

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto gap-y-5 p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Roast History</h2>
        <div className="card w-full bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <h3 className="card-title">Roast Type: {roastType}</h3>
            <p className="text-gray-500">{new Date(createdAt).toLocaleString()}</p>
            <p className="mt-2">{roastData}</p>
            <div className="divider"></div>

            <div>
              <h4 className="text-xl font-semibold">Tracks:</h4>
              <ul className="list-disc list-inside">
                {tracks.map((track, index) => (
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
                {artists.map((artist, index) => (
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
  );
}

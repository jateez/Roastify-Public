import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen gap-y-5">
        <div className="text-2xl md:text-4xl text-spotify-white">
          Welcome to <span className="font-bold text-spotify-green">Roastify</span>!
        </div>
        <Link to={"/register"}>
          <div className="btn btn-md md:btn-lg bg-spotify-green text-spotify-white hover:text-spotify-green hover:bg-spotify-white w-44">Register Now</div>
        </Link>
        <Link to={"/login"}>
          <div className="btn btn-md md:btn-lg outline outline-1 outline-spotify-green bg-transparent  text-spotify-white hover:text-spotify-green hover:bg-spotify-white w-44">Login</div>
        </Link>
      </div>
    </>
  );
}

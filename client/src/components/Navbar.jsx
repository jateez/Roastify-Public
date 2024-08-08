import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-base-300 w-full fixed top-0 left-0 z-50 h-16">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="mx-2 flex-1 px-2">
        <Link to={"/"}>
          <span className="text-lg md:text-2xl text-spotify-green font-semibold hover:bg-spotify-light-green hover:text-spotify-dark-gray btn btn-ghost">Roastify</span>
        </Link>
      </div>
      <div className="hidden lg:flex flex-none">
        <ul className="menu menu-horizontal">
          <li>
            <Link to={"/histories"}>Histories</Link>
          </li>
          <li>
            <Link to={"/users"}>Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

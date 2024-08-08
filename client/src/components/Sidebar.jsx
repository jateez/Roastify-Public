import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <li>
            <div className="h-1/4">Profile</div>
          </li>
          <li>
            <Link to={"/histories"}>Histories</Link>
          </li>
          <li>
            <Link to={"/logout"}>Logout</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

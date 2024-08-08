import { useEffect, useState } from "react";
import instance from "../config/instance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  async function handleLogin(e) {
    try {
      e.preventDefault();
      const { data } = await instance({
        method: "post",
        url: "/login",
        data: {
          email,
          password,
        },
      });
      localStorage.setItem("access_token", data.access_token);
      navigation("/");
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
    async function handleCredentialResponse(response) {
      try {
        const { data } = await instance({
          method: "post",
          url: "/google-login",
          headers: {
            google_token: response.credential,
          },
        });
        localStorage.setItem("access_token", data.access_token);
        navigation("/");
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
    google.accounts.id.initialize({
      client_id: "263573458748-vts77pkujo5394a5egf867qje5ke4bcj.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(document.getElementById("buttonDiv"), { theme: "outline", size: "large" });
    // google.accounts.id.prompt(); // also display the One Tap dialog
  }, []);
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-y-5">
      <h1 className="text-2xl md:text-4xl text-spotify-green md:font-semibold">Login</h1>
      <div className="card w-96">
        <div className="card-body flex flex-col items-center justify-center w-full">
          <div className="w-full">
            <label htmlFor="email">Email Address</label>
            <input type="email" placeholder="johndoe@mail.com" className="input input-bordered w-full" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="w-full">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="*****" className="input input-bordered w-full" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="w-full my-5">
            <button className="btn w-full bg-spotify-green hover:bg-spotify-white text-spotify-white hover:text-spotify-green" onClick={handleLogin}>
              Login
            </button>
          </div>
          <div className="card-actions w-full flex justify-center">
            <h2 className="text-spotify-white divider">Or Sign Up via Google</h2>
            <div id="buttonDiv" className="rounded bg-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

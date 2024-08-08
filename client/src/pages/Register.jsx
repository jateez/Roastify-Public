import { useEffect, useState } from "react";
import axios from "../config/instance";
import instance from "../config/instance";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();
  async function handleRegister(e) {
    try {
      e.preventDefault();
      await instance({
        method: "post",
        url: "/register",
        data: {
          fullName,
          email,
          password,
        },
      });
      navigation("/login");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      try {
        const { data } = (
          await axios({
            method: "post",
            url: "/google-login",
            headers: {
              google_token: response.credential,
            },
          })
        ).data;
        console.log(data);
        localStorage.setItem("access_token", data.access_token);
      } catch (error) {
        console.log(error);
      }
    }
    google.accounts.id.initialize({
      client_id: "263573458748-vts77pkujo5394a5egf867qje5ke4bcj.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
    // google.accounts.id.prompt(); // also display the One Tap dialog
  }, []);
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-y-5">
      <h1 className="text-2xl md:text-4xl text-spotify-green md:font-semibold">Register</h1>
      <div className="card w-96">
        <div className="card-body flex flex-col items-center justify-center w-full">
          <div className="w-full">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" placeholder="John Doe" className="input input-bordered w-full" onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="w-full">
            <label htmlFor="email">Email Address</label>
            <input type="email" placeholder="johndoe@mail.com" className="input input-bordered w-full" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="w-full">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="*****" className="input input-bordered w-full" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="w-full my-5">
            <button className="btn w-full bg-spotify-green hover:bg-spotify-white text-spotify-white hover:text-spotify-green" onClick={handleRegister}>
              Register
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

import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
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
    <div className="container flex justify-center items-center content-center h-screen w-screen">
      <div id="buttonDiv"></div>
    </div>
  );
}

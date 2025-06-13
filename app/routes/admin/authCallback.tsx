import { account } from "@/auth/client";
import { useEffect } from "react";
import { redirect, useNavigate } from "react-router";


const AuthCallback = () => {
  const navigate = useNavigate();



  useEffect(() => {
    (async () => {
      const params = new URLSearchParams;
      const user = params.get("user")
      try {
        console.log("Auth callback started...",await account.get());
        const user = await account.get(); 
        console.log("User details fetched:", user);

        // Store user ID in localStorage or handle post-login tasks
        localStorage.setItem("userId", user.$id);
        navigate("/"); // Redirect to home or desired route
      } catch (error) {
        console.error("Error during OAuth callback:", error);

        // Redirect to sign-in page with error query parameter
        navigate("/sign-in?error=auth_failed");
      }
    })();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Completing sign-in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

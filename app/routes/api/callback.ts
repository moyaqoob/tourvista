import { getGoogleUserDetails, storeUserData } from "@/auth/auth";
import { account } from "@/auth/client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function Callback() {
    const navigate = useNavigate();

    useEffect(() => {
        async function createSession() {
            try {
                // Access URL parameters
                const params = new URLSearchParams(window.location.search);
                const userId = params.get("userId") || "";
                const secret = params.get("secret") || "";

                // Store in localStorage only if values exist
                if (userId && secret) {
                    localStorage.setItem("userId", userId);
                    localStorage.setItem("secret", secret);
                }

                // Retrieve from localStorage
                const storedUserId = localStorage.getItem("userId");
                const storedSecret = localStorage.getItem("secret");
                console.log(storedUserId, "user", storedSecret, "secret");

                // Logic for session creation (if needed, add API calls here)
                if (storedUserId && storedSecret) {
                    await account.createSession(storedUserId,storedSecret)
                    await storeUserData()
                    console.log("session created baby less goo")
                    navigate("/")
                } else {
                    throw new Error("Invalid session details");
                }

                // const session = await account.getSession("current");
                // const accesstoken = session?.providerAccessToken;
                // if(!accesstoken){
                //     await account.create
                // }
                // const data =await getGoogleUserDetails(secret);

            } catch (err) {
                console.error("Error creating a session:", err);
                navigate("/sign-in");
            }
        }

        createSession();
    }, [navigate,1000]);

    return "<p>Redirecting...</p>"
}

export default Callback;

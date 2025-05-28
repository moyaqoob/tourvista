import { account } from "@/auth/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export async function clientLoader() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId") || null;
  const secret = params.get("secret") || null;

  if (userId && secret) {
    localStorage.setItem("userId", userId);
    localStorage.setItem("secret", secret);
  }
}


export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const secret = localStorage.getItem("secret");  
      console.log(userId)
      if (!userId || !secret) {
        navigate("/sign-in");
        return;
      }

      try {
        await account.createSession(userId, secret);
        const user = await account.get();
        setName(user.name);

        if (!user.$id) {
          navigate("/sign-in");
        }
      } catch (err) {
        setError("Authentication failed. Please sign in again.");
        console.error("Error during authentication", err);
        navigate("/sign-in");
      } finally {
        setLoading(false);
      }
    }

     checkSession();
  }, [1]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-2xl flex flex-col items-center bg-red-500 text-center">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      Welcome {name}
      
    </div>
  );
}

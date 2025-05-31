import { account } from "@/auth/client";
import { useEffect, useState } from "react";
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
      const userId = localStorage.getItem("userId");
      const secret = localStorage.getItem("secret");

      if (!userId || !secret) {
        navigate("/sign-in");
        return;
      }

      try {
        await account.createSession(userId,secret) // Session is created only if it doesn't exist
        console.log("hi")
        const user = await account.get();
        console.log("bye")
        if (user?.$id) {
          setName(user.name);

        } else {
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
  }, [navigate]);

  async function deleteSession() {
    try {
      await account.deleteSession("current");
      localStorage.removeItem("userId");
      localStorage.removeItem("secret");
      navigate("/sign-in");
    } catch (err) {
      console.error("Error during logout", err);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome {name || "Guest"}!</h1>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
      )}
      <button
        onClick={deleteSession}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

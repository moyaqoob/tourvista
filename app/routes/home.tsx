import { account } from "@/auth/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { redirect, useNavigate } from "react-router";

function Home() {
    const [name, setName] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await account.get();
                if (!user.$id) {
                    navigate("/sign-in"); 
                } else {
                    setName(user.name); 
                }
                const data = await fetch('api/create-trip')
                console.log(data)
            } catch (e) {
                console.error("Error fetching the user account details:", e);
                navigate("/sign-in"); 
            }
        }

        fetchUser();
    }, [navigate]);

    if (name === null) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            Welcome, {name}!
        </div>
    );
}

export default Home;
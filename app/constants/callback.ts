import { account } from "@/auth/client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";


function Callback(){
    const navigate = useNavigate();

    useEffect(()=>{
        async function createSession(){
            try{
                const session = await account.getSession("current");
                console.log("Session created success",session)
                navigate("/dashboard")
            }
            catch(err){
                navigate("/sign-in")
                console.log("error creating a session")
            }
        }
        createSession();
    },[navigate]);

    return "<p>Redirecting...</p>"
}


export default Callback;
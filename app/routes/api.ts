import { account } from "@/auth/client";

async function GET(request:string) {
  try {
    // Verify user session
    const user = await account.get(); // Ensure 'account' is correctly set up
    console.log("Authenticated user: ", user);

    if (!user?.$id) {
      // User is not logged in, return 401 Unauthorized
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return user data
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized or error occurred" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default GET
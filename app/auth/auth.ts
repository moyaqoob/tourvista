import { ID, OAuthProvider, Query } from "appwrite";
import { redirect } from "react-router";
import { account, appwriteConfig, database } from "./client";

//login with google
export async function loginWithgoogle() {
  try {
    console.log("Starting Google OAuth login");
    
    // Create OAuth2 session
     account.createOAuth2Token(
      OAuthProvider.Google,
      `${window.location.origin}/auth/callback/`, // Callback URL
      `${window.location.origin}/sign-in` // Failure URL
    );
    
  } catch (error: any) {
    if (error?.message?.includes("Rate limit")) {
      console.error("Rate limit exceeded. Please wait and try again.");
      alert("Too many requests. Please wait before trying again.");
    } else {
      console.error("Error logging in with Google:", error);
      alert("Login failed. Please try again.");
    }
  }
}

//logout fuction
export async function logout() {
  const user = account.get()
  try {
    await account.deleteSession((await user).$id);
  } catch {
    console.log("error ");
  }
}
export async function getUser() {
  try {
    const user = account.get();

    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userscollection,
      [
        Query.equal("accountId", (await user).$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );

    if (documents.length > 0) {
      return documents[0];
    } else {
      return null;
    }
  } catch {
    console.log("error getting user");
  }
}

export async function getGoogleUserDetails(accessToken:string) {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=emailAddresses,photos",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch user details: ${response.status}`);
    }
    const data = await response.json();
    const email = data?.emailAddresses?.[0]?.value || null;
    const picture = data?.photos?.[0]?.url || null;

    return { email, picture };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}


//store or recreate incase the user is not in the user database
export async function storeUserData() {
  try {
    const user = await account.get(); // Await here

    if (!user) throw new Error("User not found");

    const existingUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userscollection,
      [Query.equal("accountId", user.$id)]
    );

    if (existingUser.total > 0) {
      return existingUser.documents[0];
    }

    const session = await account.getSession("current");
    console.log("session",session) // Await here
    const providerAccessToken = session?.providerAccessToken;

    let profilePicture = null;
    if (providerAccessToken) {
      profilePicture = await getGoogleUserDetails(providerAccessToken);
    }

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userscollection,
      ID.unique(),
      {
        accountId: user.$id,
        name: user.name,
        email: user.email,
        imageUrl: profilePicture || " " ,
        joinedAt: new Date().toISOString(),
        status: 'user'
      }
    );

    if (!createdUser.$id) redirect("/sign-in");

    return createdUser;
  } catch (e) {
    console.log("error storing the data", e);
  }
}

//get existing user
export async function getExistingUser(id: string) {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userscollection,
      [Query.equal("accountId", id)]
    );

    return total > 0 ? documents[0] : null;
  } catch {
    console.log("error fetching the existing user");
  }
}

export const getAllUsers = async(limit:number,offset:number)=>{
  try{

    const {documents:users,total} =await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userscollection,
      [Query.limit(limit),Query.offset(offset)]
    );

    if(total == 0) return {users:[],total}

    return {users,total}

  }catch(e){
    console.log("error occured while fetching users")
    return {users:[],total:0}
  }
}

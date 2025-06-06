import { ID, OAuthProvider, Query } from "appwrite";
import { redirect } from "react-router";
import { account, appwriteConfig, database } from "./client";
import { user } from "@/constants/constants";

export function loginWithgoogle() {
  try {
      account.createOAuth2Token(OAuthProvider.Google,
        `${window.location.origin}/`,
        `${window.location.origin}/404`
      );
  } catch {
    console.log("error login in with google");
  }
}





export async function logout() {
  try {
    await account.deleteSession("current");
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
export async function getGooglePicture(accessToken: string) {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response,"response")
    if (!response.ok) {
      console.log("Failed to fetch profile picture from Google API");
      return null;
    }
    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch {
    console.log("error fetching the google picture");
  }
}
export async function storeUserData() {
  try {
    const user = account.get();

    if (!user) throw new Error("User not found");

    const existingUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userscollection,
      [Query.equal("accountId", (await user).$id)]
    );

    if (existingUser.total > 0) {
      return existingUser.documents[0];
    }

    const { providerAccessToken } = await account.getSession("current");
    console.log(providerAccessToken)
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userscollection,
      ID.unique(),
      {
        accountId: (await user).$id,
        name: (await user).name,
        email: (await user).email,
        imageUrl: profilePicture || " ",
        joinedAt: new Date().toISOString(),
        status : 'user'
      }
    );

    if (!createdUser.$id) redirect("/sign-in");

    return createdUser;
  } catch {
    console.log("error storing the data");
  }
}


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

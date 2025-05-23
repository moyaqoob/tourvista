import { error } from "console";
import { account, appwriteConfig, database } from "./client";
import { OAuthProvider, Query,ID } from "appwrite";

export async function loginWithgoogle(){
    try{
        await account.createOAuth2Session(
            OAuthProvider.Google
        )
    }catch{
        console.log('e')
    }
}
export async function logout(){
    try{
       await account.deleteSession("current")
    }catch{
        console.log('e')
    }
}
export async function getUser(){
    try{
        const user = account.get();

        if(!user) return;
        
        const{documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userscollection,
            [
                Query.equal("accountId",(await user).$id),
                Query.select(["name","email","imageUrl","joinedAt","accountId"])
            ]
        )
        
    }catch{
        console.log('e')
    }
}
export async function getGooglePicture(){
    try{
        const session = await account.getSession("current");

        const OAuthToken = session.providerAccessToken

        if(!session) return null;

        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            {
                headers: {
                    Authorization: `Bearer ${OAuthToken}`,
                },
            }
        );
        if (!response.ok) {
            console.log("Failed to fetch profile picture from Google API");
            return null;
        }
        const data = await response.json();
        const photoUrl = data.photos?.[0].url;
        return photoUrl;

    }catch{
        console.log('e')
    }
}
export async function storeUserData(){
    try{
        const user = account.get();

        if(!user) return;
        
        const{documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userscollection,
            [
                Query.equal("accountId",(await user).$id),
                Query.select(["name","email","imageUrl","joinedAt","accountId"])
            ]
        )
         if(documents.length>0) return documents[0];

         const imageUrl = getGooglePicture();

         const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userscollection,
            ID.unique() ,
            {
                accountId:(await user).$id,
                name:(await user).name,
                email:(await user).email,
                imageUrl:imageUrl || " ",
                joinedAt:new Date().toISOString()
            }
         )
        
    }catch{
        console.log('e')
    }
}
export async function getExistingUser(){
    try{
        const user = account.get();

        if(!user) return;
        
        const{documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userscollection,
            [
                Query.equal("accountId",(await user).$id),
                Query.select(["name","email","imageUrl","joinedAt","accountId"])
            ]
        )
        
        if(documents.length == 0) return null;

        return documents[0];
    }catch{
        console.log('e')
    }
}
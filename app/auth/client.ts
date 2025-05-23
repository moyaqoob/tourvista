import {Account, Client, Databases, Storage} from "appwrite";

const appwriteConfig = {
    projectId:process.env.APPWRITE_PROJECT_ID || " ",
    auth:process.env.APPWRITE_AUTH_KEY || "",
    api_secret:process.env.API_SECRET || "",
    databaseId:process.env.APPWRITE_DATABASE_ID || " ",
    userscollection:process.env.APPWRITE_USERS_COLLECTION || " ",
    tripsCollection:process.env.APPWRITE_TRIPS_COLLECTION || " ",
    endpointUrl:process.env.APPWRITE_URL || " "
}

const client = new Client() 
    .setEndpoint(appwriteConfig.endpointUrl ?? "")
    .setProject(appwriteConfig.projectId ?? "")


const account = new Account(client)
const database = new Databases(client)
const storage = new Storage(client)

export {account,database,storage,appwriteConfig};
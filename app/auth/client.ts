import { Account, Client, Databases, Storage } from "appwrite";
const appwriteConfig = {
  projectId: process.env.VITE_APPWRITE_PROJECT_ID || " ",
  auth: process.env.VITE_APPWRITE_AUTH_KEY || "",
  api_secret: process.env.VITE_API_SECRET || "",
  databaseId: process.env.VITE_APPWRITE_DATABASE_ID || " ",
  userscollection: process.env.VITE_APPWRITE_USERS_COLLECTION || " ",
  tripsCollection: process.env.VITE_APPWRITE_TRIPS_COLLECTION || " ",
  endpointUrl: process.env.VITE_APPWRITE_URL || "NOT found ",
  geminiKey: process.env.VITE_GEMINI_KEY,
  unsplashKey: process.env.VITE_UNSPLASH_KEY,
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);

const database = new Databases(client);
const storage = new Storage(client);

export { account, appwriteConfig, client, database, storage };

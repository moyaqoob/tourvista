import { Account, Client, Databases, Storage } from "appwrite";
const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || " ",
  auth: import.meta.env.VITE_APPWRITE_AUTH_KEY || "",
  api_secret: import.meta.env.VITE_API_SECRET || "",
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || " ",
  userscollection: import.meta.env.VITE_APPWRITE_USERS_COLLECTION || " ",
  tripsCollection: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION || " ",
  endpointUrl: import.meta.env.VITE_APPWRITE_URL || "NOT found ",
  geminiKey: import.meta.env.VITE_GEMINI_KEY,
  unsplashKey: import.meta.env.VITE_UNSPLASH_KEY,
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);

const database = new Databases(client);
const storage = new Storage(client);

export { account, appwriteConfig, client, database, storage };

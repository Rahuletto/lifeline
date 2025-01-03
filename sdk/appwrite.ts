import { Client, Databases } from "node-appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_ID ?? "")
  .setKey(process.env.NEXT_APPWRITE_KEY ?? "");

export const databases = new Databases(client);
export { ID } from "node-appwrite";

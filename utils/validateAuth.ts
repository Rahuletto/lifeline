import { NextRequest } from "next/server";
import { getIdFromJWT } from "./generateJWT";

export async function validateAuth(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }

    const user = await getIdFromJWT(token);
    if (!user) {
      throw new Error("Unauthorized");
    }

    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
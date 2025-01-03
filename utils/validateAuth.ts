import { AuthService } from "@/sdk/auth";
import { NextRequest } from "next/server";

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

const getIdFromJWT = async (token: string) => {
  const auth = new AuthService();

  try {
    await auth.sessionClient.setSession(token)
    const response = await auth.sessionAccount.get();
    return response?.targets[0].userId ?? "";
  } catch (err) {
    console.log(err)
    return null;
  }
};

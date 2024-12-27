import { account } from "@/sdk/appwrite";
import { generateJWT } from "@/utils/generateJWT";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    // Create email session and get complete session object
    const session = await account.createEmailPasswordSession(email, password);

    // Return full session object containing JWT and other details
    return NextResponse.json(
      {
        sessionId: session.$id,
        userId: session.userId,
        token: await generateJWT(session.userId), // JWT token
        expires: "10d",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid credentials",
        details: (error as Error).message,
      },
      { status: 401 }
    );
  }
}

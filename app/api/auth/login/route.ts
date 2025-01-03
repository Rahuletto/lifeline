import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/sdk/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const auth = new AuthService();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const session = await auth.login({email, password});

    return NextResponse.json(
      {
        ...session,
        sessionId: session.$id,
        userId: session.userId,
        token: session.secret, // JWT token
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

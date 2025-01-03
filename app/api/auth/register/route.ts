import { AuthService } from "@/sdk/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = new AuthService();
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Email, password, and name are required" },
      { status: 400 }
    );
  }

  try {
    const user = await auth.createAccount({ email, password, name });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

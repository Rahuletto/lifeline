import { AuthService } from "@/sdk/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "./Dashboard";

export default async function page() {
  const auth = new AuthService();

  const token = (await cookies()).get("session");
  await auth.sessionClient.setSession(token?.value ?? "");
  try {
    const user = await auth.sessionAccount.get();
    if (!user) redirect("/auth/login");
  } catch {
    redirect("/auth/login");
  }

  return (
    <main className="w-screen min-h-screen">
      <Dashboard />
    </main>
  );
}

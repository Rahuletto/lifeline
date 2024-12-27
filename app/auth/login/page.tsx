"use client";
import { useState } from "react";
import { account } from "@/sdk/appwrite";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (email: string, password: string) => {
    setError("");
    try {
      await account.createEmailPasswordSession(email, password);
      setLoggedInUser(await account.get());
    } catch (error) {
      setError((error as Error).message);
    }
  };

  //   const logout = async () => {
  //     await account.deleteSession("current");
  //     setLoggedInUser(null);
  //   };

  if (loggedInUser) router.push("/");

  return (
    <main className="flex items-center justify-center h-screen flex-col">
      <form className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 shadow-md flex items-center justify-center flex-col">
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={() => login(email, password)}>
          Login
        </button>
        <Link href="/auth/register">
          <p>Don&apos;t have an account? Register</p>
        </Link>
      </form>
    </main>
  );
};

export default LoginPage;

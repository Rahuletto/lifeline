"use client";
import { useState } from "react";
import { account, ID } from "@/sdk/appwrite";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const register = async () => {
    await account.create(ID.unique(), email, password, name);
    router.push("/auth/login");
  };

  //   const logout = async () => {
  //     await account.deleteSession("current");
  //     setLoggedInUser(null);
  //   };

  return (
    <main className="flex items-center justify-center h-screen flex-col">
      <form className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 shadow-md flex items-center justify-center flex-col">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        <button type="button" onClick={register}>
          Register
        </button>
        <Link href="/auth/login">
          <p>Already have an account? Login</p>
        </Link>
      </form>
    </main>
  );
};

export default LoginPage;

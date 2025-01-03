"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientAuth } from "@/sdk/auth";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = new ClientAuth();

  const login = async (email: string, password: string) => {
    setError("");
    try {
      const session = await auth.login({ email, password });
      if(session.error) {
        setError(session.error);
        return;
      }
      if (session.secret) {
        router.push("/dashboard");
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  //   const logout = async () => {
  //     await account.deleteSession("current");
  //     setLoggedInUser(null);
  //   };

  return (
    <main
      style={{ backgroundImage: "url('/bg.png')" }}
      className="bg-background flex items-center justify-center h-screen w-screen flex-col bg-center bg-no-repeat bg-cover bg-blend-screen relative"
    >
      <header className="flex z-10 fixed top-0 left-0 items-center justify-center w-full h-16 py-3">
        <div className="max-w-screen-lg flex items-center flex-row justify-between mx-auto w-full px-4 h-full">
          <h1 className="heading text-lg font-bold">Lifeline</h1>
          <div></div>
        </div>
      </header>
      <div className="absolute inset-0 bg-black/50"></div>
      <h1 className="text-3xl font-bold heading z-10">Welcome back!</h1>

      <form className="p-4 flex mt-3 gap-4 items-center justify-center flex-col z-10">
        {error && (
          <p className="text-red text-sm my-3 font-medium z-10">{error}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className={`${
            !email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
              ? "border-red"
              : "dark:border-white/15 border-black/15"
          } px-4 text-lg py-2 rounded-2xl border-2 transition-all duration-150 focus:outline-none focus:outline-0 focus:ring-red/20 focus:ring-1 bg-black/5 dark:bg-white/5 w-[300px] font-medium text-white`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passw*rd"
          className="px-4 text-lg dark:border-white/15 border-black/15 py-2 rounded-2xl border-2 transition-all duration-150 focus:outline-none focus:outline-0 focus:ring-red/20 focus:ring-1 bg-black/5 dark:bg-white/5 w-[300px] font-medium text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className=" transition-all duration-150 rounded-xl px-4 py-2 heading font-bold bg-red text-background flex items-center justify-center"
          type="button"
          onClick={() => login(email, password)}
        >
          Sign in
        </button>
        <p className="font-medium flex gap-2 mt-12 items-center justify-center z-10">
          <span className="opacity-60">New here?</span>
          <Link
            href="/auth/register"
            className="text-base font-bold flex items-center justify-center gap-1 rounded-xl text-red underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { ClientAuth } from "@/sdk/auth";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string>("");

  const auth = new ClientAuth();

  const register = async () => {
    try {
      const session = await auth.createAccount({ email, password, name });
      if(session.error) {
        setError(session.error);
        return;
      }
      if (session.secret) {
        router.push("/auth/login");
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    setError("");
  }, [name, email, password]);

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
      {stage === 0 ? (
        <h1 className="text-3xl font-bold heading z-10">Register</h1>
      ) : (
        <h1 className="text-2xl font-bold heading z-10">
          Hello! {name.split(" ")[0]}
        </h1>
      )}
      {error && (
        <p className="text-red text-sm my-3 font-medium z-10">{error}</p>
      )}
      <form className="p-4 flex mt-3 gap-4 items-center justify-center flex-col z-10">
        {stage === 1 ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className={`${
                !email ||
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
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

            <div className="flex gap-4 items-center justify-center">
              <button
                role="button"
                type="button"
                onClick={() => {
                  setStage(0);
                }}
                className="hover:w-12 transition-all duration-150 rounded-full w-10 h-10 bg-black/5 dark:bg-white/5 text-foreground border-2 border-black/20 dark:border-white/20 flex items-center justify-center"
              >
                <FaArrowLeftLong />
              </button>
              <button
                className=" transition-all duration-150 rounded-xl px-4 py-2 heading font-bold bg-red text-background flex items-center justify-center"
                type="button"
                onClick={register}
              >
                Register
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-2 items-center justify-center">
            <input
              type="text"
              placeholder="Name"
              className={`${
                !name || name.length < 3
                  ? "border-red"
                  : "dark:border-white/15 border-black/15"
              } px-4 text-lg py-2 rounded-2xl border-2 focus:w-[350px] transition-all duration-150 focus:outline-none focus:outline-0 focus:ring-red/20 focus:ring-1 bg-black/5 dark:bg-white/5 w-[300px] font-medium text-white`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              role="button"
              type="button"
              onClick={() => {
                if (name.length < 3) return setError("Name is too short");
                setStage(1);
              }}
              className="hover:w-12 transition-all duration-150 rounded-full w-10 h-10 bg-red text-background flex items-center justify-center"
            >
              <FaArrowRightLong />
            </button>
          </div>
        )}
        <p className="font-medium flex gap-2 mt-12 items-center justify-center z-10">
          <span className="opacity-60">Do I know you?</span>
          <Link
            href="/auth/login"
            className="text-base font-bold flex items-center justify-center gap-1 rounded-xl text-red underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;

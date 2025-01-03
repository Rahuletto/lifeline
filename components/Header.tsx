"use client";
import { ClientAuth } from "@/sdk/auth";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import { RiLoader3Line } from "react-icons/ri";

export default function Header() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );
  const [err, setErr] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
      const auth = new ClientAuth();
      const user = await auth.getCurrentUser();
      setUser(user);
      } catch {
        setErr(true)
      }
    };
    getUser();
  }, []);

  return (
    <>
      <header className="flex absolute top-0 left-0 items-center justify-center w-full h-16 py-3">
        <div className="max-w-screen-lg flex items-center flex-row justify-between mx-auto w-full px-4 h-full">
          <h1 className="heading text-lg font-bold">Lifeline</h1>
          {user && !err
            ? (
              <div className="relative">
                <button
                  className="flex items-center justify-center border border-black/30 dark:border-white/30 bg-black/10 dark:bg-white/10 w-10 h-10 font-semibold heading rounded-full"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user ? user.name.charAt(0).toUpperCase() : <RiLoader3Line className="animate-spin" />}
                </button>
                {user && dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-black/5 dark:bg-white/5">
                    <div className="p-4 border-b border-b-gray-600">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                    <Link href="/dashboard" className="w-full px-4 py-3 text-left heading font-medium text-white rounded-t-xl">
                        Dashboard
                      </Link>
                      <Link href="/settings" className="w-full px-4 py-3 text-left heading font-medium text-white rounded-t-xl">
                        Settings
                      </Link>
                      <button className="w-full px-4 py-3 text-left bg-red heading font-semibold text-black rounded-b-xl">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
            : err ? (
              <Link
                href="/auth/login"
                className="text-base font-bold px-4 py-1 flex items-center justify-center gap-1 rounded-xl bg-red text-background"
              >
                Sign In
              </Link>
            ) : <button
            className="flex items-center justify-center border border-black/30 dark:border-white/30 bg-black/10 dark:bg-white/10 w-10 h-10 font-semibold heading rounded-full"
            onClick={() => {}}
          >
            {user ? user.name.charAt(0).toUpperCase() : <RiLoader3Line className="animate-spin" />}
          </button>}
        </div>
      </header>
    </>
  );
}

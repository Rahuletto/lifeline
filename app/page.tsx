import Header from "@/components/Header";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
    <Header />

      <div className="h-[85vh] w-full flex items-center justify-center gap-2 flex-col">
        <div className="flex items-center justify-center gap-12 flex-col lg:flex-row">
          <FaHeart className="text-red text-6xl lg:text-8xl animate-pulse" />
          <div className="flex flex-col gap-3 items-center justify-center lg:items-start lg:justify-start">
            <span className="heading text-2xl lg:text-3xl font-bold text-center">
              From Emergencies to Everyday,
            </span>
            <span className="heading font-bold text-center text-3xl lg:text-5xl w-fit">
              We&apos;ve Got{" "}
              <span className="bg-red text-background px-3 rounded-2xl py-1">
                You.
              </span>
            </span>
          </div>
        </div>
        <p className="font-medium text-base opacity-30 mt-6 text-center max-w-lg">
          Hello! I am here to guide you through emergencies and everyday care.
          Whether it&apos;s finding a hospital, managing medications, or
          accessing your records, I&apos;ve got you. anytime, anywhere.
        </p>
        <div className="flex items-center justify-center gap-5 mt-8">
          <Link
            className="text-lg font-semibold px-4 py-1 flex items-center justify-center gap-1 rounded-xl border-2 dark:border-white/15 border-black/15"
            tabIndex={0}
            href="#features"
          >
            What do i do?
          </Link>
          <Link
            className="text-lg font-semibold px-4 py-1 flex items-center justify-center gap-1 rounded-xl bg-red text-background"
            tabIndex={0}
            href="/auth/register"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}

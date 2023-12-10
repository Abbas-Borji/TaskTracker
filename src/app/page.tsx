import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-6xl text-white">
      <h1>TaskTracker</h1>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/auth/login"
          type="button"
          className="mt-8 rounded bg-[#F5F5F5] px-6 py-2 text-center text-xl font-semibold text-[#1F2937] shadow-sm hover:bg-indigo-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          type="button"
          className="mt-8 rounded bg-indigo-500 px-6 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}

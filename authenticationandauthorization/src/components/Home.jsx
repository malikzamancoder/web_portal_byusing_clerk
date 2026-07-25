import { SignedIn, SignedOut, SignIn, UserButton, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <SignedOut>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-between items-center mb-6">
            <UserButton />
            <SignOutButton>
              <button className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition">
                Sign Out
              </button>
            </SignOutButton>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">Welcome!</h1>
          <p className="text-slate-400 mb-6">You're signed in successfully.</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
          >
            Go to Chatbot
          </Link>
        </div>
      </SignedIn>
    </div>
  );
}

export default Home;
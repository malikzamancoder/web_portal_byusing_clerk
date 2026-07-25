import { SignedIn, SignedOut, SignIn, useUser, UserButton, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
      <p className="text-white text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <SignedOut>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome!</h1>
              <p className="text-slate-400 text-sm">{user?.fullName}</p>
              <p className="text-slate-500 text-xs">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div className="flex items-center gap-3">
              <UserButton />
              <SignOutButton>
                <button className="px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium transition">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>

          <p className="text-slate-400 text-sm text-center mb-6">Select your role to continue</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition flex items-center justify-center gap-3"
            >
              🛡️ Admin
            </button>
            <button
              onClick={() => navigate("/teacher")}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-lg transition flex items-center justify-center gap-3"
            >
              👨‍🏫 Teacher
            </button>
            <button
              onClick={() => navigate("/student")}
              className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition flex items-center justify-center gap-3"
            >
              🎓 Student
            </button>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;
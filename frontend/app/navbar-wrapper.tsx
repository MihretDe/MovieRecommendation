"use client";

import { usePathname, useRouter } from "next/navigation";
import { Film, Home, LogOut, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Try to get email from localStorage (if stored in token)
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setEmail(payload.email || null);
      } catch {
        setEmail(null);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    router.replace("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between py-4 px-6 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg">
          <Film className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white tracking-tight">
            MovieRec
          </span>
          <span className="text-xs text-gray-400 -mt-1">
            Your Mood. Your Movie.
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </a>
        <a
          href="/favourites"
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          <Heart className="w-4 h-4" />
          Favorites
        </a>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-200 text-sm max-w-[160px] truncate">
            {email ?? "User"}
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sign Out</span>
        </Button>
      </div>
    </nav>
  );
}

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname === "/signin" || pathname === "/signup") return null;
  return <Navbar />;
}

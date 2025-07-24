"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Film, Home, LogOut, User, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchUserProfile } from "@/lib/feauters/user/userSlice";

function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user from redux state
  const { user, token } = useSelector((state: RootState) => state.user);
  console.log("User:", user);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    // Fetch user profile if not loaded but token exists
    if (!user && token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, token]);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    router.replace("/signin");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/favourites", label: "Favorites", icon: Heart },
  ];

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
          <span className="text-xs text-gray-400 -mt-1 hidden sm:block">
            Your Mood. Your Movie.
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </a>
          );
        })}
      </div>

      {/* Desktop User Info & Logout */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-200 text-sm max-w-[160px] truncate">
            {user?.name ?? user?.email ?? "User"}
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:block">Sign Out</span>
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        {/* Mobile User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>

        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 hover:text-white hover:bg-gray-800/50 p-2"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black border-l border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: isMobileMenuOpen ? "rgba(17,24,39,0.98)" : undefined, // Tailwind's gray-900 with opacity
        }}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight">
                MovieRec
              </span>
              <span className="text-xs text-gray-400 -mt-1">
                Your Mood. Your Movie.
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileMenu}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col bg-gray-800 border-gray-800 border ">
          {/* User Info Section */}
          <div className="p-6 border-b border-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white text-sm">
                  Welcome back!
                </span>
                <span className="text-gray-400 text-xs truncate max-w-[200px]">
                  {user?.name ?? user?.email ?? "User"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className="flex-1 py-6 border-t border-gray-900"
                key={item.href} // <-- add key here
              >
                <div className="space-y-2 px-6">
                  <a
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors duration-200 font-medium"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                </div>
              </div>
            );
          })}

          {/* Sign Out Button */}
          <div className="p-6 border-t border-gray-900">
            <button
              onClick={() => {
                handleSignOut();
                closeMobileMenu();
              }}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors duration-200 font-medium w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (pathname === "/signin" || pathname === "/signup") return null;

  return <Navbar />;
}

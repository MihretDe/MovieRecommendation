"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { email, password });
      setMsg(res.data.message || "Signup successful!");
      setIsError(false);
      setTimeout(() => {
        router.push("/signin");
      }, 1200); // Redirect after 1.2s so user can see the message
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        "Signup failed";
      setMsg(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm">
            Sign up to get personalized movie recommendations
          </p>
        </div>
        <form
          onSubmit={handleSignup}
          className="w-full flex flex-col space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        {msg && (
          <p
            className={`text-sm text-center px-2 py-1 rounded ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg}
          </p>
        )}
        <div className="text-sm text-gray-500 pt-2">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;

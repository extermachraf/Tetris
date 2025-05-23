"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInRequest, user } from "@/types/auth";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { IoAlert } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/userSlice";

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle authentication
    try {
      const signInData: SignInRequest = {
        email: formData.email,
        password: formData.password,
      };

      setLoading(true);
      const response = await api.post("auth/signin", signInData);
      if (response.data.success) {
        const userData: { user: user } = response.data.data;
        dispatch(setCurrentUser(userData));
      }
      router.push("/play");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred during signup."
      );
    } finally {
      setLoading(false);
    }
    console.log("Sign in with:", formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Decorative elements */}
      <div className="tetris-decoration" style={{ top: "20%", left: "10%" }}>
        <div className="w-16 h-16 bg-cyan-500/20 rotate-45"></div>
      </div>
      <div
        className="tetris-decoration"
        style={{ bottom: "15%", right: "10%" }}
      >
        <div className="w-24 h-8 bg-purple-500/20 -rotate-12"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-black/70 border border-gray-800 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center">
              <Link href="/" className="text-cyan-400 hover:text-cyan-300 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-cyan-400 pixel-text">
                SIGN IN
              </h1>
            </div>
            {error.length !== 0 && (
              <div className="text-red-500 flex items-center justify-center p-4">
                <IoAlert />
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-white pixel-text text-xs"
                >
                  EMAIL
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-white pixel-text text-xs"
                >
                  PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-cyan-400 hover:text-cyan-300 pixel-text text-xs"
                  >
                    FORGOT PASSWORD?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-5"
                disabled={loading}
              >
                SIGN IN
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-black px-2 text-gray-400">OR</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-4">Don't have an account?</p>
                <Link
                  href="/signup"
                  className="inline-block w-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-bold pixel-text text-xs py-3 text-center"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-cyan-400 glow-text mb-4 md:mb-0 pixel-text text-sm">
              TETRIS © {new Date().getFullYear()}
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

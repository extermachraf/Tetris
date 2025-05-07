"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { SignUpRequest, user } from "@/types/auth";
import { IoAlert } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { setLazyProp } from "next/dist/server/api-utils";
import useUserStore from "@/store/useUserStore";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setcurrentUser } = useUserStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle registration
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const signUpData: SignUpRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      setLoading(true);
      const response = await api.post("auth/signup", signUpData);
      if (response.data.success) {
        const userData: user = response.data.data;
        setcurrentUser(userData);
      }
      router.push("/play");
    } catch (err: any) {
      console.log(err.response);
      setError(
        err.response?.data?.message || "An error occurred during signup."
      );
    } finally {
      setLoading(false);
    }
  };

  // Password validation
  const passwordLength = formData.password.length >= 8;
  const passwordHasNumber = /\d/.test(formData.password);
  const passwordHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.password !== "";

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Decorative elements */}
      <div className="tetris-decoration" style={{ top: "15%", right: "10%" }}>
        <div className="w-20 h-8 bg-green-500/20 rotate-12"></div>
      </div>
      <div className="tetris-decoration" style={{ bottom: "20%", left: "5%" }}>
        <div className="w-16 h-16 bg-orange-500/20 -rotate-45"></div>
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
                CREATE ACCOUNT
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
                  htmlFor="username"
                  className="text-white pixel-text text-xs"
                >
                  USERNAME
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500"
                />
              </div>

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

                {/* Password requirements */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs">
                    {passwordLength ? (
                      <Check size={12} className="text-green-500 mr-1" />
                    ) : (
                      <X size={12} className="text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        passwordLength ? "text-green-500" : "text-gray-400"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {passwordHasNumber ? (
                      <Check size={12} className="text-green-500 mr-1" />
                    ) : (
                      <X size={12} className="text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        passwordHasNumber ? "text-green-500" : "text-gray-400"
                      }
                    >
                      At least 1 number
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {passwordHasSpecial ? (
                      <Check size={12} className="text-green-500 mr-1" />
                    ) : (
                      <X size={12} className="text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        passwordHasSpecial ? "text-green-500" : "text-gray-400"
                      }
                    >
                      At least 1 special character
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-white pixel-text text-xs"
                >
                  CONFIRM PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`bg-gray-900 border-gray-700 focus-visible:ring-cyan-500 pr-10 ${
                      formData.confirmPassword && !passwordsMatch
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-300"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-5"
                disabled={
                  !passwordLength ||
                  !passwordHasNumber ||
                  !passwordHasSpecial ||
                  !passwordsMatch ||
                  loading
                }
              >
                CREATE ACCOUNT
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
                <p className="text-gray-400 mb-4">Already have an account?</p>
                <Link
                  href="/login"
                  className="inline-block w-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-bold pixel-text text-xs py-3 text-center"
                >
                  SIGN IN
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthModalProps {
  type: "signin" | "signup"
  buttonText?: string
}

export default function AuthModal({ type, buttonText }: AuthModalProps) {
  const [open, setOpen] = useState(false)

  const isSignIn = type === "signin"
  const title = isSignIn ? "SIGN IN" : "CREATE ACCOUNT"
  const description = isSignIn
    ? "Enter your credentials to access your account"
    : "Create a new account to start playing and track your progress"

  const defaultButtonText = isSignIn ? "Log In" : "Sign Up"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isSignIn ? (
          <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold">
            {buttonText || defaultButtonText}
          </Button>
        ) : (
          <Button className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold">
            {buttonText || defaultButtonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-cyan-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400 pixel-text">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">{description}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              USERNAME
            </Label>
            <Input id="email" type="text" className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              PASSWORD
            </Label>
            <Input id="password" type="password" className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500" />
          </div>

          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                CONFIRM PASSWORD
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500"
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold">
            {isSignIn ? "SIGN IN" : "CREATE ACCOUNT"}
          </Button>

          {isSignIn && (
            <div className="text-center">
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">
                Forgot your password?
              </a>
            </div>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-2 text-gray-400">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-800 hover:text-white"
            onClick={() => {
              setOpen(false)
              // Here you would typically open the other modal
            }}
          >
            {isSignIn ? "SIGN UP INSTEAD" : "SIGN IN INSTEAD"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

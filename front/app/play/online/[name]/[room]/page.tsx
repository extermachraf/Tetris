"use client";

import type React from "react";

import Link from "next/link";
import { ArrowLeft, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnlineRoom() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 grid-bg"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/play"
              className="text-cyan-400 hover:text-cyan-300 flex items-center mr-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span className="text-sm">Back</span>
            </Link>
            <h1 className="text-xl font-bold text-cyan-400 tracking-wider glow-text pixel-text">
              ROOM: ROOM_ID
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-cyan-800 text-cyan-400 hover:bg-cyan-950"
            >
              <MessageSquare size={18} className="mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/70 border border-gray-800 p-6 mb-6">
              <h2 className="text-xl font-bold text-cyan-400 pixel-text mb-4">
                WAITING FOR PLAYERS
              </h2>
              <p className="text-gray-300 mb-6">
                Share this room code with your friends:{" "}
                <span className="text-cyan-400 font-mono">ROOM_ID</span>
              </p>

              <div className="space-y-4">
                <h3 className="text-cyan-400 font-pixel text-sm">PLAYERS</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-black/50 p-3 border border-gray-800">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Player 1</span>
                    </div>
                    <div className="text-xs text-green-500">Ready</div>
                  </div>
                  <div className="flex items-center justify-between bg-black/50 p-3 border border-gray-800">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Player 2</span>
                    </div>
                    <div className="text-xs text-green-500">Ready</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-6 px-8">
                  START GAME
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-cyan-400 glow-text mb-4 md:mb-0 pixel-text text-xs">
              TETRIS © {new Date().getFullYear()}
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

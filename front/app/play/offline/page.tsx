"use client";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import OfflinePlay from "@/components/game/OfflinePlay";
import { useState } from "react";

export default function page() {
  const [isStarted, setIsStarted] = useState(false);
  return (
    <div className="min-h-screen  relative overflow-hidden flex flex-col">
      <main className="relative z-10 flex-1 flex items-center justify-center">
        {!isStarted ? (
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center bg-black/70 border border-gray-800 p-8">
              <h1 className="text-3xl font-bold text-cyan-400 pixel-text mb-6">
                CLASSIC TETRIS
              </h1>
              <p className="text-gray-300 mb-8">
                Stack blocks, clear lines, and aim for the highest score in this
                classic Tetris game.
              </p>
              <Button
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-6 px-8"
                onClick={() => setIsStarted(true)}
              >
                START GAME
              </Button>
            </div>
          </div>
        ) : (
          <OfflinePlay />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";

export default function OfflinePlay() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Game Container */}
      <main className="flex flex-1 justify-center items-center gap-10 ">
        {/* Game Grid */}
        <div className="grid grid-cols-10 grid-rows-20 w-[340px] h-[600px]">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className=" border border-gray-200 w-full h-full"
            ></div>
          ))}
        </div>

        {/* Side Panel */}
        <aside className="flex flex-col items-start gap-4 text-left">
          <div>
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-xl font-bold">0000</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Level</p>
            <p className="text-xl font-bold">1</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Lines</p>
            <p className="text-xl font-bold">0</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Next Piece</p>
            <div className="w-16 h-16 bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">T</span>
            </div>
          </div>
          <Button className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text">
            Pause
          </Button>
          <Button variant="outline" className="text-white border-gray-700">
            Restart
          </Button>
          <Button className="">Leave</Button>
        </aside>
      </main>
    </div>
  );
}

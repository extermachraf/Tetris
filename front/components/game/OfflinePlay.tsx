"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";

interface gameData {
  render: number[][];
  currentPieace: string;
  nextPieace: string;
  isDead: false;
}

export default function OfflinePlay() {
  const socket = useSocket();
  const [arrayData, setArrayData] = useState<number[][] | null>(null);

  useEffect(() => {
    // Ask the server to generate an array
    socket.emit("generate array");

    // Listen for the response
    socket.on("generate array", (grid: number[][]) => {
      console.log(grid);
      setArrayData(grid);
    });

    // socket.emit("offline", (data: ))

    // Cleanup listener on unmount
    return () => {
      socket.off("generate array");
    };
  }, [socket]);

  // Flatten into a single 200-element array for rendering
  const flatGrid = arrayData ? arrayData.flat() : Array(200).fill(0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Game Container */}
      <main className="flex flex-1 justify-center items-center gap-10 ">
        {/* Game Grid */}
        <div className="grid grid-cols-10 grid-rows-20 w-[340px] h-[600px]">
          {flatGrid.map((cell, i) => (
            <div
              key={i}
              className={`border w-full h-full ${
                cell ? "bg-cyan-500" : "bg-transparent"
              }`}
            />
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
          <Button>Leave</Button>
        </aside>
      </main>
    </div>
  );
}

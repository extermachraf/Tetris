"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";

export default function OfflinePlay() {
  const socket = useSocket();
  const [arrayData, setArrayData] = useState<number[][] | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");

  useEffect(() => {
    if (!socket) {
      setConnectionStatus("No socket connection");
      return;
    }

    setConnectionStatus(`Connected: ${socket.id}`);

    // Ask the server to generate an array
    console.log("Emitting generate array event");
    socket.emit("generate array");

    // Listen for the response
    socket.on("generate array", (grid: number[][]) => {
      console.log("Received grid data:", grid);
      setArrayData(grid);
    });

    // Cleanup listener on unmount
    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("generate array");
    };
  }, [socket]);

  // Function to handle refresh button click
  const handleRefresh = () => {
    if (socket) {
      console.log("Requesting new grid data");
      socket.emit("generate array");
    }
  };

  // Flatten into a single array for rendering
  const flatGrid = arrayData ? arrayData.flat() : Array(200).fill(0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Debug Info */}
      <div className="bg-black text-white p-4">
        <p>Socket Status: {connectionStatus}</p>
        <p>Grid Data: {arrayData ? "Received" : "Waiting..."}</p>
      </div>

      {/* Game Container */}
      <main className="flex flex-1 justify-center items-center gap-10">
        {/* Game Grid */}
        <div className="grid grid-cols-10 grid-rows-20 w-[340px] h-[600px]">
          {flatGrid.map((cell, i) => (
            <div
              key={i}
              className={`border w-full h-full ${
                cell ? `bg-${getCellColor(cell)}` : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Side Panel */}
        <aside className="flex flex-col items-start gap-4 text-left">
          <div>
            <p className="text-sm text-gray-400">Test Controls</p>
            <Button
              className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
              onClick={handleRefresh}
            >
              Refresh Board
            </Button>
          </div>
        </aside>
      </main>
    </div>
  );
}

// Helper function to get cell color based on value
function getCellColor(value: number): string {
  switch (value) {
    case 1:
      return "cyan-500";
    case 2:
      return "blue-500";
    case 3:
      return "orange-500";
    case 4:
      return "yellow-500";
    case 5:
      return "green-500";
    case 6:
      return "purple-500";
    case 7:
      return "red-500";
    default:
      return "gray-500";
  }
}

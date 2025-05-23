"use client";

import type React from "react";

import Link from "next/link";
import { ArrowLeft, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useRoomHash from "@/hooks/useRoomHash";
import { useSocket } from "@/context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setRoom,
  addPlayer,
  removePlayer,
  setIsLeader,
} from "@/store/roomSlice";

export default function OnlineRoom() {
  // Use custom hook to extract room information and player name from hash URL
  const { hash, roomId, playerName } = useRoomHash();
  const socket = useSocket();
  const dispatch = useDispatch();
  const { players, isLeader } = useSelector((state: RootState) => state.room);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (!socket || !roomId || !playerName) return;

    // Create or join room when component mounts
    socket.emit("creatRoom", { roomName: roomId, playerName });
    console.log("tracker");

    // Listen for room creation success
    socket.on("roomCreated", (data) => {
      console.log("Room created:", data);
      setIsConnecting(false);
      dispatch(setRoom({ roomId: data.roomName }));
      dispatch(setIsLeader(data.isLeader));

      // Add all players from the response
      data.players.forEach((player: any) => {
        dispatch(
          addPlayer({
            name: player.name,
            isleader: player.isLeader,
            isReady: player.isReady,
          })
        );
      });
    });

    // Listen for errors
    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
      setError(data.message);
      setIsConnecting(false);
    });

    // Listen for player joined events
    socket.on("playerJoined", (data) => {
      console.log("Player joined:", data);
      dispatch(
        addPlayer({
          name: data.playerName,
          isleader: data.isLeader,
          isReady: false,
        })
      );
    });

    // Listen for player left events
    socket.on("playerLeft", (data) => {
      console.log("Player left:", data);
      dispatch(removePlayer(data.playerName));

      // If there's a new leader, update the leader status
      if (data.newLeaderName && data.newLeaderName === playerName) {
        dispatch(setIsLeader(true));
      }
    });

    // Listen for leader update
    socket.on("leaderUpdate", (data) => {
      console.log("Leader update:", data);
      dispatch(setIsLeader(data.isLeader));
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off("roomCreated");
      socket.off("error");
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("leaderUpdate");
    };
  }, [socket, roomId, playerName, dispatch]);

  // Handle start game button click
  const handleStartGame = () => {
    if (socket && isLeader) {
      socket.emit("startGame", { roomName: roomId });
    }
  };

  // Handle ready button click
  const handleReady = () => {
    if (socket) {
      socket.emit("playerReady", { roomName: roomId, playerName });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-800 p-6 rounded-md max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-6">{error}</p>
          <Link href="/play">
            <Button className="bg-red-500 hover:bg-red-400 text-white">
              Back to Play Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Connecting to room...</div>
      </div>
    );
  }

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
              ROOM: {roomId}
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
                <span className="text-cyan-400 font-mono">{roomId}</span>
              </p>

              <div className="space-y-4">
                <h3 className="text-cyan-400 font-pixel text-sm">PLAYERS</h3>
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.name}
                      className="flex items-center justify-between bg-black/50 p-3 border border-gray-800"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            player.isReady ? "bg-green-500" : "bg-yellow-500"
                          } mr-2`}
                        ></div>
                        <span>
                          {player.name} {player.isleader ? "(Leader)" : ""}
                        </span>
                      </div>
                      <div
                        className={`text-xs ${
                          player.isReady ? "text-green-500" : "text-yellow-500"
                        }`}
                      >
                        {player.isReady ? "Ready" : "Not Ready"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                {playerName &&
                  !players.find((p) => p.name === playerName)?.isReady && (
                    <Button
                      onClick={handleReady}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold pixel-text py-6 px-8"
                    >
                      READY
                    </Button>
                  )}

                {isLeader &&
                  players.length > 1 &&
                  players.every((p) => p.isReady) && (
                    <Button
                      onClick={handleStartGame}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-6 px-8"
                    >
                      START GAME
                    </Button>
                  )}
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

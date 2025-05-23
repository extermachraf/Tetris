"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  User,
  Globe,
  Laptop,
  Plus,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/context/SocketContext";

export default function Play() {
  const socket = useSocket();
  const router = useRouter();
  const [createRoomDialog, setCreateRoomDialog] = useState(false);
  const [joinRoomDialog, setJoinRoomDialog] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");

  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser?.user
  );

  console.log("this is the current user: ", currentUser);
  // handle room creation
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();

    let playerName;
    if (currentUser) {
      playerName = currentUser?.username;
    } else {
      playerName = `Guest${Math.floor(Math.random() * 1000)}`;
    }
    router.push(`/play/online/#create-${roomName}[${playerName}]`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    let playerName;
    if (currentUser) {
      playerName = currentUser?.username;
    } else {
      playerName = `Guest${Math.floor(Math.random() * 1000)}`;
    }
    router.push(`/play/online/join/#join-${roomName}[${playerName}]`);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <main className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-cyan-400 glow-text pixel-text text-center">
            PLAY TETRIS
          </h1>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Online Play Section */}
            <div className="bg-black/50 border border-gray-800 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-xl"></div>

              <div className="flex items-center mb-6">
                <div className="bg-cyan-500/20 p-3 rounded-full mr-4">
                  <Globe className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-cyan-400 pixel-text">
                  PLAY ONLINE
                </h2>
              </div>

              <p className="text-gray-300 mb-8">
                Challenge friends or random players in real-time multiplayer
                matches. Create a room or join an existing one.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Create Room Dialog */}
                <Dialog
                  open={createRoomDialog}
                  onOpenChange={setCreateRoomDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-6 flex items-center justify-center gap-2">
                      <Plus size={18} />
                      CREATE ROOM
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-black border-cyan-900 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-cyan-400 pixel-text">
                        CREATE ROOM
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleCreateRoom}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-2">
                        <label
                          htmlFor="room-name"
                          className="text-white pixel-text text-xs"
                        >
                          ROOM NAME
                        </label>
                        <Input
                          id="room-name"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-5"
                      >
                        CREATE & START
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Join Room Dialog */}
                <Dialog open={joinRoomDialog} onOpenChange={setJoinRoomDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold pixel-text py-6 flex items-center justify-center gap-2">
                      <LogIn size={18} />
                      JOIN ROOM
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-black border-cyan-900 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-cyan-400 pixel-text">
                        JOIN ROOM
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleJoinRoom} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="room-code"
                          className="text-white pixel-text text-xs"
                        >
                          ROOM CODE
                        </label>
                        <Input
                          id="room-code"
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value)}
                          className="bg-gray-900 border-gray-700 focus-visible:ring-cyan-500"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold pixel-text py-5"
                      >
                        JOIN GAME
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-black/30 p-4 border border-gray-800 rounded">
                <h3 className="text-cyan-400 font-pixel text-sm mb-2">
                  ONLINE FEATURES
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <Users
                      size={16}
                      className="text-cyan-400 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>Multiplayer battles with up to 4 players</span>
                  </li>
                  <li className="flex items-start">
                    <User
                      size={16}
                      className="text-cyan-400 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>Customizable game settings</span>
                  </li>
                  <li className="flex items-start">
                    <Globe
                      size={16}
                      className="text-cyan-400 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>Global leaderboards and rankings</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Offline Play Section */}
            <div className="bg-black/50 border border-gray-800 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-xl"></div>

              <div className="flex items-center mb-6">
                <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                  <Laptop className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-purple-400 pixel-text">
                  PLAY OFFLINE
                </h2>
              </div>

              <p className="text-gray-300 mb-8">
                Play the classic Tetris game in single-player mode. Practice
                your skills and beat your own high score.
              </p>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <Link href="/play/offline">
                  <Button className="w-full bg-purple-500 hover:bg-purple-400 text-black font-bold pixel-text py-6 flex items-center justify-center gap-2">
                    <ArrowRight size={18} />
                    START GAME
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { connect } from "http2";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("socket connected succesfully:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.log("socket connection error", err);
    });

    setSocket(newSocket);

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  if (!socket) return null; // Or a loading spinner

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used inside <SocketProvider>");
  }
  return socket;
}

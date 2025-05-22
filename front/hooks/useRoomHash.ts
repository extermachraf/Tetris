"use clinet";

import { useEffect, useState } from "react";
export default function useRoomHash() {
  const [hash, setHah] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const hashValue = window.location.hash;
    const hashWithoutPrefix = hashValue.substring(1);

    if (hashWithoutPrefix) {
      setHah(hashWithoutPrefix);
      const roomMatch = hashWithoutPrefix.split("[")[0];
      const playerMatch = hashWithoutPrefix.match(/\[(.*?)\]/);
      if (roomMatch) setRoomId(roomMatch);
      if (playerMatch && playerMatch[1]) setPlayerName(playerMatch[1]);
    }
  }, []);
  return { hash, roomId, playerName };
}

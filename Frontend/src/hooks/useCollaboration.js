import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { userColor } from "../utils/userColor";

export function useCollaboration({ username, onUsersChange }) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (!username) return;

    const color = userColor(username);

    const newProvider = new SocketIOProvider(
      "/", "collab-room", ydoc, { autoConnect: true }
    );

    newProvider.awareness.setLocalStateField("user", { username, color });

    const syncUsers = () => {
      const states = Array.from(newProvider.awareness.getStates().values());
      onUsersChange?.(states.filter(s => s?.user?.username).map(s => s.user));
    };

    syncUsers();
    newProvider.awareness.on("update", syncUsers);

    function handleBeforeUnload() {
      newProvider.awareness.setLocalStateField("user", null);
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    setProvider(newProvider);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      newProvider.destroy();
    };
  }, [username, ydoc, onUsersChange]);

  return { ydoc, provider };
}

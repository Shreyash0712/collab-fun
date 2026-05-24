import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { MonacoBinding } from "y-monaco";
import { userColor } from "../utils/userColor";

export function useCollaboration({ username, onUsersChange }) {
  const editorRef = useRef(null);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);
  const [editorMounted, setEditorMounted] = useState(false);

  useEffect(() => {
    if (!username || !editorMounted) return;

    const editor = editorRef.current;
    const color = userColor(username);

    const provider = new SocketIOProvider(
      "/", "monaco", ydoc, { autoConnect: true }
    );

    provider.awareness.setLocalStateField("user", { username, color });

    const syncUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      onUsersChange?.(states.filter(s => s?.user?.username).map(s => s.user));
    };

    syncUsers();
    provider.awareness.on("update", syncUsers);

    function handleBeforeUnload() {
      provider.awareness.setLocalStateField("user", null);
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    const monacoBinding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      monacoBinding.destroy();
      provider.destroy();
    };
  }, [username, editorMounted]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    setEditorMounted(true);
  };

  return { handleMount };
}

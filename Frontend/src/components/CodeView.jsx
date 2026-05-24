import { Editor } from "@monaco-editor/react";
import { useCollaboration } from "../hooks/useCollaboration";

export default function CodeView({ language, value, onChange, username, onUsersChange }) {
  const { handleMount } = useCollaboration({ username, onUsersChange });

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{ padding: { top: 16 } }}
      onMount={handleMount}
    />
  );
}

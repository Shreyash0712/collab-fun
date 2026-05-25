import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";

export default function CodeView({ language, value, onChange, ydoc, provider }) {
  const editorRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current || !ydoc || !provider) return;

    const ytext = ydoc.getText("monaco");
    bindingRef.current = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    return () => {
      bindingRef.current?.destroy();
    };
  }, [ydoc, provider]);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };

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

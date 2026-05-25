import { useState } from "react";
import "./App.css";
import { LANGUAGE_SNIPPETS } from "./snippets";
import Sidebar from "../components/Sidebar";
import EditorHeader from "../components/EditorHeader";
import CodeView from "../components/CodeView";
import CanvasView from "../components/CanvasView";
import { useCollaboration } from "../hooks/useCollaboration";

export default function App() {
  const [language, setLanguage] = useState("java");
  const [value, setValue] = useState(LANGUAGE_SNIPPETS["java"]);
  const [view, setView] = useState("code");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const { ydoc, provider } = useCollaboration({ username, onUsersChange: setUsers });

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setValue(LANGUAGE_SNIPPETS[newLang]);
  };

  const handleJoin = (e) => {
    e.preventDefault()
    setUsername(e.target.username.value)
    window.history.pushState({}, "", `?username=${e.target.username.value}`)
  }

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-2 p-2 overflow-hidden items-center justify-center">
        <form className="flex flex-col gap-4" onSubmit={handleJoin}>
          <input className="p-2 rounded-lg bg-gray-800 text-white outline-none placeholder-align-center text-center" type="text" placeholder="Enter your username" name="username" />
          <button className="p-2 rounded-lg bg-neutral-800 text-white">Join</button>
        </form>
      </main>
    )
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-2 p-2 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} users={users} username={username} />

      <section className="flex-1 bg-neutral-800 rounded-lg overflow-hidden flex flex-col min-w-0">
        <EditorHeader
          view={view}
          onViewChange={setView}
          language={language}
          onLanguageChange={handleLanguageChange}
          onSidebarToggle={() => setSidebarOpen((o) => !o)}
        />

        <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
          {view === "code" ? (
            <CodeView language={language} value={value} onChange={setValue} ydoc={ydoc} provider={provider} />
          ) : (
            <CanvasView ydoc={ydoc} provider={provider} username={username} />
          )}
        </div>
      </section>
    </main>
  );
}

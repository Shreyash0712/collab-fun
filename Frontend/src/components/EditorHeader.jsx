import { useState, useRef, useEffect } from "react";
import { LANGUAGES } from "../app/snippets";

function formatLangLabel(lang) {
  if (lang === "cpp") return "C++";
  if (lang === "csharp") return "C#";
  return lang.charAt(0).toUpperCase() + lang.slice(1);
}

function SidebarToggle({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Toggle sidebar"
      className="text-neutral-500 hover:text-neutral-200 transition-colors p-1.5 rounded hover:bg-neutral-800"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    </button>
  );
}

function LanguageSelector({ language, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 text-xs font-medium outline-none transition-colors"
      >
        {formatLangLabel(language)}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-36 bg-[#252526] border border-[#3e3e42] rounded-md shadow-2xl z-50 py-1 max-h-64 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#4b4b4b #252526" }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => { onLanguageChange(lang); setIsOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                language === lang
                  ? "bg-[#094771] text-white"
                  : "text-neutral-300 hover:bg-[#2a2d2e] hover:text-neutral-100"
              }`}
            >
              {formatLangLabel(lang)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditorHeader({ view, onViewChange, language, onLanguageChange, onSidebarToggle }) {
  return (
    <div className="h-12 bg-[#1e1e1e] border-b border-neutral-700 flex items-center px-3 gap-3 flex-shrink-0">
      {/* Sidebar toggle lives here now */}
      <SidebarToggle onClick={onSidebarToggle} />

      {/* Left spacer */}
      <div className="flex-1" />

      {/* Code / Canvas toggle */}
      <div className="flex items-center bg-neutral-800/50 rounded-md p-1 border border-neutral-700/50">
        {["code", "canvas"].map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-4 py-1 text-xs font-medium rounded-sm transition-all duration-200 capitalize ${
              view === v
                ? "bg-neutral-700 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Right: language selector */}
      <div className="flex-1 flex justify-end">
        {view === "code" && (
          <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
        )}
      </div>
    </div>
  );
}

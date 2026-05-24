import { userColor } from "../utils/userColor";

export default function Sidebar({ isOpen, onClose, users = [], username }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-[#1e1e1e] border border-neutral-800 rounded-lg flex flex-col flex-shrink-0
          transition-all duration-300 ease-in-out overflow-hidden
          fixed top-2 bottom-2 left-2 z-40
          md:static md:z-auto
          ${isOpen ? "w-3/4 md:w-56" : "w-0 border-transparent"}
        `}
      >
        <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-800 flex-shrink-0">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest whitespace-nowrap">
            Online
          </span>
          {users.length > 0 && (
            <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
              {users.length}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {users.length === 0 ? (
            <div className="h-full flex items-center justify-center text-neutral-600 text-xs whitespace-nowrap">
              No one online
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {users.map((user, i) => {
                const color = user.color || userColor(user.username);
                const isMe = user.username === username;
                return (
                  <li
                    key={user.username + i}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-neutral-800/60 transition-colors"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-300 truncate whitespace-nowrap">
                      {user.username}
                    </span>
                    {isMe && (
                      <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                        You
                      </span>
                    )}
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

const CURSOR_COLORS = [
  "#4f8ef7", "#e05c5c", "#4db87a", "#e0a84a",
  "#a56ef5", "#e07a5f", "#3fc1c9", "#f78fb3",
];

export function userColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return CURSOR_COLORS[Math.abs(h) % CURSOR_COLORS.length];
}

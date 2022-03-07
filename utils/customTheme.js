import { EditorView } from "@uiw/react-codemirror";

export const darkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#1f2937",
    },
    ".cm-content": {
      caretColor: "#111827",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#111827",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#374151",
    },
    ".cm-gutters": {
      backgroundColor: "#374151",
      color: "#ddd",
      border: "none",
    },
  },
  { dark: true }
);

export const lightTheme = EditorView.theme(
  {
    "&": {
      color: "white",
      backgroundColor: "orange",
    },
    ".cm-content": {
      caretColor: "yellow",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "green",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "blue",
    },
    ".cm-gutters": {
      backgroundColor: "red",
      color: "#ddd",
      border: "none",
    },
  },
  { dark: false }
);

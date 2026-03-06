"use client";

import { useState, useEffect } from "react";

type SavedItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_label: string;
  type: "product" | "bundle" | "free";
  saved_at: number;
};

const STORAGE_KEY = "aa_library";

function getLibrary(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLibrary(items: SavedItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

type Props = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_label: string;
  type: "product" | "bundle" | "free";
};

export default function SaveToLibraryButton({ id, slug, name, category, price_label, type }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const library = getLibrary();
    setSaved(library.some((i) => i.id === id));
  }, [id]);

  const toggle = () => {
    const library = getLibrary();
    if (saved) {
      setLibrary(library.filter((i) => i.id !== id));
      setSaved(false);
    } else {
      const item: SavedItem = { id, slug, name, category, price_label, type, saved_at: Date.now() };
      setLibrary([...library, item]);
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="btn btn-outline"
      style={{
        width: "100%",
        justifyContent: "center",
        marginTop: "0.6rem",
        background: saved ? "var(--green-light)" : undefined,
        borderColor: saved ? "rgba(26,107,80,0.4)" : undefined,
        color: saved ? "var(--green)" : undefined,
      }}
    >
      {saved ? "✅ Saved to library" : "📚 Save to library"}
    </button>
  );
}

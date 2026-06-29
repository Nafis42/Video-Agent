import { useEffect, useState } from "react"

type Theme = "dark" | "light"

// Lightweight theme toggle. The app is dark-first; toggling adds/removes the
// `dark` class on <html>. Persisted to localStorage for a consistent feel.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark"
    return (localStorage.getItem("theme") as Theme) ?? "dark"
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return { theme, toggle }
}

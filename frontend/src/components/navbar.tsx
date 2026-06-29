import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Github, Moon, Sun, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export function Navbar() {
  const { theme, toggle } = useTheme()

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-[var(--color-accent)]/25">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            AI Video Assistant
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <a
            href="https://github.com/Nafis42/Video-Agent"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:block"
          >
            <Button variant="ghost" size="sm">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="sm:hidden"
          >
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </Button>
          </a>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button> */}
        </div>
      </nav>
    </motion.header>
  )
}

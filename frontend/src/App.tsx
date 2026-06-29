import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingBackground } from "@/components/floating-background"
import { LandingPage } from "@/pages/landing"
import { ProcessingPage } from "@/pages/processing"
import { DashboardPage } from "@/pages/dashboard"


export default function App() {
  const location = useLocation()

  return (
    <div className="relative flex min-h-screen flex-col">
      <FloatingBackground />
      <Navbar />
      <main className="flex-1">
        {/* <AnimatePresence mode="wait"> */}
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        {/* </AnimatePresence> */}
      </main>
      <Footer />
    </div>
  )
}

import { motion } from "framer-motion"

// Subtle, slow-moving accent glows + a faint grid to make the page feel alive
// without resorting to harsh decorative blobs.
export function FloatingBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />

      <motion.div
        className="absolute -top-32 left-1/4 h-[34rem] w-[34rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.21 295 / 0.22), transparent 60%)",
        }}
        animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-1/5 h-[28rem] w-[28rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.18 255 / 0.2), transparent 60%)",
        }}
        animate={{ y: [0, -50, 0], x: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

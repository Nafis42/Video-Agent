import { Hero } from "@/components/hero"
import { FeatureStrip } from "@/components/feature-strip"
import { PageTransition } from "@/components/page-transition"

export function LandingPage() {
  return (
    <PageTransition>
      <Hero />
      <FeatureStrip />
    </PageTransition>
  )
}

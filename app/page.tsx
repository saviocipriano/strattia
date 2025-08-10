// app/page.tsx

'use client'

import HeroSection from '@/components/HeroSection'
import FeatureGrid from '@/components/FeatureGrid'
import PartnersSection from '@/components/PartnersSection'
import PricingSection from '@/components/PricingSection'
import TestimonialSlider from '@/components/TestimonialSlider'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function HomePage() {
  return (
  <main className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <FeatureGrid />
      <PartnersSection />
      <PricingSection />
      <TestimonialSlider />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}

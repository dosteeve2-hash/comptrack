import { Navbar }             from '@/components/landing/Navbar'
import { HeroSection }        from '@/components/landing/HeroSection'
import { StatsSection }       from '@/components/landing/StatsSection'
import { FeaturesSection }    from '@/components/landing/FeaturesSection'
import { DashboardPreview }   from '@/components/landing/DashboardPreview'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection }     from '@/components/landing/PricingSection'
import { CTASection }         from '@/components/landing/CTASection'
import { FooterSection }      from '@/components/landing/FooterSection'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <DashboardPreview />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}

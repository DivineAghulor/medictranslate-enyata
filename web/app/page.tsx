import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBanner from "@/components/TrustBanner";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-100 selection:text-green-900 ">
      <Navbar />
      <div className="px-4 md:px-10">
        <HeroSection />
        <TrustBanner />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}

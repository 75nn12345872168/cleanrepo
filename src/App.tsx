import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ComparisonSection } from './components/ComparisonSection';
import { SampleReportViewer } from './components/SampleReportViewer';
import { ProcessSection } from './components/ProcessSection';
import { PricingIntakeSection } from './components/PricingIntakeSection';
import { Footer } from './components/Footer';

export default function App() {
  const [prefillRepo, setPrefillRepo] = useState<string | undefined>(undefined);

  const handleRequestDeepAudit = (repoSlug?: string) => {
    if (repoSlug) {
      setPrefillRepo(repoSlug);
    }
    const target = document.getElementById('intake');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main>
        <Hero onRequestDeepAudit={handleRequestDeepAudit} />
        <ComparisonSection />
        <SampleReportViewer />
        <ProcessSection />
        <PricingIntakeSection prefillRepo={prefillRepo} />
      </main>
      <Footer />
    </div>
  );
}

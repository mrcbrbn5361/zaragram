import { ArchitecturePanel } from './components/architecture-panel';
import { CountrySelector } from './components/country-selector';
import { DashboardSummary } from './components/dashboard-summary';
import { HeroPanel } from './components/hero-panel';
import { TrackingForm } from './components/tracking-form';
import { TrackingPreview } from './components/tracking-preview';
import { zaraMarkets } from '@/lib/countries';

export default function HomePage() {
  return (
    <main className="page-shell">
      <HeroPanel />
      <DashboardSummary />
      <section className="content-grid">
        <div className="content-stack">
          <ArchitecturePanel />
          <TrackingForm markets={zaraMarkets} />
          <CountrySelector markets={zaraMarkets} />
        </div>
        <TrackingPreview />
      </section>
    </main>
  );
}

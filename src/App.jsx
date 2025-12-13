import Navigation from './layout/Navigation.jsx';
import Hero from './sections/Hero.jsx';
import FeatureShowcase from './sections/FeatureShowcase.jsx';
import AutomationSuite from './sections/AutomationSuite.jsx';
import MonetizationSpotlight from './sections/MonetizationSpotlight.jsx';
import CommunityPulse from './sections/CommunityPulse.jsx';
import CallToAction from './sections/CallToAction.jsx';

function App() {
  return (
    <div className="site-shell">
      <Navigation />
      <main>
        <Hero />
        <FeatureShowcase />
        <AutomationSuite />
        <MonetizationSpotlight />
        <CommunityPulse />
        <CallToAction />
      </main>
    </div>
  );
}

export default App;

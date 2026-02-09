import { useState } from "react";
import { Layout } from "./components/layout";
import {
  Hero,
  Stats,
  About,
  TechStack,
  Experience,
  Projects,
  Certifications,
  Contact,
} from "./components/sections";
import RollupSummaryProject from "./projects/RollupSummaryProject";
import TaxConfigProject from "./projects/TaxConfigProject";
import ValidationProject from "./projects/ValidationProject";
import RecentItemsProject from "./projects/RecentItemsProject";
import MarketDataProject from "./projects/MarketDataProject";
import AccessMgmtProject from "./projects/AccessMgmtProject";
import MLLeadScoringProject from "./projects/MLLeadScoringProject";

/**
 * App — Root component assembling all portfolio sections within the IDE layout.
 * Explorer sidebar always visible. Content area switches between portfolio
 * sections and project detail views — identical to VS Code tab behavior.
 */
export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  const projectContent = {
    "rollup-summary": <RollupSummaryProject onBack={() => setActiveProject(null)} />,
    "tax-config": <TaxConfigProject onBack={() => setActiveProject(null)} />,
    "record-validation": <ValidationProject onBack={() => setActiveProject(null)} />,
    "recent-items": <RecentItemsProject onBack={() => setActiveProject(null)} />,
    "market-data": <MarketDataProject onBack={() => setActiveProject(null)} />,
    "access-mgmt": <AccessMgmtProject onBack={() => setActiveProject(null)} />,
    "ml-lead-scoring": <MLLeadScoringProject onBack={() => setActiveProject(null)} />,
  };

  return (
    <Layout activeProject={activeProject} onOpenProject={setActiveProject}>
      {activeProject && projectContent[activeProject] ? (
        projectContent[activeProject]
      ) : (
        <>
          <Hero />
          <Stats />
          <About />
          <TechStack />
          <Experience onOpenProject={setActiveProject} />
          <Projects />
          <Certifications />
          <Contact />
        </>
      )}
    </Layout>
  );
}

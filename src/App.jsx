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
import PrepPlatform from "./prep/PrepPlatform";
import { PREP_COURSES } from "./prep/prepData";

/**
 * App — Root component assembling all portfolio sections within the IDE layout.
 * Explorer sidebar always visible. Content area switches between portfolio
 * sections, project detail views, and prep reader — identical to VS Code tab behavior.
 */
export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  // Parse prep file routes: "prep:dsa:Week-01/README.md" → { courseId, filePath }
  const parsePrepRoute = (id) => {
    if (!id?.startsWith("prep:")) return null;
    const [, courseId, ...rest] = id.split(":");
    return { courseId, filePath: rest.join(":") };
  };

  const prepRoute = parsePrepRoute(activeProject);
  const prepCourse = prepRoute
    ? PREP_COURSES.find((c) => c.id === prepRoute.courseId)
    : null;

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
      {prepCourse ? (
        <PrepPlatform
          course={prepCourse}
          filePath={prepRoute.filePath}
          onBack={() => setActiveProject(null)}
          onNavigate={(courseId, filePath) => setActiveProject(`prep:${courseId}:${filePath}`)}
        />
      ) : activeProject && projectContent[activeProject] ? (
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

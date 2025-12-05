import React, { Suspense, lazy } from "react";
import Banner from "./components/banner/Banner";
import Navbar from "./components/navbar/Navbar";
import ScrollAnimation from "./components/animation/ScrollAnimation";

// Lazy load components for performance optimization
const Contact = lazy(() => import("./components/contact/Contact"));
const Features = lazy(() => import("./components/features/Features"));
const Footer = lazy(() => import("./components/footer/Footer"));
const FooterBottom = lazy(() => import("./components/footer/FooterBottom"));
const Projects = lazy(() => import("./components/projects/Projects"));
const Resume = lazy(() => import("./components/resume/Resume"));

function App() {
  return (
    <div className="w-full h-auto bg-bodyColor text-lightText px-4">
      <Navbar />
      <div className="max-w-screen-xl mx-auto">
        <Banner />
        <Suspense
          fallback={
            <div className="w-full h-screen flex justify-center items-center text-designColor">
              Loading...
            </div>
          }
        >
          <ScrollAnimation>
            <Features />
          </ScrollAnimation>
          <ScrollAnimation>
            <Projects />
          </ScrollAnimation>
          <ScrollAnimation>
            <Resume />
          </ScrollAnimation>
          <ScrollAnimation>
            <Contact />
          </ScrollAnimation>
          <Footer />
          <FooterBottom />
        </Suspense>
      </div>
    </div>
  );
}

export default App;

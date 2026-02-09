import { Prompt, Icon } from "../ui";
import { ABOUT } from "../../data/portfolioData";

/**
 * About — System overview / bio section
 */
export default function About() {
  return (
    <section className="space-y-4" id="about">
      <Prompt command='grep -r "narrative" ./bio.txt' />

      <div className="border border-border rounded-md p-4 sm:p-6 bg-sidebar/50">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="info" className="text-accent" />
          <h2 className="text-lg sm:text-xl font-bold">SYSTEM_OVERVIEW</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 text-sm leading-relaxed">
          {ABOUT.paragraphs.map((text, i) => (
            <p key={i}>
              <span className="text-success font-bold">&gt;&gt;&gt;</span> {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

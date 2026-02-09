import { Prompt } from "../ui";
import { PERSONAL, ASCII_ART } from "../../data/portfolioData";

/**
 * Hero — Landing section with ASCII art name, Python class intro, and login timestamp
 */
export default function Hero() {
  const now = new Date().toLocaleString();

  return (
    <section className="space-y-4" id="hero">
      <div className="text-comment text-xs animate-fade-in-up">
        # Last login: {now} on ttys001
      </div>

      <Prompt command="cat intro.ascii" className="animate-fade-in-up animate-delay-100" />

      <pre className="text-accent leading-none text-[5px] xs:text-[6px] sm:text-[8px] md:text-[10px] overflow-x-auto animate-fade-in-up animate-delay-200">
        {ASCII_ART}
      </pre>

      <div className="bg-border/30 border-l-4 border-accent p-3 sm:p-4 animate-fade-in-up animate-delay-300 overflow-x-auto">
        <p className="text-keyword text-sm sm:text-base">
          class <span className="text-func">SoftwareEngineer</span>:
        </p>
        <p className="pl-4 text-sm sm:text-base">
          <span className="text-keyword">def</span>{" "}
          <span className="text-func">__init__</span>(self):
        </p>
        <p className="pl-6 sm:pl-8 text-xs sm:text-base">
          self.role = <span className="text-string">"{PERSONAL.role}"</span>
        </p>
        <p className="pl-6 sm:pl-8 text-xs sm:text-base">
          self.specialty = [
          {PERSONAL.specialty.map((s, i) => (
            <span key={s}>
              <span className="text-string">"{s}"</span>
              {i < PERSONAL.specialty.length - 1 && ", "}
            </span>
          ))}
          ]
        </p>
        <p className="pl-6 sm:pl-8 text-xs sm:text-base">
          self.focus ={" "}
          <span className="text-string">"{PERSONAL.focus}"</span>
        </p>
      </div>
    </section>
  );
}

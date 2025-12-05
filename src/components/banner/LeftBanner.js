import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { FaGithub, FaLinkedinIn, FaReact } from "react-icons/fa";
import { SiLeetcode, SiJava, SiPython, SiJavascript } from "react-icons/si";

const LeftBanner = () => {
  const [text] = useTypewriter({
    words: [
      "Results-driven Full Stack Developer.",
      "Professional Coder.",
      "Backend Developer.",
    ],
    loop: true,
    typeSpeed: 20,
    deleteSpeed: 10,
    delaySpeed: 2000,
  });
  return (
    <div className="w-full lgl:w-1/2 flex flex-col gap-20">
      <div className="flex flex-col gap-5">
        <h4 className=" text-lg font-normal">
          WELCOME TO MY PORTFOLIO WEBSITE
        </h4>
        <h1 className="text-6xl font-bold text-white">
          Hi, I'm{" "}
          <span className="text-designColor capitalize">Shanmuga Ganesh</span>
        </h1>
        <h2 className="text-4xl font-bold text-white">
          a <span>{text}</span>
          <Cursor
            cursorBlinking="false"
            cursorStyle="|"
            cursorColor="#ff014f"
          />
        </h2>
        <p className="text-base font-bodyFont leading-6 tracking-wide">
          Results-driven Full Stack Developer with over 6 years of experience in
          designing, developing, and deploying scalable web applications.
        </p>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 lgl:gap-0 justify-between">
        <div>
          <h2 className="text-base uppercase font-titleFont mb-4">
            Find me in
          </h2>
          <div className="flex gap-4">
            <a
              href="https://github.com/ShanmugaGanesh1999"
              target="_blank"
              rel="noopener noreferrer"
              className="bannerIcon"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/shanmuga-ganesh"
              target="_blank"
              rel="noopener noreferrer"
              className="bannerIcon"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://leetcode.com/u/Shanmuga_Ganesh"
              target="_blank"
              rel="noopener noreferrer"
              className="bannerIcon"
            >
              <SiLeetcode />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-base uppercase font-titleFont mb-4">
            BEST SKILL ON
          </h2>
          <div className="flex gap-4">
            <span className="bannerIcon">
              <FaReact />
            </span>
            <span className="bannerIcon">
              <SiJava />
            </span>
            <span className="bannerIcon">
              <SiPython />
            </span>
            <span className="bannerIcon">
              <SiJavascript />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBanner;

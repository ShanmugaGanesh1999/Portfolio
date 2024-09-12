import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { contactImg } from "../../assets/index";

const ContactLeft = () => {
  return (
    <div className="w-full lgl:w-[35%] h-full bg-gradient-to-r from-[#1e2024] to-[#23272b] p-4 lgl:p-8 rounded-lg shadow-shadowOne flex flex-col gap-8 justify-center">
      <div className="w-full h-full">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={contactImg}
          alt="contactImg"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-bold text-white">Shanmuga Ganesh</h3>
        <p className="text-lg font-normal text-gray-400">Software Developer</p>
        <p className="text-base text-gray-400 tracking-wide">
          I am a software developer with a passion for creating innovative
          solutions to complex problems. I have a strong foundation in computer
          science and software engineering, and I am always looking for new
          challenges and opportunities to learn and grow.
        </p>
        <p className="text-base text-gray-400 flex items-center gap-2">
          Phone: <span className="text-lightText">+1 (216)-466-6648</span>
        </p>
        <p className="text-base text-gray-400 flex items-center gap-2">
          Email:{" "}
          <span className="text-lightText">shanmugaganesh1999@gmail.com</span>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-base uppercase font-titleFont mb-4">Find me in</h2>
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
    </div>
  );
};

export default ContactLeft;

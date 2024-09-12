import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { logo } from "../../assets/index";
import { Link } from "react-scroll";
import { navLinksdata } from "../../constants";

const Footer = () => {
  return (
    <div className="w-full py-20 h-auto border-b-[1px] border-b-black flex justify-center items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full h-full flex flex-col gap-8 items-center">
          <div className="flex flex-col xl:flex-row gap-6 lgl:gap-0 justify-between">
            <div>
              <img
                src={logo}
                className="w-32 rounded-full z-10 object-cover object-center bannerIcon"
                alt="logo"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <SocialLink
              href="https://www.facebook.com/shanmuga.ganesh.94"
              icon={<FaFacebookF />}
              ariaLabel="Facebook"
            />
            <SocialLink
              href="https://www.instagram.com/_sg.uchiha"
              icon={<FaInstagram />}
              ariaLabel="Instagram"
            />
            <SocialLink
              href="https://www.linkedin.com/in/shanmuga-ganesh"
              icon={<FaLinkedinIn />}
              ariaLabel="LinkedIn"
            />
          </div>
        </div>
        <div className="w-full h-full flex flex-col items-center">
          <h3 className="text-xl uppercase text-designColor tracking-wider mb-4">
            Quick Links
          </h3>
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-row flex-wrap gap-4 font-titleFont font-medium justify-center">
              {navLinksdata.map(({ _id, title, link }) => (
                <li key={_id}>
                  <FooterLink to={link}>{title}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ href, icon, ariaLabel }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className="bannerIcon hover:text-designColor transition-colors duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    spy={true}
    smooth={true}
    offset={-70}
    duration={500}
    className="text-lg relative hover:text-designColor duration-300 group cursor-pointer"
  >
    {children}
    <span className="w-0 h-[1px] bg-designColor inline-flex absolute left-0 -bottom-1 group-hover:w-full transition-all duration-300"></span>
  </Link>
);

export default Footer;

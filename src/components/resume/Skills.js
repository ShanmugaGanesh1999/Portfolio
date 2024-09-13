import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaNodeJs,
  FaJava,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaChevronLeft,
  FaChevronRight,
  FaAws,
  FaSeedling,
} from "react-icons/fa";
import {
  SiFigma,
  SiTailwindcss,
  SiBootstrap,
  SiSpringboot,
  SiMysql,
  SiPostgresql,
  SiApachekafka,
  SiRedis,
  SiTypescript,
  SiAngular,
  SiFlutter,
  SiExpress,
  SiC,
  SiHibernate,
  SiDatacamp,
  SiScikitlearn,
  SiTensorflow,
  SiOpenai,
} from "react-icons/si";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { DiMongodb } from "react-icons/di";
import { BsCalendarCheck } from "react-icons/bs";
import { AiOutlineCloudServer } from "react-icons/ai";

const Skills = () => {
  const [currentSkillSet, setCurrentSkillSet] = useState(0);

  const otherSkills = [
    { name: "Photography", percentage: 70, icon: <MdOutlinePhotoCamera /> },
    { name: "Gardening", percentage: 30, icon: <FaSeedling /> },
  ];

  const skillSets = [
    {
      title: "Frontend Development",
      skills: [
        { name: "HTML 5", percentage: 95, icon: <FaHtml5 /> },
        { name: "CSS3", percentage: 80, icon: <FaCss3Alt /> },
        { name: "JavaScript", percentage: 90, icon: <FaJs /> },
        { name: "React", percentage: 70, icon: <FaReact /> },
        { name: "TypeScript", percentage: 90, icon: <SiTypescript /> },
        { name: "Angular", percentage: 75, icon: <SiAngular /> },
        { name: "Tailwind CSS", percentage: 35, icon: <SiTailwindcss /> },
        { name: "Bootstrap", percentage: 70, icon: <SiBootstrap /> },
        { name: "Figma", percentage: 35, icon: <SiFigma /> },
      ],
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js", percentage: 80, icon: <FaNodeJs /> },
        { name: "Express.js", percentage: 70, icon: <SiExpress /> },
        { name: "Java", percentage: 85, icon: <FaJava /> },
        { name: "Spring Boot", percentage: 80, icon: <SiSpringboot /> },
        { name: "Python", percentage: 70, icon: <FaPython /> },
        { name: "C", percentage: 90, icon: <SiC /> },
        { name: "Hibernate", percentage: 80, icon: <SiHibernate /> },
      ],
    },
    {
      title: "Database & Storage",
      skills: [
        { name: "MongoDB", percentage: 70, icon: <DiMongodb /> },
        { name: "MySQL", percentage: 90, icon: <SiMysql /> },
        { name: "PostgreSQL", percentage: 70, icon: <SiPostgresql /> },
        { name: "Redis", percentage: 85, icon: <SiRedis /> },
      ],
    },
    {
      title: "DevOps & Cloud",
      skills: [
        { name: "Git", percentage: 70, icon: <FaGitAlt /> },
        { name: "GitHub", percentage: 70, icon: <FaGithub /> },
        { name: "Docker", percentage: 60, icon: <FaDocker /> },
        { name: "Kafka", percentage: 75, icon: <SiApachekafka /> },
        {
          name: "Microservices",
          percentage: 80,
          icon: <AiOutlineCloudServer />,
        },
        { name: "AWS", percentage: 70, icon: <FaAws /> },
      ],
    },
    {
      title: "Mobile & Other",
      skills: [
        { name: "Flutter", percentage: 60, icon: <SiFlutter /> },
        { name: "MEAN Stack", percentage: 80, icon: <SiAngular /> },
        { name: "MERN Stack", percentage: 70, icon: <FaReact /> },
        { name: "DSA", percentage: 85, icon: <SiDatacamp /> },
        { name: "ML", percentage: 75, icon: <SiScikitlearn /> },
        { name: "DL", percentage: 90, icon: <SiTensorflow /> },
        { name: "Transformer", percentage: 70, icon: <SiOpenai /> },
        { name: "LLM", percentage: 65, icon: <SiOpenai /> },
        { name: "Scheduler", percentage: 70, icon: <BsCalendarCheck /> },
      ],
    },
  ];

  const renderSkills = (skills) => {
    return skills.map((skill, index) => (
      <div key={index} className="overflow-x-hidden">
        <p className="text-sm uppercase font-medium flex items-center">
          {skill.icon && <span className="mr-2">{skill.icon}</span>}
          {skill.name}
        </p>
        <span className="w-full h-2 bgOpacity rounded-md inline-flex mt-2">
          <motion.span
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-600 via-pink-500 to-red-500 rounded-md relative"
            style={{ width: `${skill.percentage}%` }}
          >
            <span className="absolute -top-7 right-0">{skill.percentage}%</span>
          </motion.span>
        </span>
      </div>
    ));
  };

  const nextSkillSet = () => {
    setCurrentSkillSet((prev) => (prev + 1) % skillSets.length);
  };

  const prevSkillSet = () => {
    setCurrentSkillSet(
      (prev) => (prev - 1 + skillSets.length) % skillSets.length
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col lgl:flex-row gap-10 lgl:gap-20"
    >
      <div className="w-full lgl:w-1/2">
        <div className="py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px] uppercase">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Other Skills</h2>
        </div>
        <div className='className="mt-14 w-full flex flex-col gap-6'>
          {renderSkills(otherSkills)}
        </div>
      </div>

      <div className="w-full lgl:w-1/2">
        <div className="py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px] uppercase">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Development Skills</h2>
        </div>
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSkillSet}
            className="text-2xl text-designColor"
          >
            <FaChevronLeft />
          </motion.button>
          <h3 className="text-xl font-semibold">
            {skillSets[currentSkillSet].title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSkillSet}
            className="text-2xl text-designColor"
          >
            <FaChevronRight />
          </motion.button>
        </div>
        <motion.div
          key={currentSkillSet}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {renderSkills(skillSets[currentSkillSet].skills)}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Skills;

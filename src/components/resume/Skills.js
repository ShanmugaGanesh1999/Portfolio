import React, { useEffect, useState, useCallback } from "react";
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
  SiSpringboot,
  SiMysql,
  SiPostgresql,
  SiApachekafka,
  SiRedis,
  SiTypescript,
  SiAngular,
  SiHibernate,
  SiScikitlearn,
  SiTensorflow,
  SiOpenai,
  SiExpress,
  SiEmberdotjs,
} from "react-icons/si";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { DiMongodb } from "react-icons/di";
import { AiOutlineCloudServer } from "react-icons/ai";

const Skills = () => {
  const [currentSkillSet, setCurrentSkillSet] = useState(0);

  const otherSkills = [
    { name: "Photography", percentage: 60, icon: <MdOutlinePhotoCamera /> },
    { name: "Gardening", percentage: 45, icon: <FaSeedling /> },
  ];

  const skillSets = [
    {
      title: "Frontend Development",
      skills: [
        { name: "React.js", percentage: 90, icon: <FaReact /> },
        { name: "Angular", percentage: 80, icon: <SiAngular /> },
        { name: "Ember.js", percentage: 70, icon: <SiEmberdotjs /> },
        { name: "HTML5", percentage: 95, icon: <FaHtml5 /> },
        { name: "CSS3", percentage: 85, icon: <FaCss3Alt /> },
        { name: "JavaScript", percentage: 90, icon: <FaJs /> },
        { name: "TypeScript", percentage: 85, icon: <SiTypescript /> },
      ],
    },
    {
      title: "Backend & APIs",
      skills: [
        { name: "Java", percentage: 90, icon: <FaJava /> },
        { name: "Spring Boot", percentage: 85, icon: <SiSpringboot /> },
        { name: "Hibernate", percentage: 80, icon: <SiHibernate /> },
        { name: "Python", percentage: 80, icon: <FaPython /> },
        { name: "FastAPI", percentage: 70, icon: <FaPython /> },
        { name: "Node.js", percentage: 80, icon: <FaNodeJs /> },
        { name: "REST APIs", percentage: 90, icon: <SiExpress /> },
        { name: "GraphQL", percentage: 70, icon: <SiExpress /> },
        { name: "JWT Auth", percentage: 80, icon: <SiExpress /> },
        { name: "WebSockets", percentage: 70, icon: <SiExpress /> },
        { name: "NIO/Concurrency", percentage: 75, icon: <FaJava /> },
      ],
    },
    {
      title: "Databases & Messaging",
      skills: [
        { name: "PostgreSQL", percentage: 85, icon: <SiPostgresql /> },
        { name: "MySQL", percentage: 90, icon: <SiMysql /> },
        { name: "MongoDB", percentage: 80, icon: <DiMongodb /> },
        { name: "DynamoDB", percentage: 60, icon: <SiRedis /> },
        { name: "Redis", percentage: 75, icon: <SiRedis /> },
        { name: "Kafka", percentage: 70, icon: <SiApachekafka /> },
        { name: "RabbitMQ", percentage: 65, icon: <SiApachekafka /> },
      ],
    },
    {
      title: "Cloud & DevOps",
      skills: [
        {
          name: "AWS (EC2, S3, RDS, Lambda, Lightsail)",
          percentage: 75,
          icon: <FaAws />,
        },
        { name: "Firebase", percentage: 60, icon: <FaReact /> },
        { name: "Docker", percentage: 80, icon: <FaDocker /> },
        { name: "GitHub Actions", percentage: 70, icon: <FaGithub /> },
        { name: "CI/CD", percentage: 75, icon: <FaGithub /> },
      ],
    },
    {
      title: "Machine Learning & AI",
      skills: [
        { name: "scikit-learn", percentage: 70, icon: <SiScikitlearn /> },
        { name: "BERT", percentage: 60, icon: <SiOpenai /> },
        { name: "GPT", percentage: 65, icon: <SiOpenai /> },
        { name: "RAG", percentage: 60, icon: <SiOpenai /> },
        { name: "ML Personalization", percentage: 70, icon: <SiTensorflow /> },
      ],
    },
    {
      title: "Testing & Automation",
      skills: [
        { name: "PyTest", percentage: 70, icon: <FaPython /> },
        { name: "React Testing Library", percentage: 75, icon: <FaReact /> },
        { name: "JUnit", percentage: 80, icon: <FaJava /> },
        { name: "Integration Testing", percentage: 75, icon: <FaJava /> },
        {
          name: "GitHub Actions Pipelines",
          percentage: 70,
          icon: <FaGithub />,
        },
      ],
    },
    {
      title: "System Design & Architecture",
      skills: [
        {
          name: "Microservices",
          percentage: 80,
          icon: <AiOutlineCloudServer />,
        },
        {
          name: "Distributed Systems",
          percentage: 75,
          icon: <AiOutlineCloudServer />,
        },
        {
          name: "Real-time Systems",
          percentage: 70,
          icon: <AiOutlineCloudServer />,
        },
        { name: "API Optimization", percentage: 75, icon: <SiExpress /> },
        { name: "Performance Tuning", percentage: 70, icon: <SiExpress /> },
      ],
    },
    {
      title: "Tools & Practices",
      skills: [
        { name: "Git", percentage: 85, icon: <FaGitAlt /> },
        { name: "Jira", percentage: 70, icon: <FaReact /> },
        { name: "Zoho", percentage: 60, icon: <FaReact /> },
        { name: "Agile (Scrum, Kanban)", percentage: 80, icon: <FaReact /> },
        {
          name: "Cross-functional Collaboration",
          percentage: 85,
          icon: <FaReact />,
        },
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

  const nextSkillSet = useCallback(() => {
    setCurrentSkillSet((prev) => (prev + 1) % skillSets.length);
  }, [skillSets.length]);

  const prevSkillSet = () => {
    setCurrentSkillSet(
      (prev) => (prev - 1 + skillSets.length) % skillSets.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSkillSet, 5000);
    return () => clearInterval(interval);
  }, [nextSkillSet]);

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

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaDatabase,
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
  SiEmberdotjs,
  SiGo,
  SiFastapi,
  SiFirebase,
  SiRabbitmq,
  SiNextdotjs,
  SiFlutter,
  SiGraphql,
  SiJsonwebtokens,
  SiOracle,
  SiKubernetes,
  SiHelm,
  SiCelery,
  SiJira,
  SiSalesforce,
  SiZoho,
  SiPytest,
  SiJunit5,
  SiTestinglibrary,
  SiReactivex,
} from "react-icons/si";
import {
  MdOutlinePhotoCamera,
  MdArchitecture,
  MdOutlineSecurity,
} from "react-icons/md";
import { DiMongodb } from "react-icons/di";
import { AiOutlineCloudServer, AiOutlineApi } from "react-icons/ai";
import { TbApi } from "react-icons/tb";

const Skills = () => {
  const [currentSkillSet, setCurrentSkillSet] = useState(0);

  const otherSkills = [
    { name: "Photography", percentage: 60, icon: <MdOutlinePhotoCamera /> },
    { name: "Gardening", percentage: 45, icon: <FaSeedling /> },
  ];

  const skillSets = [
    {
      title: "Languages & Frameworks",
      skills: [
        { name: "Java", percentage: 90, icon: <FaJava /> },
        { name: "Go", percentage: 80, icon: <SiGo /> },
        { name: "Python", percentage: 90, icon: <FaPython /> },
        { name: "JavaScript", percentage: 90, icon: <FaJs /> },
        { name: "TypeScript", percentage: 85, icon: <SiTypescript /> },
        { name: "Spring Boot", percentage: 85, icon: <SiSpringboot /> },
        { name: "Hibernate", percentage: 80, icon: <SiHibernate /> },
        { name: "FastAPI", percentage: 75, icon: <SiFastapi /> },
        { name: "Node.js", percentage: 80, icon: <FaNodeJs /> },
      ],
    },
    {
      title: "Frontend Development",
      skills: [
        { name: "React.js", percentage: 90, icon: <FaReact /> },
        { name: "Next.js", percentage: 85, icon: <SiNextdotjs /> },
        { name: "Angular", percentage: 75, icon: <SiAngular /> },
        { name: "RxJs", percentage: 70, icon: <SiReactivex /> },
        { name: "Ember.js", percentage: 65, icon: <SiEmberdotjs /> },
        { name: "HTML5", percentage: 95, icon: <FaHtml5 /> },
        { name: "CSS3", percentage: 90, icon: <FaCss3Alt /> },
        { name: "React Native", percentage: 75, icon: <FaReact /> },
        { name: "Flutter", percentage: 70, icon: <SiFlutter /> },
      ],
    },
    {
      title: "Backend & APIs",
      skills: [
        { name: "REST APIs", percentage: 90, icon: <AiOutlineApi /> },
        { name: "GraphQL", percentage: 80, icon: <SiGraphql /> },
        { name: "OAuth", percentage: 75, icon: <MdOutlineSecurity /> },
        {
          name: "JWT Authentication",
          percentage: 80,
          icon: <SiJsonwebtokens />,
        },
        { name: "API Versioning", percentage: 85, icon: <TbApi /> },
        { name: "WebSockets", percentage: 75, icon: <AiOutlineCloudServer /> },
        { name: "NIO", percentage: 70, icon: <FaJava /> },
        { name: "Threads/Concurrency", percentage: 75, icon: <FaJava /> },
      ],
    },
    {
      title: "Databases & Messaging",
      skills: [
        { name: "PostgreSQL", percentage: 85, icon: <SiPostgresql /> },
        { name: "MySQL", percentage: 90, icon: <SiMysql /> },
        { name: "MongoDB", percentage: 80, icon: <DiMongodb /> },
        { name: "DynamoDB", percentage: 70, icon: <FaAws /> },
        { name: "Redis", percentage: 75, icon: <SiRedis /> },
        { name: "Kafka", percentage: 75, icon: <SiApachekafka /> },
        { name: "RabbitMQ", percentage: 70, icon: <SiRabbitmq /> },
        { name: "Oracle", percentage: 75, icon: <SiOracle /> },
        { name: "SQL", percentage: 90, icon: <FaDatabase /> },
        { name: "Kinesis", percentage: 70, icon: <FaAws /> },
        { name: "Celery", percentage: 65, icon: <SiCelery /> },
      ],
    },
    {
      title: "Cloud & DevOps",
      skills: [
        {
          name: "AWS (ECS, EC2, S3, RDS, Lambda)",
          percentage: 85,
          icon: <FaAws />,
        },
        { name: "Firebase", percentage: 70, icon: <SiFirebase /> },
        { name: "Docker", percentage: 85, icon: <FaDocker /> },
        { name: "Kubernetes", percentage: 75, icon: <SiKubernetes /> },
        { name: "Helm", percentage: 70, icon: <SiHelm /> },
        { name: "GitHub Actions", percentage: 80, icon: <FaGithub /> },
        { name: "CI/CD", percentage: 80, icon: <FaGithub /> },
      ],
    },
    {
      title: "Machine Learning & AI",
      skills: [
        { name: "Scikit-learn", percentage: 75, icon: <SiScikitlearn /> },
        { name: "BERT", percentage: 70, icon: <SiTensorflow /> },
        { name: "GenAI/GPT", percentage: 80, icon: <SiOpenai /> },
        { name: "RAG", percentage: 75, icon: <SiOpenai /> },
        {
          name: "ML-powered personalization",
          percentage: 70,
          icon: <SiScikitlearn />,
        },
      ],
    },
    {
      title: "Testing & Automation",
      skills: [
        { name: "PyTest", percentage: 80, icon: <SiPytest /> },
        {
          name: "React Testing Library",
          percentage: 75,
          icon: <SiTestinglibrary />,
        },
        { name: "JUnit", percentage: 85, icon: <SiJunit5 /> },
        { name: "Integration Testing", percentage: 80, icon: <FaSeedling /> },
        {
          name: "GitHub Actions pipelines",
          percentage: 80,
          icon: <FaGithub />,
        },
      ],
    },
    {
      title: "System Design & Architecture",
      skills: [
        { name: "Microservices", percentage: 85, icon: <MdArchitecture /> },
        {
          name: "Distributed Systems",
          percentage: 80,
          icon: <AiOutlineCloudServer />,
        },
        {
          name: "Real-time Systems",
          percentage: 75,
          icon: <AiOutlineCloudServer />,
        },
        { name: "API Optimization", percentage: 80, icon: <TbApi /> },
        {
          name: "Performance Tuning",
          percentage: 75,
          icon: <AiOutlineCloudServer />,
        },
      ],
    },
    {
      title: "Tools & Practices",
      skills: [
        { name: "Git", percentage: 90, icon: <FaGitAlt /> },
        { name: "Jira", percentage: 85, icon: <SiJira /> },
        { name: "Zoho", percentage: 70, icon: <SiZoho /> },
        { name: "Salesforce", percentage: 65, icon: <SiSalesforce /> },
        { name: "Agile (Scrum, Kanban)", percentage: 90, icon: <FaSeedling /> },
        {
          name: "Cross-functional collaboration",
          percentage: 95,
          icon: <FaSeedling />,
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
            className="h-full bg-gradient-to-r from-[#ff014f] via-pink-500 to-red-500 rounded-md relative"
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
    const interval = setInterval(nextSkillSet, 8000);
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
        <div className="mt-14 w-full flex flex-col gap-6">
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSkillSet}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col gap-6"
          >
            {renderSkills(skillSets[currentSkillSet].skills)}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Skills;

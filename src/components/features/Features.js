import React from "react";
import { AiFillAppstore } from "react-icons/ai";
import { FaDatabase, FaBrain, FaTasks, FaCode } from "react-icons/fa";
import { SiProgress } from "react-icons/si";
import Title from "../layouts/Title";
import Card from "./Card";

const Features = () => {
  return (
    <section
      id="features"
      className="w-full py-20 border-b-[1px] border-b-black"
    >
      <Title title="Features" des="What I Do" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-20">
        <Card
          title="Problem Solving"
          des="Efficiently solve complex problems and optimize code for various applications."
          icon={<FaCode />}
        />
        <Card
          title="Full Stack Development"
          des="Build end-to-end web apps: frontend, backend, and everything between."
          icon={<AiFillAppstore />}
        />
        <Card
          title="System Architecture"
          des="Design scalable, efficient systems using modern technologies and best practices."
          icon={<SiProgress />}
        />
        <Card
          title="Query Optimization"
          des="Enhance database performance through efficient query design and optimization techniques."
          icon={<FaDatabase />}
        />
        <Card
          title="Task Offloading"
          des="Kafka, Redis, Scheduler: Efficient task distribution and processing for scalable systems."
          icon={<FaTasks />}
        />
        <Card
          title="Machine Learning Solutions"
          des="Develop ML models for data analysis, prediction, and automation."
          icon={<FaBrain />}
        />
      </div>
    </section>
  );
};

export default Features;

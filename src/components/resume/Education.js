import React from "react";
import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

const Education = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col lgl:flex-row gap-10 lgl:gap-20"
    >
      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">2015 - 2025</p>
          <h2 className="text-3xl md:text-4xl font-bold">Education Quality</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="MS in Computer Science"
            subTitle="Case Western Reserve University (2023 - 2025')"
            result="3.67/4"
            country="Cleveland - OH, USA"
            des={[
              "Participated in Tech Side Hustle program for entrepreneurship skills",
              "Active in programming and Quantum Computing clubs",
              "Teaching Assistant for advanced computer science courses",
              "Graduate Assistant in Undergraduate Research Office",
              "Database Specialist managing library systems",
            ]}
          />
          <ResumeCard
            title="B.Tech in Information Technology"
            subTitle="Anna University (2017 - 2021)"
            result="8.62/10"
            country="Chennai - TN, IND"
            des={[
              "Organized math club events and activities",
              "Participated in coding club projects",
              "Represented college in football tournaments",
            ]}
          />
          <ResumeCard
            title="12th"
            subTitle="Kamala Niketan Montessori School"
            country="Trichy - TN, IND"
            result="78.4/100"
            des={[
              "Conducted science experiments in club",
              "Played as defender in school football",
              "Participated in NCC training camps",
            ]}
          />
          <ResumeCard
            title="10th"
            subTitle="R.S.K Higher Secondary School"
            country="Trichy - TN, IND"
            result="7/10"
            des={[
              "Represented school in football tournaments",
              "Received support as LDA student",
              "Engaged in NCC activities and drills",
            ]}
          />
        </div>
      </div>
      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">2020 - 2023</p>
          <h2 className="text-3xl md:text-4xl font-bold">Job Experience</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Member Technical Staff"
            subTitle="Zoho Corporation - (2022 - 2023)"
            result="IND"
            country="Chennai - TN"
            des={[
              "Improved Tax Configuration page with API Versioning, reducing compatibility issues by 62% and enhancing user experience. Implemented changes on both client and server sides for seamless integration",
              "Developed a high-performance, non-blocking I/O validation rule system using multi-threading. This improved record validation during creation and updates, resulting in a 26% decrease in data discrepancies and increased overall system efficiency",
              "Created Rollup Summary feature for automatic aggregation of related lists onto parent fields. This innovation reduced manual data manipulation by 80%, saving teams an average of 13.5 hours per week in data processing time",
            ]}
          />
          <ResumeCard
            title="Jr. Associate"
            subTitle="Augusta Hitech Software Solutions - (2021 - 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Developed and deployed cross-platform and web applications for multiple clients. These projects increased user engagement and boosted client revenue by an average of 15%, demonstrating the impact of effective software solutions on business performance",
              "Engineered a classification neural network model to optimize lead assignment based on geographical regions. This innovation streamlined the sales process by automatically identifying the most suitable lead owner, improving response times and conversion rates",
            ]}
          />
          <ResumeCard
            title="Intern"
            subTitle="Augusta Hitech Software Solutions - (2020 - 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Assisted in a comprehensive market analysis project, focusing on customer demographics in key regions. This research provided valuable insights for targeted marketing strategies and product development",
              "Contributed to a strategic marketing initiative that significantly increased target audience engagement. Utilized data-driven approaches to identify effective communication channels and messaging, resulting in improved campaign performance",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Education;

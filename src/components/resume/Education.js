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
              "Selected participant of Tech Side Hustle (Spring ‘24) in Entrepreneur Educational Consortium",
              "Member of programming club",
              "Member of Quantum Computing club",
              "TA in CSDS 438 High Performance Data & Computing",
              "TA in CSDS 410 Analysis of Algorithms",
              "GA in Undergraduate Research Office (Intersection)",
              "Database & Debug Specialist for Access Services",
            ]}
          />
          <ResumeCard
            title="B.Tech in Information Technology"
            subTitle="Anna University (2017 - 2021)"
            result="8.62/10"
            country="Chennai - TN, IND"
            des={[
              "Member and organizer of math club",
              "Member of coding club",
              "College football team member",
            ]}
          />
          <ResumeCard
            title="12th"
            subTitle="Kamala Niketan Montessori School"
            country="Trichy - TN, IND"
            result="79.2/100"
            des={[
              "Science club member",
              "School football team member",
              "NCC cadet",
            ]}
          />
          <ResumeCard
            title="10th"
            subTitle="R.S.K Higher Secondary School"
            country="Trichy - TN, IND"
            result="7/10"
            des={["School football team member", "LDA student", "NCC cadet"]}
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
              "Revamped the Tax Configuration page, implementing client and server-side changes for seamless API Versioning Movement, which reduced compatibility issues by over 62% and significantly improved userexperience",
              "Spearheaded the development and implementation of a high-performing, non-blocking I/O (NIO) validationrule system within the API, incorporating multi-threading techniques to enable efficient validation of records during creation and updates, resulting in a significant 26% decrease in data discrepancies",
              "Designed and implemented Rollup Summary feature, enabling automatic aggregation of related lists onto a single field on parent, which reduced manual data manipulation by 80%, saving an average of 13.5 hours/week",
            ]}
          />
          <ResumeCard
            title="Jr. Associate"
            subTitle="Augusta Hitech Software Solutions - (2021 - 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Developed and deployed cross-platform applications and web applications for 5+ clients, driving increased user engagement and boosting revenue by 15% on average",
              "Developed a classification neural network model to identify the most appropriate lead owner for a given region, simplifying the sales process",
            ]}
          />
          <ResumeCard
            title="Intern"
            subTitle="Augusta Hitech Software Solutions - (2020 - 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Contributed to a market analysis project, examining customer demographics in key regions",
              "Played a key role in a strategic marketing initiative that boosted target audience engagement",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Education;

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
              "(xLab initiative) Spearheaded AI-driven customer service innovations on the Eaton project by developing a generative AI-powered chatbot for call center training and implementing AI analysis of call transcripts, enhancing agent readiness and service strategies",
              "Working as a RA focusing on AI-driven database & query optimization under professor and PhD student",
              "TA in CSDS 438 High Performance Data and Computing",
              "Developed end-to-end website for inter-college poster & presentation competition: Intersection",
              "TA in CSDS 410 Analysis of Algorithms",
              "Specialist in database and debugging for Access services (meal plans, case cash-CWRU banking system, parking-parking system, Harold-Master search system, SIS-student information system, T2-payment system)",
              "Selected participant of Tech Side Hustle (Spring ‘24) in Entrepreneur Educational Consortium",
              "Active member in programming and Quantum Computing clubs",
              "Member of programming club",
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
              "Revamped the 'Tax Configuration' page with client and server-side changes for API Versioning, reducing compatibility issues by 37%",
              "Engineered a high-performance NIO-based 'Validation Rule' system, enhancing efficiency by 26% and reducing data validation discrepancies",
              "Designed the 'Rollup Summary' feature using Kafka and Redis, automating data aggregation and reducing manual efforts by 80%, saving 13.5 hours per week",
              "Revamped the 'Recent Items' feature in the CRM, enabling efficient storage and retrieval of the 20 most recently accessed records per user, and optimized database queries for faster and more efficient filtering",
              "Utilized Kafka and Java for real-time data streaming and concurrent request handling, boosting performance by 20% and ensuring efficient communication between distributed systems",
              "Enhanced user experience by revamping the UI with ReactJS and TypeScript, improving visualization of automation reports, real-time bug tracking, and code maintainability",
            ]}
          />
          <ResumeCard
            title="Jr. Associate"
            subTitle="Augusta Hitech Software Solutions - (2021 - 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Developed and deployed cross-platform applications for multiple clients, resulting in a 12% revenue boost on average",
              "Enhanced lead allocation accuracy with machine learning algorithms, utilizing data preprocessing and model optimization, resulting in a quantified process improvement of 18%",
              "Coordinated cross-functional teams to streamline marketing and sales efforts in CRM, leading to a 10% increase in reach",
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

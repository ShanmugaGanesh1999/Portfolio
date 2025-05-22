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
            subTitle="Case Western Reserve University (Aug 2023 - May 2025)"
            result="3.78/4"
            country="Cleveland - OH, USA"
            des={[
              "(xLab initiative) Spearheaded AI-driven customer service innovations on the Eaton project by developing a generative AI-powered chatbot for call center training and implementing AI analysis of call transcripts, enhancing agent readiness and service strategies",
              "Working as a RA focusing on AI-driven database & query optimization under professor and PhD student",
              "TA in CSDS 438 High Performance Data and Computing",
              "TA in CSDS 341 Introduction to Database Systems",
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
            subTitle="Anna University (Aug 2017 - Apr 2021)"
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
          <p className="text-sm text-designColor tracking-[4px]">
            2020 - Present
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Job Experience</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Software Engineer (Full Stack Software Developer)"
            subTitle="Northen Trust - (Jan 2024 - Present)"
            result="USA"
            country="Cleveland - OH"
            des={[
              "Led development of a Market Data Aggregation Platform, achieving 95% feature clarity per sprint while ensuring compliance and data governance",
              "Built a Python backend using Django REST Framework, integrated with a React frontend, reducing response latency by 32% by optimizing query structures and reducing redundant calls",
              "Engineered real-time API data streams using WebSockets and Celery, achieving a data ingestion throughput of 1.8M records/hour, significantly reducing external API timeout errors by 47%",
              "Designed a PostgreSQL schema for multi-source aggregation with AES-256 encryption, improving data security and boosting query performance by 41% across 12 financial indices",
              "Implemented role-based access controls (RBAC), reducing unauthorized access incidents by 40% and improving audit compliance",
              "Developed 120+ automated tests using PyTest and React Testing Library, achieving 98.9% test coverage and cutting deployment rollback incidents by 78%",
              "Deployed using AWS ECS Fargate, S3, and RDS with Terraform for IaC, achieving 99.98% uptime with auto-scaling, reducing DevOps overhead by 36%",
            ]}
          />
          <ResumeCard
            title="Member Technical Staff (Full Stack Software Developer)"
            subTitle="Zoho Corporation - (Jan 2022 - Dec 2023)"
            result="IND"
            country="Chennai - TN"
            des={[
              "Enhanced Tax Configuration system with API versioning, reducing compatibility issues across 7 systems, lowering system downtime by 20 hours/month",
              "Built an NIO-based validation system, enhancing data processing speed to 2.3M records/hour and reducing validation errors from 1,200 to 660 daily",
              "Developed a Kafka/Redis-powered rollup summary, automating 6,500+ data aggregation tasks per week, saving 13.5 hours per record and reducing reporting delays by 3 hours per cycle",
              "Optimized CRM's Recent Items storage, reducing database load by 55% and improving real-time access to 20+ records per user session",
              "Enhanced UI with ReactJS/TypeScript, streamlining automation reports, reducing bug resolution time from 10 days to 7 days, and increasing user adoption by 28%",
              "Implemented a Kafka/Java data pipeline, achieving 99.9% uptime and reducing message processing latency from 120ms to 77ms, increasing system throughput to 1.2M events/minute",
            ]}
          />
          <ResumeCard
            title="Jr. Associate (Full Stack Software Developer)"
            subTitle="Augusta Hitech Software Solutions - (Nov 2020 - Dec 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Developed cross-platform apps with Flutter and Angular, reducing deployment time by 16% by optimizing component reuse and API integration",
              "Implemented ML-driven lead allocation using Python and scikit-learn, reducing manual errors by 22% and increasing sales efficiency by 20%",
              "Enhanced CRM marketing/sales workflows, improving lead conversion from 5,500 to 8,800 annually, and increasing customer engagement by 32%",
              "Aligned lead conversion workflows, increasing qualified lead retention by 60% and boosting sales revenue by $240,000 annually",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Education;

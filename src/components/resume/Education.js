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
        <div className="mt-6 lgl:mt-14 w-full h-auto border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
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
            2018 - Present
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Job Experience</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Senior Software Engineer"
            subTitle="Musk and Gale (Sep 2024 - Present)"
            result="USA"
            country="Cleveland - OH"
            des={[
              "Built a Python backend (Django REST Framework) and React frontend for a Market Data Aggregation Platform, reducing user response latency by 32%.",
              "Engineered real-time API data streams using WebSockets and Celery, improving data ingestion throughput to 1.8M records per hour.",
              "Deployed on AWS (ECS Fargate, Kubernetes, Helm) with S3 and RDS, achieving 99.98% uptime.",
            ]}
          />
          <ResumeCard
            title="MTS (Full Stack Software Developer - CRM)"
            subTitle="ZOHO Corporation (Jan 2022 - Dec 2023)"
            result="IND"
            country="Chennai - TN"
            des={[
              "Implemented a Kafka/Java data pipeline, reducing message processing latency from 120ms to 77ms and increasing system throughput to 1.2M events/minute.",
              "Optimized CRM's Recent Items storage, reducing database load by 55%.",
            ]}
          />
          <ResumeCard
            title="Junior Associate"
            subTitle="Augusta Hitech Software Solution (Nov 2018 - Dec 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Implemented ML-driven lead allocation using Python and scikit-learn, increasing sales efficiency by 20%.",
              "Increased qualified lead retention by 60%, boosting sales revenue by $240,000 annually.",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Education;

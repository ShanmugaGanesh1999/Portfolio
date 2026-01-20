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
          <p className="text-sm text-designColor tracking-[4px]">2017 - 2025</p>
          <h2 className="text-3xl md:text-4xl font-bold">Education Quality</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-auto border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="MS in Computer Science"
            subTitle="Case Western Reserve University (Aug 2023 - May 2025)"
            result="3.78/4.0"
            country="Cleveland - OH, USA"
            des={[
              "Master's in Computer Science (2025) with a 3.78/4.0 GPA.",
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
            2025 - Present
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Job Experience</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-auto border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Software Engineer (Fintech)"
            subTitle="Musk and Gale (Jun 2025 - Present)"
            result="USA"
            country="Cleveland - OH"
            des={[
              "Led development of a Market Data Aggregation Platform, achieving 95% feature clarity per sprint while ensuring compliance and data governance.",
              "Built a Python backend using Django REST Framework and integrated with a React frontend; reduced response latency by 32% by optimizing queries and eliminating redundant calls.",
              "Engineered real-time API data streams using WebSockets and Celery, achieving 1.8M records/hour ingestion throughput and reducing external API timeout errors by 47%.",
              "Designed a PostgreSQL schema for multi-source aggregation with AES-256 encryption, improving data security and boosting query performance by 41% across 12 financial indices.",
              "Implemented role-based access controls (RBAC), reducing unauthorized access incidents by 40% and improving audit compliance.",
              "Deployed using AWS ECS Fargate, S3, and RDS with Terraform for IaC; achieved 99.98% uptime with auto-scaling and reduced DevOps overhead by 36%.",
            ]}
          />
          <ResumeCard
            title="Access Services Specialist (Security Engineer)"
            subTitle="Case Western Reserve University (Jan 2024 - May 2025)"
            result="USA"
            country="Cleveland - OH"
            des={[
              "Led migration of CWRU Access Services authentication to a centralized IAM platform implementing OAuth2 SSO with Spring Security and Java microservices on AWS; reduced duplicate logins by 60% and authentication tickets by 35%.",
              "Engineered RBAC and attribute-based access policies for parking and campus services; cut manual entitlement reviews by 50% through Java-based policy engines and CI/CD configuration-as-code pipelines.",
              "Developed secure Java/Spring Boot APIs using OAuth2 resource server patterns and input validation; achieved sub-200ms response times and 99.9% uptime by tuning Oracle queries, caching auth decisions, and using CloudWatch dashboards.",
            ]}
          />
          <ResumeCard
            title="MTS (Full Stack Software Developer - CRM)"
            subTitle="ZOHO Corporation (Jan 2021 - Dec 2023)"
            result="IND"
            country="Chennai - IND"
            des={[
              "Enhanced Tax Configuration system with API versioning, reducing compatibility issues across 7 systems and lowering downtime by 20 hours/month.",
              "Built an NIO-based validation system, increasing data processing speed to 2.3M records/hour and reducing validation errors from 1,200 to 660 daily.",
              "Developed a Kafka/Redis-powered rollup summary, automating 6,500+ aggregation tasks/week and reducing reporting delays by 3 hours per cycle.",
              "Optimized CRM Recent Items storage, reducing database load by 55% and improving real-time access to 20+ records per user session.",
              "Implemented a Kafka/Java data pipeline, achieving 99.9% uptime and reducing message latency from 120ms to 77ms while increasing throughput to 1.2M events/minute.",
            ]}
          />
          <ResumeCard
            title="Junior Associate (Full Stack Software Developer)"
            subTitle="Augusta Hitech Software Solution (Nov 2018 - Dec 2020)"
            result="IND"
            country="Coimbatore - IND"
            des={[
              "Developed cross-platform apps with Flutter and Angular, reducing deployment time by 16% by optimizing component reuse and API integration.",
              "Implemented ML-driven lead allocation using Python and scikit-learn, reducing manual errors by 22% and increasing sales efficiency by 20%.",
              "Enhanced CRM marketing/sales workflows, improving lead conversion from 5,500 to 8,800 annually and increasing customer engagement by 32%.",
              "Aligned lead conversion workflows, increasing qualified lead retention by 60% and boosting sales revenue by $240,000 annually.",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Education;

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
              "Collaborated in Agile Scrum sprints to deliver an enterprise Market Data Aggregation Platform; led stakeholder requirement grooming and backlog refinement, achieving 95% feature clarity per sprint. Ensured alignment with data governance, security, and audit-ready documentation.",
              "Developed backend services using Java, Spring Boot, and REST APIs, integrating an Angular 8+ UI for interactive dashboards. Reduced user response latency by 32%, enabling real-time market visualization and dynamic filtering for 2,500+ daily users.",
              "Engineered real-time ingestion microservices using Spring Boot, WebSockets, and asynchronous processing with Kafka. Integrated third-party providers and internal services, improving throughput to 1.8M records/hour and reducing external API timeout errors by 47%.",
              "Designed and optimized PostgreSQL data models for multi-source aggregation; implemented encryption and role-based access control with Spring Security. Reduced unauthorized query risk and improved query performance by 41% across 12 financial indices.",
              "Created 120+ automated tests using JUnit 5, Mockito, and UI test suites for Angular. Implemented CI/CD with Jenkins and GitHub Actions, cutting deployment rollback incidents by 78% and sustaining 98.9% test coverage for critical modules.",
              "Deployed services on AWS using ECS Fargate, S3, RDS, and CloudWatch, with Terraform for IaC. Enabled autoscaling, reducing downtime to 3 seconds per spike and achieving 99.98% uptime, cutting DevOps overhead by 36%.",
            ]}
          />
          <ResumeCard
            title="MTS (Full Stack Software Developer - CRM)"
            subTitle="ZOHO Corporation (Jan 2022 - Aug 2024)"
            result="IND"
            country="Chennai - TN"
            des={[
              "Redesigned the Tax Configuration module with API versioning, backward compatibility, and microservices integration. Reduced downtime by 20 hours/month, shortened deployment time by 3 days/cycle, and supported 150,000 API requests daily across 7 connected systems.",
              "Built a high-performance validation engine using Java NIO, multithreading, and optimized batching. Increased processing speed to 2.3M records/hour, reduced validation errors from 1,200 to 660 daily, improved ingestion from 8s to 6.9s/batch, saving 240 engineer-hours/month.",
              "Developed a Kafka and Redis rollup service to automate aggregation workflows and reporting. Processed 6,500+ tasks/week, saving 13.5 hours/employee, reducing reporting delays by 3 hours/cycle, and lowering operational costs by $20k annually while improving accuracy.",
              "Optimized CRM Recent Items persistence using PostgreSQL indexing, caching, and API tuning. Reduced database load from 11,000 to 4,950 concurrent queries, improved response time from 250ms to 150ms, and enabled real-time access to 20+ records per session.",
              "Implemented a Java event-driven data pipeline using Kafka, improving distributed reliability and scalability. Achieved 99.9% uptime, reduced message latency from 120ms to 77ms, and increased throughput to 1.2M events/minute with resilient retry handling.",
              "Enhanced enterprise UI using Angular and TypeScript with reusable components for automation reporting. Reduced bug resolution time from 10 days to 7 days, increased active users from 3,200 to 4,100, and cut debugging time by 5 hours/issue through improved logging and UX.",
            ]}
          />
          <ResumeCard
            title="Full Stack Software Developer"
            subTitle="Augusta Hitech Software Solution (Nov 2018 - Dec 2021)"
            result="IND"
            country="Coimbatore - TN"
            des={[
              "Delivered cross-platform solutions using Angular and Node.js with standardized REST integration. Reduced deployment time from 6 weeks to 5 weeks, lowered post-launch issues from 220 to 194, reduced maintenance by $15k/quarter, and increased revenue by $120k annually.",
              "Implemented workflow optimization with Python and applied analytics models to improve allocation accuracy and throughput. Reduced manual errors from 450 to 351 monthly, accelerated conversion time from 5 days to 4.1 days, and increased qualified lead retention from 5,500 to 8,800 annually.",
              "Streamlined CRM sales and marketing workflows using integrated REST APIs, data normalization, and process automation. Expanded reach to 180,000+ customers, reduced campaign execution from 4 days to 3 days/cycle, minimized silos across 5 business units, and increased ROI by $240k annually.",
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Education;

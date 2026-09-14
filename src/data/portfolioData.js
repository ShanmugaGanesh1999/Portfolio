// ============================================================
// PORTFOLIO DATA — Single source of truth for all content
// External links are loaded from .env (VITE_ prefixed vars)
// Update .env to change URLs, or this file for other content
// ============================================================

export const PERSONAL = {
  name: "SHANMUGA GANESH",
  role: "Senior Full-Stack AI Software Engineer",
  specialty: ["Full Stack Engineering", "GenAI & LLM Workflows", "Data & Cloud Systems"],
  focus: "Building scalable enterprise applications with Java, Python, React, Next.js, and cloud platforms across Generative AI, LLM workflows, RAG, Databricks, backend APIs, distributed systems, and real time data pipelines",
  email: import.meta.env.VITE_EMAIL || "shanmugaganesh1999@gmail.com",
  phone: import.meta.env.VITE_PHONE || "(216) 466-6648",
  location: "Cleveland, OH",
  status: "8+ years Full Stack AI Software Engineering experience. Open to full-time opportunities.",
  resumeUrl: import.meta.env.VITE_RESUME_URL || "#",
  resumeLabel: "GET_RESUME.PDF",
  resumeVersion: "v2026_09_AI_REFRESH",
  calendlyUrl: import.meta.env.VITE_CALENDLY_URL || "#",
  socialLinks: {
    github: import.meta.env.VITE_GITHUB_URL || "https://github.com/ShanmugaGanesh1999",
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "https://linkedin.com/in/shanmuga-ganesh",
    leetcode: import.meta.env.VITE_LEETCODE_URL || "https://leetcode.com/u/Shanmuga_Ganesh/",
    website: import.meta.env.VITE_SITE_URL || "https://shanmugaganesh.dev",
  },
};

export const STATS = [
  { label: "EXP_YEARS", value: "8+", unit: "YEARS", color: "accent" },
  { label: "MICRO_QA", value: "-35", unit: "% FP", color: "success" },
  { label: "DB_PERF", value: "+41", unit: "%", color: "variable" },
  { label: "LEAD_RET", value: "+60", unit: "%", color: "keyword" },
];

export const ABOUT = {
  paragraphs: [
    "Full Stack AI Software Engineer with 8+ years of experience building scalable enterprise applications using Java, Python, React, Next.js, and cloud platforms. Experienced in Generative AI, LLM workflows, RAG, Databricks, backend APIs, distributed systems, and real time data pipelines.",
    "I focus on delivering reliable AI enabled products, automation, analytics, and high performance software platforms, from Databricks medallion pipelines and AI governance analytics across ~13k repositories to Django/React financial systems and high-throughput CRM services processing millions of records per hour.",
  ],
};

export const TECH_STACK = [
  {
    title: "Languages",
    status: "CORE",
    statusColor: "success",
    items: ["Java", "Python", "JavaScript / TypeScript", "SQL"],
  },
  {
    title: "Frontend",
    status: "UI",
    statusColor: "accent",
    items: ["React.js / Next.js", "Angular", "HTML5 / CSS3", "Responsive UI / Component Architecture"],
  },
  {
    title: "Backend_And_APIs",
    status: "SERVICES",
    statusColor: "variable",
    items: ["Spring Boot / Spring Security", "Django REST Framework / FastAPI", "Node.js / Hibernate", "REST APIs / GraphQL / WebSockets / API Versioning"],
  },
  {
    title: "AI_GenAI_ML",
    status: "CORE",
    statusColor: "keyword",
    items: ["Generative AI / GPT / BERT", "LLM Workflows / RAG / Prompt Engineering", "SDD & TDD / AI Assisted Workflows", "scikit-learn / ML Pipelines / Anomaly Detection"],
  },
  {
    title: "Security",
    status: "AUTH",
    statusColor: "keyword",
    items: ["Microsoft Entra ID / OIDC", "OAuth 2.0 / JWT", "RBAC / IAM", "Secure API Design"],
  },
  {
    title: "Data_And_Messaging",
    status: "STREAMS",
    statusColor: "func",
    items: ["Databricks / Data Pipelines", "PostgreSQL / MySQL", "MongoDB / DynamoDB / Redis", "Kafka / RabbitMQ / Event Driven"],
  },
  {
    title: "Cloud_Testing",
    status: "DEVOPS",
    statusColor: "success",
    items: ["AWS / Azure / Docker / GitHub Actions", "CI/CD / Integration Testing", "PyTest / JUnit / React Testing Library"],
  },
  {
    title: "Architecture",
    status: "DESIGN",
    statusColor: "variable",
    items: ["System Design / AI Application Architecture", "Data Architecture / ACID Transactions", "Performance Tuning / Scalability / Reliability", "Observability / Distributed Systems"],
  },
];

export const EXPERIENCE = [
  {
    period: "AUG 2026-PRES",
    title: "Senior Full-Stack AI Software Engineer FDE",
    company: "Sherwin Williams",
    location: "Cleveland, OH",
    description: [
      "Architecting the Cover the Codebase AI enablement platform using Next.js, Microsoft Entra ID, Docker, Azure PostgreSQL, and Databricks, supporting employee learning, AI adoption, engineering analytics, and gamification across approximately 50 change champions",
      "Engineering Databricks medallion pipelines across GitHub, GitHub Copilot, and application data, transforming pull requests, commits, AI usage, and learning activity into 23 standardized metrics, DORA measures, user insights, and leadership dashboards",
      "Building ACID transactional architecture with bidirectional delta synchronization between Azure PostgreSQL and Databricks Bronze and Gold, incorporating UTC timestamps, audit logging, batching, and failure recovery to strengthen consistency, traceability, scalability, and reliability",
      "Developing AI governance and token analytics for monthly usage, allocation, and cost per user, while measuring adoption, throughput, efficiency, quality, and DORA performance for an enterprise landscape of approximately 13k repositories",
    ],
    tags: ["NEXT.JS", "AZURE", "DATABRICKS", "AI"],
    tagColor: "accent",
  },
  {
    period: "MAR 2026-JUL 2026",
    title: "Software Engineer (Biotech)",
    company: "Case Western Reserve University",
    location: "Cleveland, OH",
    description: [
      "Built an AI assisted microbiome quality system, reducing false positive carryover by 35% through automated feature validation, statistical filtering, and metadata anomaly detection",
      "Engineered a Python HPC sequencing pipeline, reducing analysis turnaround by 30% across ingestion, quality control, taxonomy profiling, and microbiome analytics",
      "Designed ML ready microbiome data workflows, improving pipeline reproducibility by 40% through standardized metadata validation, automated quality checks, and structured execution logic",
    ],
    tags: ["PYTHON", "HPC", "MICROBIOME", "AI", "ML"],
    tagColor: "success",
  },
  {
    period: "JUN 2025-PRES",
    title: "Software Engineer (Fintech)",
    company: "Musk and Gale",
    location: "Cleveland, OH",
    description: [
      { text: "Led a Java and Python based Market Data Aggregation Platform, achieving 95% sprint feature clarity by translating market data, compliance, governance, and business rules into scalable engineering deliverables", projectId: "market-data", linkText: "Market Data Aggregation Platform" },
      "Built a Python Django REST backend with React, reducing API latency by 32% through query optimization, payload tuning, and cleaner frontend service calls",
      "Engineered real time API data streams using WebSockets and Celery, reaching 1.8M records per hour with reliable ingestion, retry handling, and timeout resilient integrations",
      "Designed PostgreSQL data models for secure financial aggregation, improving query performance by 41% through indexing, normalized schemas, and encrypted data handling",
    ],
    tags: ["JAVA", "PYTHON", "DJANGO", "REACT", "AWS"],
    tagColor: "success",
  },
  {
    period: "JAN 2022-DEC 2023",
    title: "MTS (Full Stack Software Developer - CRM)",
    company: "Zoho Corporation",
    location: "Chennai, India",
    description: [
      { text: "Revamped the Tax Configuration system using Java and API versioning technique, enabling backward compatible tax workflows across 7+ integrated systems", projectId: "tax-config", linkText: "Tax Configuration system" },
      { text: "Built Java NIO based Custom Validation Rules system for CRM record creation and edit flows, processing 2.3M records per hour with non blocking validation logic", projectId: "record-validation", linkText: "Custom Validation Rules" },
      { text: "Built a Kafka based Rollup Summary pipeline to instantly update parent aggregation fields from child record changes, processing up to 1.8M record events per second", projectId: "rollup-summary", linkText: "Rollup Summary" },
      { text: "Rebuilt Zoho CRM Recent Items storage to cache each user's latest 20 records, reducing retrieval latency by 50% for faster record navigation", projectId: "recent-items", linkText: "Recent Items" },
    ],
    tags: ["JAVA", "KAFKA", "REDIS", "MICROSERVICES"],
    tagColor: "keyword",
  },
  {
    period: "NOV 2018-DEC 2021",
    title: "Junior Associate (Full Stack Software Developer)",
    company: "Augusta Hitech Software Solution",
    location: "Coimbatore, India",
    description: [
      "Developed Angular and Node.js CRM modules for marketing and sales workflows, improving customer engagement by 32% through reusable UI components and API integrations",
      "Built Node.js lead allocation workflows with Angular dashboards, increasing qualified lead retention by 60% through automated routing and improved sales process visibility",
    ],
    tags: ["ANGULAR", "NODE.JS", "CRM", "API"],
    tagColor: "func",
  },
];

export const PROJECTS = [
  {
    title: "Cover the Codebase",
    subtitle: "AI_ENABLEMENT_PLATFORM",
    description:
      "Sherwin Williams AI enablement platform built on Next.js, Microsoft Entra ID, Docker, Azure PostgreSQL, and Databricks. Medallion pipelines transform GitHub and Copilot activity into 23 standardized metrics, DORA measures, and leadership dashboards across approximately 13k repositories.",
    status: "RESTRICTED",
    statusColor: "keyword",
    tags: ["NEXT.JS", "DATABRICKS", "AZURE", "GENAI"],
    proprietary: true,
    link: "#",
  },
  {
    title: "AI Assisted Microbiome Quality System",
    description:
      "Python and ML ready microbiome analytics workflows for quality validation, metadata anomaly detection, and HPC sequencing analysis. Reduced false positive carryover by 35%, analysis turnaround by 30%, and improved reproducibility by 40%.",
    status: "ACTIVE",
    statusColor: "success",
    tags: ["PYTHON", "AI", "MICROBIOME"],
    link: "#",
  },
  {
    title: "Market Data Aggregation Platform",
    description:
      "Java and Python based fintech platform with Python Django REST backend and React frontend. Reaches 1.8M records per hour via WebSockets and Celery, reduces API latency by 32%, and improves PostgreSQL query performance by 41%.",
    status: "DEPLOYED",
    statusColor: "accent",
    hasAsciiArt: true,
    link: "#",
  },
  {
    title: "OAuth2 SSO & IAM Platform",
    subtitle: "SECURITY_SUBSYSTEM",
    description:
      "Archived campus identity project using Spring Security, OAuth2/OIDC, and Java microservices. Reduced duplicate logins by 60%, authentication tickets by 35%, and achieved sub-200ms response times.",
    progress: 99,
    progressLabel: "UPTIME_SLA",
    progressColor: "keyword",
    link: "#",
  },
  {
    title: "Tax Configuration Engine",
    description:
      "Java and API versioning based CRM tax workflow across 7+ integrated systems. Paired with Java NIO validation at 2.3M records per hour and Kafka based rollup processing up to 1.8M record events per second.",
    status: "ACTIVE",
    statusColor: "success",
    tags: ["JAVA", "KAFKA", "REDIS"],
    link: "#",
  },
  {
    title: "CRM Lead Allocation Workflow",
    description:
      "Angular and Node.js CRM workflows for marketing and sales operations. Improved customer engagement by 32% and increased qualified lead retention by 60% through automated routing and clearer dashboard visibility.",
    highlight: "+60%",
    highlightLabel: "CONV_DELTA",
    status: "OPERATIONAL",
    statusColor: "func",
    link: "#",
  },
];

export const CERTIFICATIONS = [
  { name: "JAVA / SPRING BOOT", color: "keyword" },
  { name: "PYTHON / DJANGO", color: "success" },
  { name: "AI / RAG / LLM WORKFLOWS", color: "accent" },
  { name: "REST / GRAPHQL APIs", color: "variable" },
  { name: "KAFKA / REDIS", color: "func" },
  { name: "PYTEST / JUNIT / RTL", color: "comment" },
  { name: "DATABRICKS / AZURE", color: "accent", icon: "database" },
];

export const EDUCATION = [
  {
    institution: "Case Western Reserve University",
    degree: "MS Computer Science",
    detail: "GPA 3.78/4.0 | Cleveland, OH | January 2025",
    coursework: "Distributed Systems, Advanced Algorithms, OS, Networking, Database Management, Software Engineering",
  },
];

export const NAV_ITEMS = [
  { label: "index.sh", icon: "description", sectionId: "hero", folder: "Root_Directory" },
  { label: "bio.txt", icon: "person", sectionId: "about", folder: "about_me" },
  { label: "career.log", icon: "history", sectionId: "experience", folder: "about_me" },
  { label: "tech_stack.json", icon: "settings", sectionId: "expertise", folder: "Lib_Modules" },
  { label: "deployments.py", icon: "build", sectionId: "work", folder: "Lib_Modules" },
  { label: "rollup_summary.md", icon: "description", projectId: "rollup-summary", folder: "Projects" },
  { label: "tax_config.md", icon: "description", projectId: "tax-config", folder: "Projects" },
  { label: "record_validation.md", icon: "description", projectId: "record-validation", folder: "Projects" },
  { label: "recent_items.md", icon: "description", projectId: "recent-items", folder: "Projects" },
  { label: "market_data.md", icon: "description", projectId: "market-data", folder: "Projects" },
  { label: "campus_iam.md", icon: "description", projectId: "access-mgmt", folder: "Projects" },
  { label: "ml_lead_scoring.md", icon: "description", projectId: "ml-lead-scoring", folder: "Projects" },
];

export const ASCII_ART = `  ██████  ██░ ██  ▄▄▄       ███▄    █  ███▄ ▄███▓ █    ██   ▄████  ▄▄▄      
▒██    ▒ ▓██░ ██▒▒████▄     ██ ▀█   █ ▓██▒▀█▀ ██▒ ██  ▓██▒ ██▒ ▀█▒▒████▄    
░ ▓██▄   ▒██▀▀██░▒██  ▀█▄  ▓██  ▀█ ██▒▓██    ▓██░▓██  ▒██░▒██░▄▄▄░▒██  ▀█▄  
  ▒   ██▒░▓█ ░██ ░██▄▄▄▄██ ▓██▒  ▐▌██▒▒██    ▒██ ▓▓█  ░██░░▓█  ██▓░██▄▄▄▄██ 
▒██████▒▒░▓█▒░██▓ ▓█   ▓██▒▒██░   ▓██░▒██▒   ░██▒▒▒█████▓ ░▒▓███▀▒ ▓█   ▓██▒
▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒░   ▒ ▒ ░ ▒░   ░  ░░▒▓▒ ▒ ▒  ░▒   ▒  ▒▒   ▓▒█░
░ ░▒  ░ ░ ▒ ░▒░ ░  ▒   ▒▒ ░░ ░░   ░ ▒░░  ░      ░░░▒░ ░ ░   ░   ░   ▒   ▒▒ ░
░  ░  ░   ░  ░░ ░  ░   ▒      ░   ░ ░ ░      ░    ░░░ ░ ░ ░ ░   ░   ░   ▒   
      ░   ░  ░  ░      ░  ░         ░        ░      ░           ░       ░  
  ▄████  ▄▄▄       ███▄    █ ▓█████   ██████  ██░ ██ 
 ██▒ ▀█▒▒████▄     ██ ▀█   █ ▓█   ▀ ▒██    ▒ ▓██░ ██▒
▒██░▄▄▄░▒██  ▀█▄  ▓██  ▀█ ██▒▒███   ░ ▓██▄   ▒██▀▀██░
░▓█  ██▓░██▄▄▄▄██ ▓██▒  ▐▌██▒▒▓█  ▄   ▒   ██▒░▓█ ░██ 
░▒▓███▀▒ ▓█   ▓██▒▒██░   ▓██░░▒████▒▒██████▒▒░▓█▒░██▓
 ░▒   ▒  ▒▒   ▓▒█░░ ▒░   ▒ ▒ ░░ ▒░ ░▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒
  ░   ░   ▒   ▒▒ ░░ ░░   ░ ▒░ ░ ░  ░░ ░▒  ░ ░ ▒ ░▒░ ░
░ ░   ░   ░   ▒      ░   ░ ░    ░   ░  ░  ░   ░  ░░ ░
      ░       ░  ░         ░    ░  ░      ░   ░  ░  ░`;

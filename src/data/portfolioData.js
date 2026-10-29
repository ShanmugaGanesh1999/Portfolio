// ============================================================
// PORTFOLIO DATA — Single source of truth for all content
// Social and scheduling links are loaded from .env (VITE_ prefixed vars)
// Resume and email follow the published resume
// ============================================================

export const PERSONAL = {
  name: "SHANMUGA GANESH",
  role: "Senior Full-Stack AI and Data Engineer",
  specialty: ["Full Stack AI Engineering", "Data Engineering & Lakehouse", "Entity Resolution & MDM"],
  focus: "Building enterprise, fintech, healthcare, and AI platforms with Java, Python, PySpark, React, Next.js, and AWS. Leading engineering teams on data pipelines, entity resolution, and customer-facing APIs.",
  email: "1999ganesh2@gmail.com",
  phone: import.meta.env?.VITE_PHONE || "(216) 466-6648",
  location: "Cleveland, OH",
  status: "8+ years of full-stack AI and data engineering experience. Open to full-time opportunities.",
  resumeUrl: "/Shanmuga_Ganesh_Resume.pdf",
  resumeLabel: "GET_RESUME.PDF",
  resumeVersion: "v2026_10_AI_DATA",
  calendlyUrl: import.meta.env?.VITE_CALENDLY_URL || "#",
  socialLinks: {
    github: import.meta.env?.VITE_GITHUB_URL || "https://github.com/ShanmugaGanesh1999",
    linkedin: import.meta.env?.VITE_LINKEDIN_URL || "https://linkedin.com/in/shanmuga-ganesh",
    leetcode: import.meta.env?.VITE_LEETCODE_URL || "https://leetcode.com/u/Shanmuga_Ganesh/",
    website: import.meta.env?.VITE_SITE_URL || "https://shanmugaganesh.dev",
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
    "Senior Full-Stack AI and Data Engineer with 8+ years of experience building enterprise, fintech, healthcare, and AI platforms. I work with Java, Python, PySpark, React, Next.js, and AWS.",
    "I lead engineering teams on Sherwin-Williams' AI-SDLC platform for 2K+ learners. My work spans Databricks Medallion pipelines, Spark performance tuning, and entity matching that resolves records into canonical IDs.",
    "I built a security master for fintech market data and clinical research pipelines with record linkage, deduplication, and data quality scoring. I focus on distributed systems, big data engineering, customer-facing APIs, and technical leadership.",
  ],
};

export const TECH_STACK = [
  {
    title: "Languages",
    status: "CORE",
    statusColor: "success",
    items: ["Java", "Python", "TypeScript / JavaScript", "SQL"],
  },
  {
    title: "Frontend",
    status: "UI",
    statusColor: "accent",
    items: ["React / Next.js", "Angular", "HTML5 / CSS3"],
  },
  {
    title: "Backend_And_APIs",
    status: "SERVICES",
    statusColor: "variable",
    items: ["Spring Boot / Spring Security / Hibernate", "Django REST / FastAPI / Node.js / Celery", "REST / GraphQL / WebSockets / API Versioning", "Prisma / Drizzle ORM"],
  },
  {
    title: "Data_Engineering",
    status: "LAKEHOUSE",
    statusColor: "func",
    items: ["Databricks / Lakeflow Jobs / SQL / Dashboards / Unity Catalog", "Apache Spark / PySpark / Spark SQL / Spark Performance Tuning", "Delta Lake / Medallion Lakehouse / ETL / ELT", "Batch and Incremental Ingestion / Configurable Data Intake", "Parquet / Avro / Data Modeling / Data Quality / Data Quality Scoring"],
  },
  {
    title: "Entity_Resolution_And_MDM",
    status: "IDENTITY",
    statusColor: "keyword",
    items: ["Entity Matching / Record Linkage / Deduplication", "Fuzzy Matching / Canonical ID Assignment", "Master Data Management / Reference Data Management"],
  },
  {
    title: "Databases_And_Messaging",
    status: "STREAMS",
    statusColor: "func",
    items: ["PostgreSQL / Lakebase / MySQL", "MongoDB / DynamoDB / Redis", "Kafka / RabbitMQ", "Indexing / Transactions / Query Optimization"],
  },
  {
    title: "AI_And_ML",
    status: "AI",
    statusColor: "keyword",
    items: ["PyTorch / CUDA / scikit-learn", "GPT / BERT / RAG / LLM Workflows", "Prompt Engineering / OpenAI APIs", "ML Pipelines / Anomaly Detection"],
  },
  {
    title: "Cloud_And_DevOps",
    status: "DEVOPS",
    statusColor: "success",
    items: ["AWS / Azure", "Docker / Kubernetes", "GitHub Actions / CI/CD"],
  },
  {
    title: "Security_And_Testing",
    status: "QUALITY",
    statusColor: "accent",
    items: ["OAuth 2.0 / OIDC / PKCE / JWT / RBAC / IAM", "Microsoft Entra ID / Better Auth / SSO", "PyTest / JUnit / React Testing Library", "Integration / E2E / API / Performance Testing"],
  },
  {
    title: "Tools",
    status: "WORKFLOW",
    statusColor: "variable",
    items: ["Git / GitHub Copilot / Claude / OpenAI Codex", "SonarQube / SonarCloud", "ServiceNow / Jira"],
  },
  {
    title: "Architecture",
    status: "DESIGN",
    statusColor: "variable",
    items: ["Microservices / Distributed Systems / Event-Driven Architecture", "System Design / Technical Leadership", "Design Reviews / Mentoring"],
  },
];

export const EXPERIENCE = [
  {
    period: "AUG 2026-PRES",
    title: "Senior Software Engineer - FullStack AI FDE",
    company: "Sherwin-Williams",
    location: "Cleveland, OH",
    description: [
      "Led a team of 5 engineers on Cover the Codebase, an AI-SDLC platform for 2K+ learners. Owned design reviews, code reviews, and pipeline standards while building configurable intake across GitHub, Copilot, Claude, Codex, SonarQube/SonarCloud, ServiceNow, and Jira.",
      "Built an entity matching service that resolved 2M+ records from GitHub, Entra ID, Pluralsight, and Copilot into canonical learner IDs. Deterministic and fuzzy matching, deduplication, and identity mapping achieved a 98% match rate.",
      "Architected Databricks Medallion pipelines processing 1.3M+ daily events with PySpark, Delta Lake, Unity Catalog, and Lakeflow Jobs. Partitioning, broadcast joins, skew handling, and Z-ordering cut runtime by 33% across 23 adoption metrics.",
      "Designed Lakebase PostgreSQL schemas with data quality scoring, status assignment, and correction-aware upserts for downstream dashboards. Load-tested at 5.4M rows and 2K concurrent queries.",
    ],
    tags: ["PYSPARK", "DATABRICKS", "LAKEBASE", "ENTITY MATCHING", "AI"],
    tagColor: "accent",
  },
  {
    period: "MAR 2026-JUL 2026",
    title: "Software Engineer (Healthcare Research)",
    company: "Case Western Reserve University",
    location: "Cleveland, OH",
    description: [
      "Built an AI-assisted quality system for clinical microbiome research data. Feature validation, statistical filtering, and metadata anomaly detection reduced false-positive carryover by 35% across 32K+ HMP samples totaling 48+ TB.",
      "Engineered a Python HPC sequencing pipeline with QIIME2 and DADA2 for clinical sample ingestion, quality control, and taxonomy profiling. Scalable, reproducible execution cut analysis turnaround by 30%.",
      "Standardized clinical metadata and sample records across research cohorts with validation rules, deduplication, and automated quality checks. Improved pipeline reproducibility by 40% and produced ML-ready healthcare datasets.",
    ],
    tags: ["PYTHON", "HPC", "QIIME2", "DADA2", "DATA QUALITY"],
    tagColor: "success",
  },
  {
    period: "JUN 2025-PRES",
    title: "Software Engineer (Fintech)",
    company: "Musk and Gale",
    location: "Cleveland, OH",
    description: [
      { text: "Led a 3-engineer team on a Java and Python Market Data Aggregation Platform, owning architecture and design reviews. Built a security master matching 3.1M+ instruments across 40 vendor feeds by CUSIP, ISIN, and ticker into canonical IDs.", projectId: "market-data", linkText: "Market Data Aggregation Platform" },
      "Built Django REST APIs and React interfaces for customer-facing and internal self-service tools. Query optimization, payload tuning, and cleaner service calls reduced API latency by 32%.",
      "Engineered configurable ingestion with WebSockets and Celery to onboard vendor feeds through schema reconciliation without code changes. Processed 1.8M records per hour, or 43M+ daily, with retry handling and fault tolerance.",
      "Designed PostgreSQL data models over 45M+ rows with validation and quality scoring rules. Improved query performance by 41% and set data-modeling standards for the team.",
    ],
    tags: ["JAVA", "PYTHON", "DJANGO", "REACT", "MDM"],
    tagColor: "success",
  },
  {
    period: "JAN 2022-DEC 2023",
    title: "MTS (Full Stack Software Developer - CRM)",
    company: "ZOHO Corporation",
    location: "Chennai, India",
    description: [
      { text: "Revamped the Tax Configuration system using Java and API versioning. Enabled backward-compatible tax workflows across 7+ integrated systems with scalable design and reliable release management.", projectId: "tax-config", linkText: "Tax Configuration system" },
      { text: "Built a Java NIO Custom Validation Rules system for CRM record creation and edit flows. Processed 1.47+M records per day with non-blocking validation and high-throughput execution.", projectId: "record-validation", linkText: "Custom Validation Rules" },
      { text: "Built a Kafka-based Rollup Summary pipeline to update parent aggregation fields from child record changes. Processed 13+M record events per day with an event-driven architecture.", projectId: "rollup-summary", linkText: "Rollup Summary" },
      { text: "Rebuilt Zoho CRM Recent Items storage to cache each user's latest 20 records. Reduced retrieval latency by 50% and improved record navigation.", projectId: "recent-items", linkText: "Recent Items" }
    ],
    tags: ["JAVA", "NIO", "KAFKA", "API VERSIONING"],
    tagColor: "keyword",
  },
  {
    period: "NOV 2018-DEC 2021",
    title: "Junior Associate (Full Stack Software Developer)",
    company: "Augusta Hitech Software Solution",
    location: "Coimbatore, India",
    description: [
      "Developed Angular and Node.js CRM modules for marketing and sales workflows. Reusable UI components, scalable APIs, and workflow automation improved customer engagement by 32%.",
      "Built Node.js lead allocation workflows with Angular dashboards. Automated routing, real-time visibility, and improved sales execution increased qualified lead retention by 60%.",
    ],
    tags: ["ANGULAR", "NODE.JS", "CRM", "API"],
    tagColor: "func",
  },
];

export const PROJECTS = [
  {
    title: "Cover the Codebase",
    subtitle: "AI_SDLC_PLATFORM",
    description:
      "AI-SDLC platform for 2K+ learners, led by a 5-engineer team. Entity matching resolved 2M+ records with a 98% match rate. Databricks Medallion pipelines process 1.3M+ daily events across 23 adoption metrics, with Spark tuning reducing runtime by 33%.",
    status: "RESTRICTED",
    statusColor: "keyword",
    tags: ["PYSPARK", "DATABRICKS", "LAKEBASE", "ENTITY MATCHING"],
    proprietary: true,
    link: "#",
  },
  {
    title: "AI Assisted Microbiome Quality System",
    description:
      "Clinical microbiome quality system covering 32K+ HMP samples and 48+ TB. Python HPC pipelines use QIIME2 and DADA2. Reduced false-positive carryover by 35%, analysis turnaround by 30%, and improved reproducibility by 40%.",
    status: "ACTIVE",
    statusColor: "success",
    tags: ["PYTHON", "AI", "MICROBIOME"],
    link: "#",
  },
  {
    title: "Market Data Aggregation Platform",
    description:
      "Java and Python fintech platform with a security master matching 3.1M+ instruments across 40 vendor feeds. Configurable ingestion processes 1.8M records per hour. Django REST and React tools reduce API latency by 32%, while PostgreSQL query performance improves by 41% across 45M+ rows.",
    status: "DEPLOYED",
    statusColor: "accent",
    hasAsciiArt: true,
    link: "#",
  },
  {
    title: "OAuth2 SSO & IAM Platform",
    subtitle: "SECURITY_SUBSYSTEM",
    description:
      "Archived campus identity project using Spring Security, OAuth2/OIDC, and Java microservices.",
    status: "ARCHIVED",
    statusColor: "keyword",
    link: "#",
  },
  {
    title: "Tax Configuration Engine",
    description:
      "Java and API versioning support backward-compatible CRM tax workflows across 7+ integrated systems. Related CRM systems process 1.47+M validation records per day and 13+M rollup record events per day.",
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
  { name: "DATABRICKS / PYSPARK / DELTA LAKE", color: "accent", icon: "database" },
  { name: "ENTITY RESOLUTION / MDM", color: "variable" },
  { name: "TECHNICAL LEADERSHIP", color: "success" },
];

export const EDUCATION = [
  {
    institution: "Case Western Reserve University",
    degree: "MS Computer Science",
    detail: "GPA 3.78 | Cleveland, OH | 2025",
    coursework: "",
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

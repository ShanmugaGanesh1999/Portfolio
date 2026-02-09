// ============================================================
// PORTFOLIO DATA — Single source of truth for all content
// External links are loaded from .env (VITE_ prefixed vars)
// Update .env to change URLs, or this file for other content
// ============================================================

export const PERSONAL = {
  name: "SHANMUGA GANESH",
  role: "Backend / Full Stack Engineer",
  specialty: ["Backend Systems", "Distributed Architecture", "Cloud Infrastructure"],
  focus: "Architecting robust backend systems & scalable full-stack platforms with Java, Python, Spring Boot & AWS",
  email: import.meta.env.VITE_EMAIL || "shanmugaganesh1999@gmail.com",
  phone: import.meta.env.VITE_PHONE || "(216) 466-6648",
  location: "Cleveland, OH",
  status: "7+ years Backend & Full Stack experience. Open to full-time opportunities.",
  resumeUrl: import.meta.env.VITE_RESUME_URL || "#",
  resumeLabel: "GET_RESUME.PDF",
  resumeVersion: "v3.0_FINAL_BUILD",
  calendlyUrl: import.meta.env.VITE_CALENDLY_URL || "#",
  socialLinks: {
    github: import.meta.env.VITE_GITHUB_URL || "https://github.com",
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "https://linkedin.com",
    leetcode: import.meta.env.VITE_LEETCODE_URL || "https://leetcode.com/u/Shanmuga_Ganesh/",
  },
};

export const STATS = [
  { label: "CPU_UPTIME", value: "7+", unit: "YEARS", color: "accent" },
  { label: "THROUGHPUT", value: "1.8M", unit: "REC/HR", color: "success" },
  { label: "SYSTEM_SLA", value: "99.98", unit: "%", color: "variable" },
  { label: "LEAD_CONV", value: "+60", unit: "%", color: "keyword" },
];

export const ABOUT = {
  paragraphs: [
    "With 7+ years as a Backend & Full Stack Engineer, I architect, build, and deploy high-throughput backend systems and scalable web platforms. I hold a Master's in Computer Science from Case Western Reserve University and bring deep expertise in Java, Python, Spring Boot, Django, AWS, microservices, RESTful APIs, and real-time data processing.",
    "I consistently deliver secure, high-performance backend solutions in Agile environments — from designing distributed microservices and optimizing databases to building real-time data pipelines, engineering IAM platforms, and deploying cloud-native infrastructure that drives measurable business impact.",
  ],
};

export const TECH_STACK = [
  {
    title: "Languages",
    status: "CORE",
    statusColor: "success",
    items: ["Java", "Python", "JavaScript / TypeScript", "SQL / HTML5 / CSS3"],
  },
  {
    title: "Frameworks",
    status: "ENABLED",
    statusColor: "accent",
    items: ["Spring Boot / Spring Security", "Django / FastAPI", "React.js / Next.js / Angular", "Node.js / Hibernate"],
  },
  {
    title: "Cloud_&_DevOps",
    status: "STABLE",
    statusColor: "variable",
    items: ["AWS (EC2/S3/RDS/Lambda/ECS)", "Docker / Kubernetes", "Terraform / GitHub Actions", "CI/CD Pipelines"],
  },
  {
    title: "Data_&_Tools",
    status: "SYNCED",
    statusColor: "keyword",
    items: ["PostgreSQL / MySQL / TimescaleDB", "Redis / MongoDB / DynamoDB", "Kafka / RabbitMQ / WebSockets", "ElasticSearch / OAuth2 / JWT"],
  },
];

export const EXPERIENCE = [
  {
    period: "JUN 2025-PRES",
    title: "Software Engineer",
    company: "Musk and Gale",
    location: "Cleveland, OH",
    description: [
      { text: "Led development of Market Data Aggregation Platform, achieving 95% feature clarity per sprint", projectId: "market-data", linkText: "Market Data Aggregation Platform" },
      "Architected Python/Django REST backend integrated with React, reducing API latency by 32%",
      "Engineered real-time data streams via WebSockets & Celery processing 1.8M records/hour",
      "Deployed using AWS ECS Fargate with Terraform IaC, achieving 99.98% uptime",
    ],
    tags: ["PYTHON", "DJANGO", "REACT", "AWS", "TERRAFORM"],
    tagColor: "success",
  },
  {
    period: "JAN 2024-MAY 2025",
    title: "Access Services Specialist",
    company: "Case Western Reserve University",
    location: "Cleveland, OH",
    description: [
      { text: "Led migration to centralized IAM platform implementing OAuth2 SSO with Spring Security & Java microservices", projectId: "access-mgmt", linkText: "centralized IAM platform" },
      "Reduced duplicate logins by 60% through unified authentication architecture",
      "Engineered RBAC and attribute-based access policies, cutting manual reviews by 50%",
      "Achieved sub-200ms response times and 99.9% uptime across all identity services",
    ],
    tags: ["JAVA", "SPRING BOOT", "OAUTH2", "AWS", "ORACLE"],
    tagColor: "accent",
  },
  {
    period: "JAN 2022-DEC 2023",
    title: "MTS Full Stack Developer",
    company: "Zoho Corporation",
    location: "Chennai, India",
    description: [
      { text: "Enhanced Tax Configuration system with API versioning, reducing compatibility issues across 7 integrated systems", projectId: "tax-config", linkText: "Tax Configuration system" },
      { text: "Built NIO-based validation engine processing 2.3M records/hour", projectId: "record-validation", linkText: "validation engine" },
      { text: "Developed Kafka/Redis-powered rollup automating 6,500+ weekly aggregation tasks", projectId: "rollup-summary", linkText: "rollup" },
      "Implemented data pipeline achieving 99.9% uptime with 36% latency improvement",
      { text: "Designed Recent Items feature tracking user activity across all CRM modules with sub-100ms retrieval", projectId: "recent-items", linkText: "Recent Items" },
    ],
    tags: ["JAVA", "KAFKA", "REDIS", "MICROSERVICES"],
    tagColor: "keyword",
  },
  {
    period: "NOV 2018-DEC 2021",
    title: "Junior Associate (Full Stack Developer)",
    company: "Augusta HiTech Software Solution",
    location: "Coimbatore, India",
    description: [
      { text: "Implemented ML-driven lead allocation using Python & scikit-learn, reducing manual errors by 22%", projectId: "ml-lead-scoring", linkText: "ML-driven lead allocation" },
      { text: "Built backend APIs and data pipelines powering CRM workflows", projectId: "ml-lead-scoring", linkText: "backend APIs and data pipelines" },
      "Improved lead conversion from 5,500 to 8,800 annually (+60% increase)",
      "Generated $240,000 additional annual revenue through automation",
    ],
    tags: ["PYTHON", "ANGULAR", "FLUTTER", "ML"],
    tagColor: "func",
  },
];

export const PROJECTS = [
  {
    title: "Market Data Aggregation Platform",
    description:
      "Python/Django + React platform processing 1.8M records/hour via WebSockets & Celery. 32% API latency reduction, PostgreSQL with AES-256 encryption, deployed on AWS ECS Fargate with 99.98% uptime.",
    status: "DEPLOYED",
    statusColor: "accent",
    hasAsciiArt: true,
    link: "#",
  },
  {
    title: "OAuth2 SSO & IAM Platform",
    subtitle: "SECURITY_SUBSYSTEM",
    description:
      "Centralized Identity & Access Management using Spring Security, OAuth2/OIDC, and Java microservices. Reduced duplicate logins by 60%, authentication tickets by 35%, sub-200ms response times.",
    progress: 99,
    progressLabel: "UPTIME_SLA",
    progressColor: "keyword",
    link: "#",
  },
  {
    title: "Tax Configuration Engine",
    description:
      "API-versioned tax system across 7 integrated systems with NIO-based validation at 2.3M records/hour. Kafka/Redis rollup automating 6,500+ weekly aggregation tasks.",
    status: "ACTIVE",
    statusColor: "success",
    tags: ["JAVA", "KAFKA", "REDIS"],
    link: "#",
  },
  {
    title: "ML Lead Scoring & CRM Pipeline",
    description:
      "Python + scikit-learn ML-driven lead allocation integrated into CRM workflows. Boosted lead conversion from 5,500 to 8,800 annually (+60%), generating $240K additional revenue.",
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
  { name: "MICROSERVICES", color: "accent" },
  { name: "REST APIs", color: "variable" },
  { name: "KAFKA / REDIS", color: "func" },
  { name: "AGILE / SCRUM", color: "comment" },
];

export const EDUCATION = [
  {
    institution: "Case Western Reserve University",
    degree: "MS Computer Science",
    detail: "GPA 3.78/4.0 | Cleveland, OH | 2025",
    coursework: "Distributed Systems, Advanced Algorithms, OS, Networking, Database Management, Software Engineering",
  },
];

export const NAV_ITEMS = [
  { label: "index.sh", icon: "description", href: "#hero", section: "Root_Directory" },
  { label: "bio.txt", icon: "person", href: "#about", section: "about_me" },
  { label: "career.log", icon: "history", href: "#experience", section: "about_me" },
  { label: "tech_stack.json", icon: "settings", href: "#expertise", section: "Lib_Modules" },
  { label: "deployments.py", icon: "build", href: "#work", section: "Lib_Modules" },
  { label: "rollup_summary.md", icon: "description", projectId: "rollup-summary", section: "Projects" },
  { label: "tax_config.md", icon: "description", projectId: "tax-config", section: "Projects" },
  { label: "record_validation.md", icon: "description", projectId: "record-validation", section: "Projects" },
  { label: "recent_items.md", icon: "description", projectId: "recent-items", section: "Projects" },
  { label: "market_data.md", icon: "description", projectId: "market-data", section: "Projects" },
  { label: "campus_iam.md", icon: "description", projectId: "access-mgmt", section: "Projects" },
  { label: "ml_lead_scoring.md", icon: "description", projectId: "ml-lead-scoring", section: "Projects" },
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

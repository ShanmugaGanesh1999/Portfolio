# Portfolio Resume Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the visible portfolio, portfolio assistant knowledge base, SEO metadata, and resume download surface with the current resume/profile.

**Architecture:** The visible portfolio is driven mostly by `src/data/portfolioData.js`; the chatbot/RAG knowledge base is driven by `docs/*.md` loaded at build time by `src/data/masterPrompt.js`. Keep those two content layers synchronized from the same approved resume copy, and update static SEO in `index.html` separately because it is not data-driven.

**Tech Stack:** React 19, Vite, static markdown RAG via `import.meta.glob`, Tailwind CSS v4, Vite `VITE_*` environment variables.

---

## Source Status

The user-mentioned file path `/Users/sxt891/Downloads/Original SG Resume.pdf` was not present. Downloads currently did not contain a matching PDF.

I found a likely current resume at `/Users/sxt891/Documents/Jobs/Shanmuga Ganesh Resume.pdf`:

- PDF metadata title: `Original SG Resume`
- Created: `2026-06-17 13:14:46 EDT`
- Pages: 2
- Used for this draft mapping as a tentative source

Before implementation, confirm that `/Users/sxt891/Documents/Jobs/Shanmuga Ganesh Resume.pdf` is the resume version to sync into the portfolio.

## Current Content Storage Map

### Visible Portfolio UI

- `src/data/portfolioData.js`
  - `PERSONAL`: name, role, specialties, focus line, email, phone, location, status, resume label/version, external links
  - `STATS`: metric cards below hero
  - `ABOUT`: system overview/bio text
  - `TECH_STACK`: expertise grid
  - `EXPERIENCE`: career timeline
  - `PROJECTS`: project cards
  - `CERTIFICATIONS`: badge row
  - `EDUCATION`: education block, currently only data source but not visibly rendered by the default section list
  - `NAV_ITEMS`: sidebar project/section links

- `src/components/sections/*.jsx`
  - These mostly render `portfolioData.js`; they should need minimal logic changes.

- `src/components/layout/Sidebar.jsx`
  - Renders `NAV_ITEMS` and the external links from `PERSONAL`.

- `src/components/sections/Contact.jsx`
  - Uses `PERSONAL.email`, `PERSONAL.phone`, `PERSONAL.location`, `PERSONAL.status`, `PERSONAL.resumeUrl`, `PERSONAL.resumeLabel`, `PERSONAL.resumeVersion`, and `PERSONAL.calendlyUrl`.

### Portfolio Assistant / RAG Knowledge

- `src/data/masterPrompt.js`
  - Loads every top-level `docs/*.md` file at build time.
  - The prompt states that docs are the source of truth for assistant facts.
  - Do not hardcode new resume facts into the prompt.

- `docs/01_Shanmuga_Ganesh_Profile.md`
  - Main chatbot profile document. Mirrors `portfolioData.js` profile, skills, metrics, education, experience overview, and projects overview.

- `docs/02_Musk_and_Gale.md`
  - Musk and Gale role/project detail.

- `docs/03_Case_Western_Reserve_University.md`
  - Currently describes the old Case Western `Access Services Specialist` IAM role.

- `docs/04_Zoho_Corporation.md`
  - Zoho role/project details.

- `docs/05_Augusta_HiTech.md`
  - Augusta role/project details.

### SEO / Public Metadata

- `index.html`
  - Title, meta description, Open Graph, Twitter card, JSON-LD Person data.
  - Currently says 7+ years, Backend & Full Stack Engineer, GitHub Pages URL, and old GitHub/LinkedIn canonical values.

- `public/sitemap.xml`
  - Uses `https://shanmugaganesh.dev/` but `lastmod` is `2026-02-08`.

- `public/robots.txt`
  - Uses `https://shanmugaganesh.dev/sitemap.xml`.

### Environment Variables

- `.env.example`
  - Public link template for `VITE_GITHUB_URL`, `VITE_LINKEDIN_URL`, `VITE_RESUME_URL`, `VITE_CALENDLY_URL`, `VITE_EMAIL`, and `VITE_PHONE`.

- `.env.local`
  - Local ignored file with real values. Do not expose secrets in commits.
  - It uses `VITE_OPENROUTER_API_KEY`, which is browser-exposed by Vite. That security issue is outside this resume-refresh scope unless the user approves hardening.

## Resume-To-Portfolio Delta

### Headline And Summary

Resume now says:

- `Full Stack Software Engineer`
- `5+ years of experience`
- Java, Python, React, Angular, AWS
- AI assisted data workflows
- microbiome analytics
- backend APIs
- cloud systems
- real time data processing
- performance, automation, data quality, and system reliability

Current portfolio says:

- `Backend / Full Stack Engineer`
- `7+ years`
- Backend Systems, Distributed Architecture, Cloud
- Java, Python, Spring Boot, AWS

Recommended change:

- Make the visible site and assistant say `Full Stack Software Engineer with 5+ years of experience`.
- Shift positioning from only backend/distributed/cloud to full stack plus AI/data workflows, microbiome analytics, backend APIs, cloud systems, and real time processing.

### Contact And Links

Resume includes:

- Cleveland, Ohio
- `shanmugaganesh1999@gmail.com`
- `216-466-6648`
- LinkedIn shown as `in/shanmuga-ganesh`
- Website shown as `shanmugaganesh.dev`

Current portfolio:

- Uses Cleveland, OH, same email/phone
- `.env.example` has `https://linkedin.com/in/shanmuga-ganesh`
- `index.html` JSON-LD currently has `https://www.linkedin.com/in/shanmugaganesh1999`
- `portfolioData.js` fallback social links are generic `https://github.com` and `https://linkedin.com`

Recommended change:

- Keep email/phone/location.
- Add a website link to the visible external links if desired.
- Update `index.html` JSON-LD and fallback social links to match approved public URLs.

### Experience

Resume includes these roles:

1. Case Western Reserve University - Software Engineer (Biotech), Cleveland, OH, March 2026 - Present
2. Musk and Gale - Software Engineer (Fintech), Cleveland, OH, June 2025 - Present
3. ZOHO Corporation - MTS (Full Stack Software Developer - CRM), Chennai, India, January 2022 - December 2023
4. Augusta Hitech Software Solution - Junior Associate (Full Stack Software Developer), Coimbatore, India, November 2020 - December 2021

Current portfolio includes:

1. Musk and Gale - Software Engineer, June 2025 - Present
2. Case Western Reserve University - Access Services Specialist, January 2024 - May 2025
3. Zoho Corporation - MTS Full Stack Developer, January 2022 - December 2023
4. Augusta HiTech Software Solution - Junior Associate (Full Stack Developer), November 2018 - December 2021

Recommended change:

- Add the new Case Western Software Engineer (Biotech) role as the first/current entry.
- Remove the old Access Services Specialist entry from the main timeline unless the user explicitly wants to keep it as additional non-resume experience.
- Update Musk and Gale role title to include Fintech if approved.
- Update Augusta date range from `NOV 2018-DEC 2021` to `NOV 2020-DEC 2021`.

### Skills

Resume adds or emphasizes:

- GraphQL
- Django REST Framework
- responsive UI
- component based architecture
- OAuth 2.0
- secure API design
- PyTest
- JUnit
- React Testing Library
- integration testing
- GPT
- BERT
- RAG
- LLM workflows
- prompt engineering
- ML pipelines
- anomaly detection
- performance tuning

Current portfolio lacks several of these and groups skills into four broad cards.

Recommended change:

- Expand or regroup `TECH_STACK` into resume-aligned categories:
  - Languages
  - Frontend
  - Backend_And_APIs
  - Security
  - Data_And_Messaging
  - Cloud_Testing_AI

### Metrics

Resume metrics include:

- False positive carryover reduced by 35%
- Analysis turnaround reduced by 30%
- Pipeline reproducibility improved by 40%
- 95% sprint feature clarity
- API latency reduced by 32%
- 1.8M records/hour
- Query performance improved by 41%
- 7+ integrated systems
- 2.3M records/hour
- Up to 1.8M record events/second for rollup summary
- Recent Items retrieval latency reduced by 50%
- Customer engagement improved by 32%
- Qualified lead retention increased by 60%

Current metric cards are:

- 7+ years
- 1.8M records/hour
- 99.98%
- +60%

Recommended change:

- Update `7+ years` to `5+ years`.
- Consider metric cards that better represent the updated profile:
  - `EXP_YEARS`: `5+ YEARS`
  - `MICRO_QA`: `-35% FP`
  - `DB_PERF`: `+41%`
  - `LEAD_RET`: `+60%`

### Projects

Resume now has a new biotech/data project cluster:

- AI assisted microbiome quality system
- Python HPC sequencing pipeline
- ML ready microbiome data workflows

Current portfolio has no biotech/microbiome project surface.

Recommended first pass:

- Add a concise project card for `AI Assisted Microbiome Quality System`.
- Do not add a full HLD/LLD deep-dive page yet unless the user provides enough architecture details to avoid inventing facts.

Optional later pass:

- Create a full biotech/microbiome project detail page if approved and supplied with project architecture details.

## Approval Decisions

Implementation should wait for these decisions:

1. Confirm resume source: use `/Users/sxt891/Documents/Jobs/Shanmuga Ganesh Resume.pdf` as the current resume.
2. Decide whether to remove the old Case Western Access Services/IAM role from the main portfolio.
3. Decide whether to keep the existing IAM deep-dive project visible in the sidebar as archived work.
4. Decide whether to add only a biotech project card now, or also build a full biotech project detail page later.
5. Provide or confirm the public resume download URL for `VITE_RESUME_URL` if the current Google Drive link should change.

## Proposed Implementation Tasks

### Task 1: Update Visible Portfolio Data

**Files:**
- Modify: `src/data/portfolioData.js`

- [ ] **Step 1: Update `PERSONAL`**

Replace role, specialties, focus, status, fallback links, and resume version with approved resume-aligned values:

```js
export const PERSONAL = {
  name: "SHANMUGA GANESH",
  role: "Full Stack Software Engineer",
  specialty: ["Full Stack Engineering", "AI/Data Workflows", "Cloud Systems"],
  focus: "Building scalable applications with Java, Python, React, Angular, and AWS across AI assisted data workflows, backend APIs, cloud systems, and real time processing",
  email: import.meta.env.VITE_EMAIL || "shanmugaganesh1999@gmail.com",
  phone: import.meta.env.VITE_PHONE || "(216) 466-6648",
  location: "Cleveland, OH",
  status: "5+ years Full Stack Software Engineering experience. Open to full-time opportunities.",
  resumeUrl: import.meta.env.VITE_RESUME_URL || "#",
  resumeLabel: "GET_RESUME.PDF",
  resumeVersion: "v2026_06_PROFILE_REFRESH",
  calendlyUrl: import.meta.env.VITE_CALENDLY_URL || "#",
  socialLinks: {
    github: import.meta.env.VITE_GITHUB_URL || "https://github.com/ShanmugaGanesh1999",
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "https://linkedin.com/in/shanmuga-ganesh",
    leetcode: import.meta.env.VITE_LEETCODE_URL || "https://leetcode.com/u/Shanmuga_Ganesh/",
    website: import.meta.env.VITE_SITE_URL || "https://shanmugaganesh.dev",
  },
};
```

- [ ] **Step 2: Update `STATS`**

Use the updated resume metrics:

```js
export const STATS = [
  { label: "EXP_YEARS", value: "5+", unit: "YEARS", color: "accent" },
  { label: "MICRO_QA", value: "-35", unit: "% FP", color: "success" },
  { label: "DB_PERF", value: "+41", unit: "%", color: "variable" },
  { label: "LEAD_RET", value: "+60", unit: "%", color: "keyword" },
];
```

- [ ] **Step 3: Update `ABOUT`**

Use two concise paragraphs based on the resume summary:

```js
export const ABOUT = {
  paragraphs: [
    "Full Stack Software Engineer with 5+ years of experience building scalable applications using Java, Python, React, Angular, and AWS. Experienced in AI assisted data workflows, microbiome analytics, backend APIs, cloud systems, and real time data processing.",
    "I focus on improving performance, automation, data quality, and system reliability across software and AI driven platforms, from Python HPC sequencing pipelines and ML ready data workflows to Django/React financial systems and high-throughput CRM services.",
  ],
};
```

- [ ] **Step 4: Update `TECH_STACK`**

Replace the four existing categories with six resume-aligned categories:

```js
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
    items: ["React.js", "Angular", "HTML5 / CSS3", "Responsive UI / Component Architecture"],
  },
  {
    title: "Backend_And_APIs",
    status: "SERVICES",
    statusColor: "variable",
    items: ["Spring Boot / Spring Security", "Django REST Framework / FastAPI", "Node.js / Hibernate", "REST APIs / GraphQL / WebSockets"],
  },
  {
    title: "Security",
    status: "AUTH",
    statusColor: "keyword",
    items: ["OAuth 2.0", "JWT", "RBAC / IAM", "Secure API Design"],
  },
  {
    title: "Data_And_Messaging",
    status: "STREAMS",
    statusColor: "func",
    items: ["PostgreSQL / MySQL", "MongoDB / DynamoDB", "Redis", "Kafka / RabbitMQ"],
  },
  {
    title: "Cloud_Testing_AI",
    status: "AI_READY",
    statusColor: "success",
    items: ["AWS / Docker / GitHub Actions", "PyTest / JUnit / React Testing Library", "GPT / BERT / RAG / LLM Workflows", "ML Pipelines / Anomaly Detection / Performance Tuning"],
  },
];
```

- [ ] **Step 5: Update `EXPERIENCE`**

Add the new Case Western biotech role first, update existing roles, and remove the old Access Services entry unless the user approves keeping it:

```js
{
  period: "MAR 2026-PRES",
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
}
```

Update Musk and Gale bullets to include `Java and Python based`, `query performance by 41%`, and `Software Engineer (Fintech)`.

Update Zoho bullets to include `7+ integrated systems`, `1.8M record events per second`, and `50% retrieval latency reduction`.

Update Augusta bullets to use `NOV 2020-DEC 2021`, Angular, Node.js, `32%` engagement, and `60%` qualified lead retention.

- [ ] **Step 6: Update `PROJECTS`**

Add a concise biotech project card and update existing cards to match resume metrics:

```js
{
  title: "AI Assisted Microbiome Quality System",
  description:
    "Python and ML ready microbiome analytics workflows for quality validation, metadata anomaly detection, and HPC sequencing analysis. Reduced false positive carryover by 35%, analysis turnaround by 30%, and improved reproducibility by 40%.",
  status: "ACTIVE",
  statusColor: "success",
  tags: ["PYTHON", "AI", "MICROBIOME"],
  link: "#",
}
```

- [ ] **Step 7: Update `CERTIFICATIONS` and `EDUCATION`**

Use expertise badges that match the refreshed profile:

```js
export const CERTIFICATIONS = [
  { name: "JAVA / SPRING BOOT", color: "keyword" },
  { name: "PYTHON / DJANGO", color: "success" },
  { name: "AI / RAG / LLM WORKFLOWS", color: "accent" },
  { name: "REST / GRAPHQL APIs", color: "variable" },
  { name: "KAFKA / REDIS", color: "func" },
  { name: "PYTEST / JUNIT / RTL", color: "comment" },
];
```

Change education detail to:

```js
detail: "GPA 3.78/4.0 | Cleveland, OH | January 2025",
```

### Task 2: Update Chatbot/RAG Documents

**Files:**
- Modify: `docs/01_Shanmuga_Ganesh_Profile.md`
- Modify: `docs/02_Musk_and_Gale.md`
- Modify: `docs/03_Case_Western_Reserve_University.md`
- Modify: `docs/04_Zoho_Corporation.md`
- Modify: `docs/05_Augusta_HiTech.md`

- [ ] **Step 1: Update `docs/01_Shanmuga_Ganesh_Profile.md`**

Mirror the same approved values from `portfolioData.js`:

- Title role: `Full Stack Software Engineer`
- Summary: `5+ years`
- Contact website: `shanmugaganesh.dev`
- Skills: use the six updated categories
- Experience overview: use the four resume roles
- Projects overview: include `AI Assisted Microbiome Quality System`

- [ ] **Step 2: Rewrite `docs/03_Case_Western_Reserve_University.md`**

Replace the old Access Services Specialist content with a biotech-focused document:

```markdown
# Case Western Reserve University - Software Engineer (Biotech)

**Period:** March 2026 - Present
**Location:** Cleveland, OH
**Tags:** `PYTHON` · `HPC` · `MICROBIOME` · `AI` · `ML`

## Role Summary

Software Engineer (Biotech) at Case Western Reserve University, building AI assisted microbiome quality systems, Python HPC sequencing pipelines, and ML ready microbiome data workflows.

## Key Accomplishments

- Built an **AI assisted microbiome quality system**, reducing **false positive carryover by 35%** through automated feature validation, statistical filtering, and metadata anomaly detection.
- Engineered a **Python HPC sequencing pipeline**, reducing **analysis turnaround by 30%** across ingestion, quality control, taxonomy profiling, and microbiome analytics.
- Designed **ML ready microbiome data workflows**, improving **pipeline reproducibility by 40%** through standardized metadata validation, automated quality checks, and structured execution logic.

## Project: AI Assisted Microbiome Quality System

**Tech Stack:** Python, HPC workflows, statistical filtering, metadata validation, ML ready data processing

> AI assisted microbiome analytics workflow for quality validation, carryover detection, standardized execution, and reproducible downstream analysis.
```

- [ ] **Step 3: Update organization docs for Musk, Zoho, and Augusta**

Apply only resume-supported changes:

- Musk: add Fintech title, Java/Python framing, query performance +41%.
- Zoho: update `7+ integrated systems`, `1.8M record events per second`, Recent Items `50%` retrieval latency reduction.
- Augusta: update date range to November 2020 - December 2021, Node.js/Angular CRM modules, `32%` engagement, `60%` qualified lead retention.

### Task 3: Update SEO And Metadata

**Files:**
- Modify: `index.html`
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Update title and descriptions**

Use:

```html
<title>Shanmuga Ganesh | Full Stack Software Engineer | AI, Data & Cloud Systems</title>
<meta name="title" content="Shanmuga Ganesh | Full Stack Software Engineer | AI, Data & Cloud Systems" />
<meta name="description" content="Full Stack Software Engineer with 5+ years building scalable Java, Python, React, Angular, and AWS applications across AI assisted data workflows, microbiome analytics, backend APIs, cloud systems, and real time processing." />
```

- [ ] **Step 2: Update Open Graph and Twitter metadata**

Use the same `Full Stack Software Engineer` and `5+ years` positioning in `og:title`, `og:description`, `twitter:title`, and `twitter:description`.

- [ ] **Step 3: Update JSON-LD**

Change:

- `jobTitle` to `Full Stack Software Engineer`
- `sameAs` LinkedIn to `https://linkedin.com/in/shanmuga-ganesh`
- `url` to `https://shanmugaganesh.dev/` if this is the canonical public domain
- `knowsAbout` to include AI assisted data workflows, microbiome analytics, GraphQL, RAG, LLM workflows, ML pipelines, testing, and performance tuning

- [ ] **Step 4: Update sitemap date**

Set:

```xml
<lastmod>2026-06-17</lastmod>
```

### Task 4: Update External Links And Resume URL Policy

**Files:**
- Modify: `.env.example`
- Optional local-only update: `.env.local`

- [ ] **Step 1: Update `.env.example` comments and defaults**

Use the approved public URLs:

```bash
VITE_GITHUB_URL=https://github.com/ShanmugaGanesh1999
VITE_LINKEDIN_URL=https://linkedin.com/in/shanmuga-ganesh
VITE_SITE_URL=https://shanmugaganesh.dev
VITE_EMAIL=shanmugaganesh1999@gmail.com
VITE_PHONE=(216)-466-6648
```

- [ ] **Step 2: Resume download**

If the current Google Drive resume URL is still correct, leave `VITE_RESUME_URL` unchanged. If a new resume PDF is uploaded publicly, replace `VITE_RESUME_URL` in `.env.local` and `.env.example` with the new public download/view URL.

### Task 5: Optional Project Detail Work

**Files, only if approved:**
- Create: `src/projects/BiotechMicrobiomeProject.jsx`
- Create: `src/projects/biotechMicrobiomeData.js`
- Modify: `src/App.jsx`
- Modify: `src/data/portfolioData.js`

- [ ] **Step 1: Keep first implementation limited unless more architecture details are approved**

The current resume gives enough detail for a project card and RAG document, but not enough for a credible full HLD/LLD page matching the existing deep-dive standard.

- [ ] **Step 2: If full detail is approved, collect architecture facts first**

Needed facts before building a full page:

- Pipeline stages and inputs
- QC/statistical filters used
- Metadata anomaly checks
- HPC scheduler/runtime assumptions
- Data volume scale
- Output artifacts
- Failure handling and reproducibility controls
- Any non-confidential architecture diagram details

### Task 6: Verification

**Commands:**
- `npm run lint`
- `npm run build`

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: lint completes without new errors.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: Vite production build completes successfully.

- [ ] **Step 3: Browser QA**

Start local preview:

```bash
npm run dev
```

Verify:

- Hero says `Full Stack Software Engineer`.
- Metric cards show `5+`, `-35% FP`, `+41%`, and `+60%`.
- About text matches approved resume summary.
- Experience timeline starts with Case Western Software Engineer (Biotech).
- Old Access Services Specialist does not appear in the main timeline unless explicitly approved.
- Chatbot can answer questions about the biotech role using `docs/03_Case_Western_Reserve_University.md`.
- Contact section opens the approved resume URL.
- Social links use approved GitHub, LinkedIn, LeetCode, and website URLs.

## Recommended Approval

Approve Task 1 through Task 4 first. This will sync the site, chatbot knowledge, and SEO to the resume without inventing a full biotech architecture page.

Keep Task 5 as a separate approved follow-up after providing architecture details for the biotech/microbiome project page.

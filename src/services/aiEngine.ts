import {
  StudentProfile,
  CareerGuidanceReport,
  SkillRoadmap,
  MentorPersonaId,
  MentorMessage,
  TargetRole,
  ExperienceLevel,
  RoadmapPhase,
} from '../types';
import { DEFAULT_ROADMAPS } from '../data/mockData';

export interface AiServiceStatus {
  provider: 'gemini' | 'local-heuristic';
  label: string;
  isFreeAndOpenSource: boolean;
  model: string;
}

// Check server status
export async function getAiServiceStatus(): Promise<AiServiceStatus> {
  try {
    const res = await fetch('/api/ai/status');
    if (res.ok) {
      const data = await res.json();
      if (data.geminiAvailable) {
        return {
          provider: 'gemini',
          label: 'Google Gemini 3.8 Flash (Server Active)',
          isFreeAndOpenSource: false,
          model: 'gemini-3.8-flash',
        };
      }
    }
  } catch {
    // Server route unreachable (e.g. purely static Vercel build)
  }

  return {
    provider: 'local-heuristic',
    label: 'Intelligent Knowledge Engine (100% Free & Open-Source)',
    isFreeAndOpenSource: true,
    model: 'learnpath-vibe-heuristic-v1',
  };
}

// 1. Feature 1: Career Guidance Engine
export async function analyzeCareerGuidance(profile: StudentProfile): Promise<CareerGuidanceReport> {
  try {
    const res = await fetch('/api/ai/career-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentProfile: profile }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && !json.fallback) {
        return {
          ...json.data,
          generatedAt: new Date().toISOString(),
          provider: 'Google Gemini 3.8 Flash',
        };
      }
    }
  } catch (err) {
    console.info('Server API unreachable, using local AI engine', err);
  }

  // Intelligent Local Heuristic Fallback Engine
  return generateLocalCareerGuidance(profile);
}

function generateLocalCareerGuidance(profile: StudentProfile): CareerGuidanceReport {
  const role = profile.targetRole;
  const languages = profile.languages || [];
  const frameworks = profile.frameworks || [];
  const exp = profile.experienceLevel;

  // Calculate skill overlap
  let matchScore = 70;
  if (exp === 'Intermediate') matchScore += 12;
  if (exp === 'Advanced') matchScore += 18;

  if (role === 'Full-Stack Developer') {
    if (languages.includes('JavaScript') || languages.includes('TypeScript')) matchScore += 5;
    if (frameworks.includes('React') || frameworks.includes('Node.js')) matchScore += 5;
  } else if (role === 'AI / ML Engineer') {
    if (languages.includes('Python')) matchScore += 6;
    if (frameworks.includes('PyTorch') || frameworks.includes('TensorFlow')) matchScore += 6;
  } else if (role === 'Cloud & DevOps Engineer') {
    if (languages.includes('Bash') || languages.includes('Go') || languages.includes('Python')) matchScore += 5;
    if (frameworks.includes('Docker') || frameworks.includes('Linux')) matchScore += 6;
  }

  matchScore = Math.min(96, Math.max(65, matchScore));

  const roleConfigs: Record<TargetRole, {
    marketDemand: 'Very High' | 'High' | 'Moderate';
    salaryRange: string;
    gaps: { collegeTeaches: string; industryDemands: string; severity: 'Critical' | 'Important' | 'Moderate' }[];
    recommendedTechStack: string[];
    alternatives: { role: string; matchScore: number; reason: string }[];
    actionPlan: { week: string; focus: string; action: string }[];
  }> = {
    'Full-Stack Developer': {
      marketDemand: 'Very High',
      salaryRange: '$80,000 - $120,000 / ₹8 - 20 LPA',
      gaps: [
        {
          collegeTeaches: 'Basic static HTML/CSS/JS and manual page reloads',
          industryDemands: 'Modern Component Architectures (React 19 / Next.js) with strict TypeScript',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Single-tier SQL queries without indexing or pooling',
          industryDemands: 'Relational DB normalization, B-Tree indexes, connection pools, and Redis caching',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Submitting zipped code files without version history',
          industryDemands: 'Git branching, PR reviews, conventional commits, and automated CI/CD checks',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Theoretical monolithic application designs',
          industryDemands: 'Containerized microservices with Docker, API Gateways, and live cloud deployment',
          severity: 'Important',
        },
      ],
      recommendedTechStack: ['TypeScript', 'React 19', 'Node.js / Express', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
      alternatives: [
        { role: 'Backend Systems Engineer', matchScore: matchScore - 4, reason: 'Strong affinity with API logic and database optimization.' },
        { role: 'Frontend UI/UX Engineer', matchScore: matchScore - 6, reason: 'Deep component craftsmanship and client-side performance.' },
        { role: 'Cloud & DevOps Engineer', matchScore: matchScore - 9, reason: 'Opportunity to automate build pipelines and container deployments.' },
      ],
      actionPlan: [
        { week: 'Week 1', focus: 'TypeScript & Git Hygiene', action: 'Port a sample JavaScript project to strict TypeScript with interfaces and push to GitHub with clear branch PRs.' },
        { week: 'Week 2', focus: 'Layered Backend Architecture', action: 'Build an Express REST API using Zod request validation, structured errors, and PostgreSQL.' },
        { week: 'Week 3', focus: 'Containerization & Docker', action: 'Write a multi-stage Dockerfile and test local builds with Docker Compose.' },
        { week: 'Week 4', focus: 'Live Deployment & Verification', action: 'Deploy frontend to Vercel and backend to a container host with an automated GitHub Action.' },
      ],
    },
    'AI / ML Engineer': {
      marketDemand: 'Very High',
      salaryRange: '$95,000 - $140,000 / ₹12 - 28 LPA',
      gaps: [
        {
          collegeTeaches: 'Theoretical math proofs of SVMs and Decision Trees on tiny toy datasets',
          industryDemands: 'Deep Learning with PyTorch, Transformer fine-tuning, and HuggingFace pipelines',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Jupyter notebooks with hardcoded absolute file paths',
          industryDemands: 'Production ML pipelines (MLOps), model serialization (ONNX), and FastAPI serving',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Focus exclusively on accuracy metrics without latency checks',
          industryDemands: 'Quantization, inference latency optimization, GPU memory profiling, and token costs',
          severity: 'Important',
        },
      ],
      recommendedTechStack: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI', 'Docker', 'PostgreSQL / Vector DB (pgvector)'],
      alternatives: [
        { role: 'Data Engineer', matchScore: matchScore - 5, reason: 'Leverages Python and data wrangling for scalable ETL pipelines.' },
        { role: 'Full-Stack Developer', matchScore: matchScore - 8, reason: 'Combine web frontends with AI model endpoints for full-stack AI apps.' },
      ],
      actionPlan: [
        { week: 'Week 1', focus: 'PyTorch Tensor Fundamentals', action: 'Build a neural network from scratch using raw PyTorch tensors and verify gradients.' },
        { week: 'Week 2', focus: 'Transformer & HuggingFace Models', action: 'Fine-tune an open-source text classification or embeddings model on custom data.' },
        { week: 'Week 3', focus: 'FastAPI Model Serving', action: 'Wrap your trained PyTorch weights into a high-speed asynchronous FastAPI endpoint.' },
        { week: 'Week 4', focus: 'Containerized Model Deployment', action: 'Dockerize the AI serving API and benchmark requests per second.' },
      ],
    },
    'Cloud & DevOps Engineer': {
      marketDemand: 'Very High',
      salaryRange: '$88,000 - $130,000 / ₹10 - 24 LPA',
      gaps: [
        {
          collegeTeaches: 'Textbook definitions of OSI layers and TCP/IP handshakes',
          industryDemands: 'Practical Linux administration, VPC networking, DNS routing, and reverse proxies (Nginx)',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Manual software installation via GUI wizards',
          industryDemands: 'Infrastructure as Code (Terraform / Ansible) and GitOps automated provisioning',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'No exposure to distributed logging or observability',
          industryDemands: 'Prometheus metrics, Grafana dashboards, structured JSON logging, and alerting thresholds',
          severity: 'Important',
        },
      ],
      recommendedTechStack: ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus/Grafana', 'Go'],
      alternatives: [
        { role: 'Backend Systems Engineer', matchScore: matchScore - 6, reason: 'Strong intersection between server runtime and distributed infrastructure.' },
        { role: 'Cybersecurity Analyst', matchScore: matchScore - 8, reason: 'Securing cloud infrastructure, IAM roles, and network policies.' },
      ],
      actionPlan: [
        { week: 'Week 1', focus: 'Linux Mastery & Bash Scripting', action: 'Master Linux file permissions, systemd services, SSH key hardening, and automation scripts.' },
        { week: 'Week 2', focus: 'Docker Multi-stage Builds', action: 'Containerize multi-tier web applications and reduce final image sizes below 100MB.' },
        { week: 'Week 3', focus: 'CI/CD Pipeline Automation', action: 'Create a complete GitHub Actions matrix build that tests, lints, and builds container images.' },
        { week: 'Week 4', focus: 'Kubernetes Cluster Provisioning', action: 'Deploy a multi-pod microservice with Ingress and service discovery on Minikube or cloud free-tier.' },
      ],
    },
    'Data Engineer': {
      marketDemand: 'High',
      salaryRange: '$82,000 - $125,000 / ₹9 - 22 LPA',
      gaps: [
        {
          collegeTeaches: 'Basic DBMS queries on local single-user tables',
          industryDemands: 'Distributed big data architectures (Spark, Kafka), columnar formats (Parquet), and Lakehouses',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Manual CSV file exports in spreadsheets',
          industryDemands: 'Automated DAG workflow orchestration with Apache Airflow or Prefect',
          severity: 'Critical',
        },
      ],
      recommendedTechStack: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Airflow', 'PostgreSQL', 'Docker'],
      alternatives: [
        { role: 'Backend Systems Engineer', matchScore: matchScore - 5, reason: 'Shared focus on high-throughput data access and distributed storage.' },
        { role: 'AI / ML Engineer', matchScore: matchScore - 7, reason: 'Feeding clean feature stores into machine learning models.' },
      ],
      actionPlan: [
        { week: 'Week 1', focus: 'Advanced SQL & Window Functions', action: 'Write partition queries, window functions (ROW_NUMBER, LAG, LEAD), and CTEs.' },
        { week: 'Week 2', focus: 'ETL Pipeline with Python & Pandas', action: 'Write an idempotent data ingestion pipeline handling messy real-world CSV/API data.' },
        { week: 'Week 3', focus: 'Streaming Data with Kafka/RabbitMQ', action: 'Produce and consume asynchronous event messages using Dockerized message queues.' },
        { week: 'Week 4', focus: 'Data Orchestration', action: 'Set up an automated daily DAG pipeline that loads, validates, and reports summary stats.' },
      ],
    },
    'Cybersecurity Analyst': {
      marketDemand: 'Very High',
      salaryRange: '$85,000 - $125,000 / ₹9 - 21 LPA',
      gaps: [
        {
          collegeTeaches: 'Theoretical cryptography algorithms (RSA, DES) on paper',
          industryDemands: 'OWASP Top 10 vulnerabilities (SQLi, XSS, SSRF, IDOR), Burp Suite, and penetration testing',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Simple firewall definitions from 2005',
          industryDemands: 'Zero Trust architecture, Cloud IAM security, API token rotation, and vulnerability scanning',
          severity: 'Critical',
        },
      ],
      recommendedTechStack: ['Linux', 'Python', 'Wireshark', 'Burp Suite', 'OWASP ZAP', 'Bash', 'Docker'],
      alternatives: [
        { role: 'Cloud & DevOps Engineer', matchScore: matchScore - 6, reason: 'DevSecOps and security automation in cloud pipelines.' },
        { role: 'Backend Systems Engineer', matchScore: matchScore - 8, reason: 'Hardening APIs and implementing strict authentication mechanisms.' },
      ],
      actionPlan: [
        { week: 'Week 1', focus: 'OWASP Top 10 Hands-on', action: 'Practice identifying and remediating SQL injection and XSS on OWASP Juice Shop.' },
        { week: 'Week 2', focus: 'Network Traffic Analysis', action: 'Capture and inspect HTTP/HTTPS and DNS packets with Wireshark to spot anomalies.' },
        { week: 'Week 3', focus: 'Automated Dependency Auditing', action: 'Integrate Snyk and Trivy scanning into a GitHub Actions repository to block vulnerable CVEs.' },
        { week: 'Week 4', focus: 'Secure Auth Implementation', action: 'Implement a secure authentication service with salted argon2 password hashing and rate limiting.' },
      ],
    },
    'Mobile App Developer': {
      marketDemand: 'High',
      salaryRange: '$75,000 - $115,000 / ₹8 - 19 LPA',
      gaps: [
        {
          collegeTeaches: 'Old XML-based Android layouts with Eclipse',
          industryDemands: 'Declarative UI frameworks (Flutter or React Native) with modern state management',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Single-screen calculators without offline storage',
          industryDemands: 'Offline-first architecture, SQLite / Room caching, push notifications, and app store release cycles',
          severity: 'Critical',
        },
      ],
      recommendedTechStack: ['React Native / Flutter', 'TypeScript / Dart', 'SQLite / WatermelonDB', 'Firebase / Supabase', 'Git'],
      alternatives: [
        { role: 'Full-Stack Developer', matchScore: matchScore - 4, reason: 'Shared UI and API integration principles.' },
        { role: 'Frontend UI/UX Engineer', matchScore: matchScore - 5, reason: 'Focus on fluid touch gestures and responsive mobile interfaces.' },
      ],
      actionPlan: [
        { week: 'Week 1', focus: 'Declarative Mobile UI', action: 'Build responsive screen layouts using React Native or Flutter without hardcoded dimensions.' },
        { week: 'Week 2', focus: 'State & Navigation Flow', action: 'Implement clean stack and tab navigation with persistent state across app restarts.' },
        { week: 'Week 3', focus: 'Offline Storage & REST APIs', action: 'Cache API responses locally in SQLite so the app functions seamlessly in airplane mode.' },
        { week: 'Week 4', focus: 'Device Features & Release Build', action: 'Integrate camera/location permissions and generate a signed release APK.' },
      ],
    },
    'Backend Systems Engineer': {
      marketDemand: 'Very High',
      salaryRange: '$85,000 - $130,000 / ₹10 - 24 LPA',
      gaps: [
        {
          collegeTeaches: 'Simple sequential console applications in C/Java',
          industryDemands: 'Asynchronous event loops, concurrency control, connection pooling, and gRPC',
          severity: 'Critical',
        },
        {
          collegeTeaches: 'Basic file I/O operations',
          industryDemands: 'Distributed caching (Redis), message queues (Kafka), and horizontal scalability patterns',
          severity: 'Critical',
        },
      ],
      recommendedTechStack: ['Go / Node.js / Java', 'PostgreSQL', 'Redis', 'Docker', 'gRPC / Protocol Buffers', 'Linux'],
      alternatives: [
        { role: 'Full-Stack Developer', matchScore: matchScore - 5, reason: 'Pair backend proficiency with modern web frontends.' },
        { role: 'Cloud & DevOps Engineer', matchScore: matchScore - 7, reason: 'Manage the infrastructure running backend distributed systems.' },
      ],
      actionPlan: [
        { week: 'Week 1', focus: 'Concurrency & Asynchronous I/O', action: 'Build a concurrent worker pool in Go or Node.js processing simulated high-volume jobs.' },
        { week: 'Week 2', focus: 'Database Indexing & Query Tuning', action: 'Analyze PostgreSQL execution plans with EXPLAIN and eliminate slow table scans.' },
        { week: 'Week 3', focus: 'Redis Caching & Invalidation', action: 'Implement cache-aside pattern with TTLs and test cache hit ratios under load.' },
        { week: 'Week 4', focus: 'System Design Mock', action: 'Design and document a scalable distributed URL shortener or rate limiter.' },
      ],
    },
  };

  const config = roleConfigs[role] || roleConfigs['Full-Stack Developer'];

  return {
    primaryRole: role,
    matchScore,
    marketDemand: config.marketDemand,
    salaryRange: config.salaryRange,
    summary: `Based on your profile as a ${profile.academicYear} student with experience in ${languages.slice(0, 3).join(', ')}, you have a solid academic foundation. To bridge the gap to high-employability tech roles, prioritize practical projects demonstrating Git workflows, production architecture, and automated testing.`,
    industryCurriculumGaps: config.gaps,
    recommendedTechStack: config.recommendedTechStack,
    alternativePathways: config.alternatives,
    thirtyDayActionPlan: config.actionPlan,
    generatedAt: new Date().toISOString(),
    provider: 'Intelligent Knowledge Engine (Free & Open-Source)',
  };
}

// 2. Feature 2: Skill Roadmap Engine
export async function generateRoadmap(
  targetRole: TargetRole,
  level: ExperienceLevel,
  weeklyHours: number
): Promise<SkillRoadmap> {
  try {
    const res = await fetch('/api/ai/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole, currentLevel: level, weeklyHours }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && !json.fallback && json.data.phases) {
        return {
          id: `roadmap-${Date.now()}`,
          role: targetRole,
          totalEstimatedWeeks: json.data.totalEstimatedWeeks || 16,
          phases: json.data.phases,
          lastUpdated: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.info('Server API unreachable, generating local structured roadmap', err);
  }

  // Fallback to pre-designed expert roadmaps or role generator
  return generateLocalRoadmap(targetRole, level, weeklyHours);
}

function generateLocalRoadmap(targetRole: TargetRole, level: ExperienceLevel, weeklyHours: number): SkillRoadmap {
  if (DEFAULT_ROADMAPS[targetRole]) {
    return {
      ...DEFAULT_ROADMAPS[targetRole],
      id: `roadmap-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Dynamic template generation for other roles
  const phases: RoadmapPhase[] = [
    {
      phaseNumber: 1,
      title: 'Foundations & Tooling Mastery',
      tagline: `Establishing robust developer hygiene and modern programming concepts in ${targetRole}.`,
      estimatedDuration: `${Math.max(2, Math.round(40 / weeklyHours))} Weeks`,
      difficulty: 'Beginner',
      skills: ['Git Workflows', 'Clean Architecture', 'Core Language Mastery'],
      milestones: [
        {
          id: 'gen-m1',
          title: 'Modern Toolchain & Version Control',
          description: 'Establish standard Git branching, semantic commit messages, and automated linter configurations.',
          recommendedResource: 'The Missing Semester of Your CS Education (MIT OCW)',
          deliverable: 'Configure a clean GitHub repository with branch protection and linter rules.',
          topics: [
            { id: 'gt1-1', title: 'Feature branching and pull request workflow', completed: false },
            { id: 'gt1-2', title: 'Configuring ESLint / Prettier / Style guides', completed: false },
            { id: 'gt1-3', title: 'Git rebase, stash, and interactive conflict resolution', completed: false },
          ],
        },
      ],
    },
    {
      phaseNumber: 2,
      title: 'Core Domain Specialization',
      tagline: `Hands-on implementation of the core technical requirements for a hireable ${targetRole}.`,
      estimatedDuration: `${Math.max(3, Math.round(50 / weeklyHours))} Weeks`,
      difficulty: 'Intermediate',
      skills: ['Domain Frameworks', 'Data Pipelines / APIs', 'Architecture'],
      milestones: [
        {
          id: 'gen-m2',
          title: 'Production Project Architecture',
          description: 'Build a modular service implementing standard design patterns and real-time logging.',
          recommendedResource: 'Official Documentation & Open Source Templates',
          deliverable: 'A working service handling input validation, database transactions, and error handling.',
          topics: [
            { id: 'gt2-1', title: 'Layered architecture and separation of concerns', completed: false },
            { id: 'gt2-2', title: 'Input validation and security sanitization', completed: false },
            { id: 'gt2-3', title: 'Database indexing and connection optimization', completed: false },
          ],
        },
      ],
    },
    {
      phaseNumber: 3,
      title: 'Testing, Cloud Deployment & CI/CD',
      tagline: 'Bridging the university gap by proving automated testing and live production uptime.',
      estimatedDuration: `${Math.max(3, Math.round(45 / weeklyHours))} Weeks`,
      difficulty: 'Intermediate',
      skills: ['Automated Testing', 'Docker Containerization', 'CI/CD Pipelines'],
      milestones: [
        {
          id: 'gen-m3',
          title: 'Automated Test Suites & Containerization',
          description: 'Write integration tests and containerize with Docker for repeatable builds.',
          recommendedResource: 'Docker & GitHub Actions Free Guides',
          deliverable: 'Passing automated CI test suite that builds Docker images on every pull request.',
          topics: [
            { id: 'gt3-1', title: 'Writing unit and integration tests for edge cases', completed: false },
            { id: 'gt3-2', title: 'Writing optimized multi-stage Dockerfiles', completed: false },
            { id: 'gt3-3', title: 'Setting up GitHub Actions CI workflow', completed: false },
          ],
        },
      ],
    },
    {
      phaseNumber: 4,
      title: 'Capstone Showcase & Interview Readiness',
      tagline: 'Translating your technical skills into compelling evidence for interview loops.',
      estimatedDuration: `${Math.max(2, Math.round(35 / weeklyHours))} Weeks`,
      difficulty: 'Advanced',
      skills: ['Live Demo Deployment', 'STAR Behavioral', 'Technical Problem Solving'],
      milestones: [
        {
          id: 'gen-m4',
          title: 'Public Capstone & Technical Mock Rounds',
          description: 'Deploy a live demonstration with rich documentation and pass technical screen evaluations.',
          recommendedResource: 'Tech Interview Handbook & NeetCode',
          deliverable: 'Live URL with architecture diagram in README and recorded demo walkthrough.',
          topics: [
            { id: 'gt4-1', title: 'Deploying to cloud hosting (Vercel / Cloud Run)', completed: false },
            { id: 'gt4-2', title: 'Documenting architectural trade-offs in README', completed: false },
            { id: 'gt4-3', title: 'Mock interview practice: 5 STAR behavioral stories', completed: false },
          ],
        },
      ],
    },
  ];

  return {
    id: `roadmap-${targetRole.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    role: targetRole,
    totalEstimatedWeeks: 14,
    phases,
    lastUpdated: new Date().toISOString(),
  };
}

// 3. Feature 4: AI Mentorship Engine
export async function sendMentorMessage(
  personaId: MentorPersonaId,
  userMessage: string,
  history: MentorMessage[],
  studentContext: StudentProfile
): Promise<MentorMessage> {
  try {
    const res = await fetch('/api/ai/mentor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mentorPersona: personaId,
        message: userMessage,
        history,
        studentContext,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.reply && !json.fallback) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'mentor',
          text: json.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          personaId,
        };
      }
    }
  } catch (err) {
    console.info('Server chat API unreachable, using intelligent heuristic mentor logic', err);
  }

  // Local Intelligent Mentor Engine
  return generateLocalMentorReply(personaId, userMessage, studentContext);
}

function generateLocalMentorReply(
  personaId: MentorPersonaId,
  userMessage: string,
  studentContext: StudentProfile
): MentorMessage {
  const query = userMessage.toLowerCase().trim();
  let text = '';
  let keyTakeaway = '';
  let actionItem = '';

  // 1. DOCKER / CONTAINERS / KUBERNETES
  if (query.includes('docker') || query.includes('container') || query.includes('virtual machine') || query.includes('vm') || query.includes('kubernetes')) {
    text = `### Docker Containers vs. Virtual Machines: Production Reality

The core difference boils down to **kernel virtualization vs. hardware emulation**:

| Dimension | Virtual Machines (VMware, VirtualBox) | Docker Containers |
| :--- | :--- | :--- |
| **Architecture** | Emulates entire hardware + runs full Guest OS | Shares the Host OS Linux kernel via \`cgroups\` & \`namespaces\` |
| **Startup Time** | Minutes (boots an entire operating system) | Milliseconds (spawns a process in isolation) |
| **Footprint** | Gigabytes per VM | Megabytes (shared read-only image layers) |
| **Industry Purpose** | Multi-tenant cloud isolation (AWS EC2, GCP Compute) | Repeatable microservice deployment & CI/CD pipelines |

\`\`\`dockerfile
# Multi-stage production build example
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
\`\`\`

**Why College Students Need This:** In college, "it works on my machine" is a common excuse. In industry, shipping a \`Dockerfile\` guarantees your app runs identically on your laptop, your teammate's Mac, and the AWS production cluster.`;
    keyTakeaway = 'Containers isolate processes on a shared OS kernel; VMs isolate entire operating systems on hypervisors.';
    actionItem = 'Create a Dockerfile for your capstone project and run "docker build -t my-app ." to verify zero environment drift.';
  }
  // 2. SQL vs NoSQL / DATABASES
  else if (query.includes('sql') || query.includes('nosql') || query.includes('mongodb') || query.includes('postgres') || query.includes('acid') || query.includes('database')) {
    text = `### SQL (Relational) vs. NoSQL (Document/Key-Value)

The choice is never about "which is newer"—it is about **data consistency guarantees (ACID) vs. flexible horizontal scaling (CAP theorem)**:

1. **SQL (PostgreSQL, MySQL)**:
   - **Structure**: Strongly typed schemas, tables, rows, and explicit foreign key relationships.
   - **ACID Guarantees**: Atomicity, Consistency, Isolation, Durability. If money leaves Account A, it *must* arrive in Account B or the transaction rolls back completely.
   - **Best For**: Financial ledgers, user accounts, e-commerce orders, relational inventory.

2. **NoSQL (MongoDB, DynamoDB, Redis)**:
   - **Structure**: Schema-less JSON documents, key-value pairs, or wide-column graphs.
   - **Horizontal Scale**: Easier to shard across 50 database servers because rows don't require relational \`JOIN\` operations.
   - **Best For**: Real-time analytics, high-velocity logging, unstructured product catalogs, session stores.

\`\`\`sql
-- SQL relational integrity example
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE id = 101;
UPDATE accounts SET balance = balance + 500 WHERE id = 202;
COMMIT;
\`\`\`

**Senior Engineering Rule of Thumb:** Default to **PostgreSQL** unless you have a proven, benchmarked requirement for MongoDB or distributed NoSQL. PostgreSQL handles relational data, JSONB documents, and full-text search flawlessly.`;
    keyTakeaway = 'Default to PostgreSQL for relational integrity; use NoSQL only when data shape is genuinely dynamic or requires horizontal sharding.';
    actionItem = 'Write out an entity-relationship diagram with foreign keys and indexes for your primary portfolio app.';
  }
  // 3. DATABASE INDEXES
  else if (query.includes('index') || query.includes('indexing') || query.includes('query optimization') || query.includes('slow query')) {
    text = `### Database Indexing & B-Trees Explained

A database index works exactly like the **index at the back of a textbook**:

Without an index, the database must execute a **Full Table Scan** (scanning every single row from row 1 to row 1,000,000) with $O(N)$ time complexity. With a B-Tree index, the database performs binary traversals down the tree in $O(\\log N)$ time.

\`\`\`sql
-- Inspect performance before indexing
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'student@college.edu';
-- Execution time: 142.3 ms (Seq Scan)

-- Create a B-Tree Index
CREATE INDEX idx_users_email ON users(email);

-- Re-inspect performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'student@college.edu';
-- Execution time: 0.12 ms (Index Scan via B-Tree)
\`\`\`

**The Trade-off to Mention in Interviews:**
- **Pros**: Lightning-fast read queries ($O(\\log N)$ vs $O(N)$).
- **Cons**: Every \`INSERT\`, \`UPDATE\`, and \`DELETE\` becomes slightly slower because the database must update the B-Tree structure on disk alongside the table data.`;
    keyTakeaway = 'Indexes convert $O(N)$ sequential table scans into $O(\\log N)$ tree traversals at the cost of additional write latency and disk space.';
    actionItem = 'Run "EXPLAIN ANALYZE" on your most queried database endpoint and add an index to the filter column.';
  }
  // 4. REACT HOOKS / RE-RENDERS / STATE MANAGEMENT
  else if (query.includes('react') || query.includes('usestate') || query.includes('useeffect') || query.includes('re-render') || query.includes('hook')) {
    text = `### React Hooks & Re-render Lifecycle Mastery

In React, a component re-renders when **its state changes, its parent re-renders, or its props change**.

#### 1. useState & Closure Traps
State updates are **batched and asynchronous**.
\`\`\`tsx
// Common Junior Mistake:
const [count, setCount] = useState(0);
const handleClick = () => {
  setCount(count + 1);
  console.log(count); // Still logs old value (0) due to closure!
};

// Senior Pattern (Functional Update):
setCount(prev => prev + 1);
\`\`\`

#### 2. useEffect Hygiene
- Avoid using \`useEffect\` for calculated state. If a value can be derived from existing props or state, compute it directly during render or use \`useMemo\`.
- Never put unstabilized objects or arrays inside the dependency array, or you trigger an infinite render loop.

#### 3. When to use useMemo & useCallback:
- **useMemo**: Cache expensive mathematical computations (e.g. filtering 10,000 items).
- **useCallback**: Cache function references passed down to memoized child components (\`React.memo\`) to prevent children from re-rendering unnecessarily.`;
    keyTakeaway = 'Derive state during render rather than syncing with useEffect; always use functional updates when new state depends on previous state.';
    actionItem = 'Inspect your React components: remove any useEffect that merely calculates a derived value from props.';
  }
  // 5. REST vs GRAPHQL vs GRPC
  else if (query.includes('rest') || query.includes('graphql') || query.includes('grpc') || query.includes('api design')) {
    text = `### API Architectural Styles: REST vs. GraphQL vs. gRPC

| Protocol | Transport | Best Suited For | Key Advantage |
| :--- | :--- | :--- | :--- |
| **REST** | HTTP/1.1 or 2 | Public APIs, CRUD web services | Universal HTTP semantics, caching via ETags/CDN, simple tooling |
| **GraphQL** | HTTP POST | Complex frontend dashboards, mobile clients | Solves over-fetching and under-fetching (client specifies exact fields) |
| **gRPC** | HTTP/2 + Protobuf | Microservice-to-microservice internal RPC | Binary serialization, 7-10x faster throughput, type-safe code generation |

\`\`\`
Client (Browser) --[ REST / JSON ]--> API Gateway --[ gRPC / Protobuf ]--> Microservices
\`\`\`

**Interview Pro-Tip:** Senior interviewers love when you explain that **REST** is best for public client-facing APIs with HTTP caching, while **gRPC** is the standard for high-throughput internal microservice communication.`;
    keyTakeaway = 'Use REST for public client-to-server contracts; use GraphQL to prevent mobile over-fetching; use gRPC for internal service-to-service speed.';
    actionItem = 'Standardize your API endpoints to use standard HTTP verbs (GET, POST, PUT, DELETE) and status codes (200, 201, 400, 401, 403, 404, 500).';
  }
  // 6. CORS / JWT / WEB SECURITY
  else if (query.includes('cors') || query.includes('jwt') || query.includes('auth') || query.includes('cookie') || query.includes('token') || query.includes('security')) {
    text = `### Web Security: CORS, JWTs & Authentication

#### 1. What CORS Actually Is:
CORS (**Cross-Origin Resource Sharing**) is a browser security mechanism, NOT a server error!
- The browser blocks Client \`localhost:3000\` from reading responses from \`api.example.com:5000\` unless the server explicitly responds with:
  \`Access-Control-Allow-Origin: http://localhost:3000\`
- **Fix**: Configure CORS middleware on your backend server. Never try to "fix" CORS by disabling security flags in your browser!

#### 2. Storing JWT Tokens Securely:
- ❌ **localStorage**: Vulnerable to XSS (Cross-Site Scripting). If any injected script runs, it can steal \`localStorage.getItem("token")\`.
- ✅ **HttpOnly Cookies**: The browser attaches the cookie automatically on requests, but client-side JavaScript **cannot read it**, neutralizing XSS token theft. Add \`SameSite=Lax\` and \`Secure\` flags to prevent CSRF.`;
    keyTakeaway = 'CORS is enforced by the client browser, not the server; always store sensitive authentication tokens in HttpOnly cookies to prevent XSS theft.';
    actionItem = 'Configure proper CORS headers on your Express or FastAPI backend with explicit allowed origins.';
  }
  // 7. REDIS & CACHING
  else if (query.includes('redis') || query.includes('cache') || query.includes('caching') || query.includes('cache invalidation')) {
    text = `### Redis & Distributed Caching Architecture

Redis is an **in-memory data structure store** with sub-millisecond read/write latencies.

#### The Standard Cache-Aside Pattern:
1. Application receives a request for User #42.
2. App checks Redis: \`GET user:42\`
   - **Cache HIT**: Return cached JSON immediately in 2ms.
   - **Cache MISS**: Query PostgreSQL (takes 80ms), store in Redis with TTL (\`SETEX user:42 3600 ...\`), and return response.

\`\`\`typescript
async function getUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached); // Cache Hit

  const user = await db.users.findUnique({ where: { id } }); // Cache Miss
  if (user) {
    await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user)); // 1 hr TTL
  }
  return user;
}
\`\`\`

**The Hardest Part of Caching:** *Cache Invalidation*. When User #42 updates their profile, your app MUST invalidate or update the cached key immediately, or users see stale data!`;
    keyTakeaway = 'In-memory caching absorbs 90% of repeated database reads; always set Time-To-Live (TTL) and invalidate on database writes.';
    actionItem = 'Identify the slowest database query in your app and implement a cache-aside key with a 5-minute TTL.';
  }
  // 8. GIT REBASE VS MERGE
  else if (query.includes('git') || query.includes('rebase') || query.includes('merge') || query.includes('branch') || query.includes('conflict')) {
    text = `### Git Rebase vs. Git Merge: Demystifying Version Control

Both combine changes from one branch into another, but they create completely different commit graphs:

1. **Git Merge (\`git merge feature\`)**:
   - Creates a new **Merge Commit** tying both branch histories together.
   - Preserves historical chronological order exactly as it happened.
   - *Drawback*: Creates a cluttered "railroad track" commit history in large teams.

2. **Git Rebase (\`git rebase main\`)**:
   - Takes your feature commits, temporarily lifts them, moves your branch base to the tip of \`main\`, and replays your commits on top.
   - Results in a **perfectly linear, clean git history**.
   - *Golden Rule of Rebase*: **Never rebase public shared branches** (like \`main\`). Only rebase your local feature branches before opening a Pull Request!

\`\`\`bash
# Standard Professional Feature PR Workflow:
git checkout -b feat/user-auth
# ... make commits ...
git fetch origin
git rebase origin/main
# ... resolve conflicts if any, then ...
git push -u origin feat/user-auth
\`\`\``;
    keyTakeaway = 'Use git merge for recording historical releases; use git rebase on your local feature branches to maintain a clean linear commit log.';
    actionItem = 'Practice interactive rebase locally: run "git rebase -i HEAD~3" to squash messy work-in-progress commits into one semantic commit.';
  }
  // 9. LEETCODE & DSA PATTERNS
  else if (query.includes('leetcode') || query.includes('dsa') || query.includes('algorithm') || query.includes('two pointer') || query.includes('sliding window') || query.includes('dynamic programming') || query.includes('dp') || query.includes('tree') || query.includes('graph')) {
    text = `### Algorithmic Pattern Mastery (NeetCode 150 Method)

Do NOT try to memorize 2,500 random problems. 90% of coding interview rounds test just **6 core algorithmic patterns**:

1. **Two Pointers & Sliding Window**:
   - Used for sorted arrays, contiguous subarrays, and palindrome checks.
   - Reduces $O(N^2)$ brute-force nested loops to $O(N)$ linear scans.
2. **Fast & Slow Pointers (Floyd's Cycle Detection)**:
   - Detecting loops in linked lists or finding the middle node in one pass.
3. **Breadth-First Search (BFS) & Depth-First Search (DFS)**:
   - BFS = Shortest path in unweighted graphs / level-order tree traversal (uses a \`Queue\`).
   - DFS = Exhaustive exploration, backtracking, connected components (uses recursion / \`Stack\`).
4. **Top K Elements (Min-Heap / Max-Heap)**:
   - Finding the Kth largest element in $O(N \\log K)$ rather than sorting in $O(N \\log N)$.
5. **Modified Binary Search**:
   - Search in rotated sorted arrays, finding peak elements, search in $O(\\log N)$.
6. **Dynamic Programming (0/1 Knapsack & State Transitions)**:
   - Start with recursion + memoization (top-down), then convert to iterative tabulation (bottom-up).`;
    keyTakeaway = 'Identify the underlying data structure access pattern; never memorize code lines, memorize invariant properties.';
    actionItem = 'Solve 2 problems from the NeetCode "Sliding Window" category (e.g. Best Time to Buy/Sell Stock, Longest Substring Without Repeating Characters).';
  }
  // 10. SYSTEM DESIGN FOR JUNIORS & CAMPUS
  else if (query.includes('system design') || query.includes('scalab') || query.includes('microservice') || query.includes('monolith') || query.includes('load balancer')) {
    text = `### System Design Fundamentals for CSE Students

In junior interview loops, interviewers do not expect you to design Netflix in 45 minutes. They test **systems intuition and architectural trade-offs**:

#### The 4 Golden Building Blocks:
1. **Load Balancer (Nginx, AWS ALB)**: Distributes incoming web traffic across multiple stateless web application servers using Round Robin or Least Connections algorithms.
2. **Stateless App Servers**: Application servers should NOT store session data in local memory. Offload sessions to Redis so any server can handle any request.
3. **Database Read Replicas**: 80-90% of web traffic is read-heavy. Route \`SELECT\` queries to Read Replicas, and route \`INSERT/UPDATE/DELETE\` transactions to the Primary Database.
4. **Asynchronous Task Queues (BullMQ, Celery, RabbitMQ)**: Never make the user wait 10 seconds while your backend generates a PDF or sends a verification email. Push the job to a queue and return a \`202 Accepted\` status code immediately.`;
    keyTakeaway = 'Keep web servers stateless, scale database reads with replicas, and offload time-consuming tasks to background worker queues.';
    actionItem = 'Draw a simple 4-box architecture diagram for your web project: Client -> Load Balancer -> Node.js Cluster -> PostgreSQL + Redis.';
  }
  // 11. COLLEGE CURRICULUM VS INDUSTRY GAPS
  else if (query.includes('curriculum') || query.includes('college') || query.includes('syllabus') || query.includes('professor') || query.includes('exam') || query.includes('academic')) {
    text = `### Bridging the Academic Syllabus to Industry Reality

University computer science syllabi take 5-7 years to undergo formal accreditation revisions, while modern tech stacks evolve every 18 months.

#### How to Dual-Purpose Your College Work:
1. **Operating Systems Class**: Your professor teaches process scheduling, semaphores, and memory paging in theoretical C.
   - *Industry Translation*: Connect this to **Docker container cgroups**, **Redis mutex locks**, and **Node.js event loops**.
2. **DBMS Class**: Your professor teaches relational algebra and 3rd Normal Form.
   - *Industry Translation*: Connect this to **PostgreSQL indexing**, **database connection pooling**, and **Prisma/Drizzle ORMs**.
3. **Lab Assignments**: When asked to submit a basic Java or C project, write it with:
   - Proper Git feature branches and semantic commits.
   - Clean modular architecture (Controller / Service pattern).
   - A descriptive \`README.md\` and unit test suite.`;
    keyTakeaway = 'College teaches timeless theoretical foundations; your personal side-projects build contemporary production horsepower.';
    actionItem = 'Take your upcoming semester lab assignment and publish it to GitHub with automated CI testing and clean documentation.';
  }
  // 12. GPA / CGPA CUTOFFS & PLACEMENTS
  else if (query.includes('gpa') || query.includes('cgpa') || query.includes('percentage') || query.includes('marks') || query.includes('cutoff')) {
    text = `### The Truth About GPA & Placements

Let's look at the numbers and hiring realities objectively:

1. **The Screening Threshold (The Filter)**:
   - Most campus placement drives and MNCs (TCS, Infosys, Amazon, Microsoft) enforce a **hard automated filter** (typically 6.5 - 7.5 CGPA / ~65-75%).
   - If your CGPA is below the company cutoff, the ATS portal filters your application before a human ever reads your resume.
   - **Action**: Keep your CGPA safely above your university's placement eligibility threshold.

2. **The Interview Table (The Deciding Factor)**:
   - Once you pass the automated filter and sit in front of an engineering hiring manager, **nobody cares whether your CGPA was 7.8 or 9.5**.
   - Engineering managers evaluate:
     - Can you write clean, idiomatic code on a whiteboard?
     - Have you shipped a real project that has live users or live test suites?
     - Do you understand Git, debugging, and system trade-offs?
   - A candidate with a 7.5 CGPA and a live deployed full-stack project will beat a 9.6 CGPA candidate who only memorized textbook slide definitions.`;
    keyTakeaway = 'Treat CGPA as a pass/fail eligibility filter; invest your surplus intellectual energy into verified public software artifacts.';
    actionItem = 'Check your college placement cell cutoff list and set a personal target to stay 0.5 CGPA above the average cutoff.';
  }
  // 13. FINAL YEAR / CAPSTONE PROJECT IDEAS
  else if (query.includes('capstone') || query.includes('final year project') || query.includes('project idea') || query.includes('build')) {
    text = `### Standout Final Year Capstone Project Blueprint

Recruiters review hundreds of identical resumes featuring basic To-Do lists, Weather apps, and generic eCommerce clones.

#### What Makes a Capstone Project Stand Out:
1. **Production Complexity**:
   - Includes real authentication (JWT + HttpOnly cookies or OAuth).
   - Background worker queue for async processing (e.g. BullMQ / Redis).
   - Automated CI/CD pipeline running tests on GitHub Actions.
   - Live production deployment on Vercel / Render / Cloud Run with real HTTPS.
2. **High-Impact Project Archetypes**:
   - **Distributed Collaborative Tool**: Real-time collaborative canvas or document editor using WebSockets and CRDTs.
   - **Developer Ergonomics Tool**: A CLI or dashboard analyzing GitHub PR health, automated code review linting, or API latency monitoring.
   - **AI-Augmented Knowledge Engine**: RAG pipeline (Retrieval Augmented Generation) over college course materials with vector embeddings (Pinecone/pgvector).`;
    keyTakeaway = 'Avoid tutorial clones; build a system with a live public URL, automated testing, and observable production architecture.';
    actionItem = 'Draft a 1-page design document for your capstone project outlining frontend, backend, database, and CI/CD deployment.';
  }
  // 14. RESUME & ATS SCREENING
  else if (query.includes('resume') || query.includes('ats') || query.includes('bullet') || query.includes('cv') || query.includes('screen')) {
    text = `### High-Conversion Resume & ATS Mastery

Tech recruiters spend an average of **6 to 8 seconds** scanning a resume before making a Yes/No triage decision.

#### 1. The Google XYZ Resume Formula:
Every project bullet point must follow this proven structure:
> **"Accomplished [X], as measured by [Y], by doing [Z]"**

- ❌ *Weak Academic Bullet:* "Created a web app for an e-commerce store using React and Node.js."
- ✅ *Strong Engineering Bullet:* "Architected a full-stack e-commerce web platform using React 19 and TypeScript, integrating Redis caching to reduce database read latency by 42% across 1,000+ mock stress-test transactions."

#### 2. Key Formatting Rules:
- **Strictly 1 Page**: Freshers should never have a 2-page resume.
- **Single Column Format**: Multi-column graphical layouts break automated ATS parsers (like Workday, Greenhouse, and Lever).
- **Clickable Links at the Top**: GitHub, LinkedIn, Portfolio URL, and Email.
- **Include Hard Technical Keywords**: TypeScript, Docker, PostgreSQL, REST APIs, CI/CD, Git, Automated Testing.`;
    keyTakeaway = 'Format in a single clean column, quantify your project impact with numbers, and link directly to live working demos.';
    actionItem = 'Rewrite the top 3 bullet points on your resume using the Google XYZ formula: Accomplished X measured by Y by doing Z.';
  }
  // 15. COLD OUTREACH & OFF-CAMPUS PLACEMENT
  else if (query.includes('cold') || query.includes('linkedin') || query.includes('outreach') || query.includes('off-campus') || query.includes('referral')) {
    text = `### Off-Campus Placement & Cold Outreach Strategy

Applying through standard LinkedIn "Easy Apply" buttons yields a <2% response rate. High-performing students use **targeted engineering outreach**:

#### The 3-Sentence LinkedIn Outreach Template:
Send this connection note directly to **Engineering Managers** or **Senior Engineers** (not generic HR):

> *"Hi [Name], I noticed your team is scaling the [Product Name] infrastructure at [Company]. I'm a final-year CSE student who built an open-source [related tool/project] with TypeScript and Docker, complete with live benchmarks: [Live Demo Link]. I'd love to learn what core engineering traits your team prioritizes for junior roles!"*

#### Why This Works:
1. It shows you researched their specific engineering work.
2. It provides immediate proof of capability via a live link.
3. It asks for genuine technical advice rather than a desperate "Please give me a job" plea.`;
    keyTakeaway = 'Bypass crowded job portals by contacting engineering leads directly with concise messages highlighting a live project demo.';
    actionItem = 'Identify 3 companies you admire, find 2 engineering team leads on LinkedIn, and send a personalized note with your portfolio link.';
  }
  // 16. DYNAMIC CONTEXTUAL RESPONSE SYNTHESIZER
  else {
    const role = studentContext.targetRole || 'Software Engineer';
    const personaTitle = personaId === 'tech-lead' ? 'Senior Staff Engineer' : personaId === 'interview-coach' ? 'Technical Interview Coach' : personaId === 'campus-pivot' ? 'Curriculum-to-Industry Specialist' : 'Senior Tech Recruiter';

    text = `### Perspective from ${personaTitle} on "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}"

Addressing your question directly regarding **${role}**:

1. **The Core Engineering Reality**:
   When evaluating technical challenges in this domain, top tech organizations evaluate candidates based on **problem-solving decomposition, predictable operational patterns, and code maintainability**.

2. **How to Approach This Pragmatically**:
   - Break the problem down into isolated components (data ingestion, business logic transformation, and client presentation).
   - Write clear automated tests covering both the happy path and failure edge cases.
   - Document any architectural trade-offs you make in a concise project \`README.md\`.

3. **Industry Standard vs. Academic Theory**:
   In college, theoretical correctness is rewarded; in industry, **observability, error handling, and deployment reliability** are what keep production systems running smoothly.`;

    keyTakeaway = `Focus on concrete engineering fundamentals, type safety, and automated test coverage for ${role}.`;
    actionItem = `Take the core concept from your question and implement a small 50-line proof-of-concept repository with Git version control.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'mentor',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    personaId,
    keyTakeaway,
    actionItem,
  };
}

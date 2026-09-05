import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// AI Status
app.get('/api/ai/status', (req, res) => {
  const isConfigured = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    geminiAvailable: isConfigured,
    model: isConfigured ? 'gemini-2.5-flash' : 'intelligent-local-heuristic-engine',
    mode: isConfigured ? 'cloud-gemini' : 'free-rule-based-engine',
  });
});

// Feature 1: Career Guidance API
app.post('/api/ai/career-guidance', async (req, res) => {
  try {
    const { studentProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No external API key required. Returning curated industry intelligence analysis.',
      });
    }

    const prompt = `You are a Senior Principal Tech Recruiter and CSE Career Counselor.
Analyze this computer science student profile and provide a structured JSON response:
Student Profile:
- Year of Study: ${studentProfile.academicYear}
- Desired Role / Interest: ${studentProfile.targetRole}
- Current Programming Languages: ${studentProfile.languages?.join(', ')}
- Known Frameworks & Tools: ${studentProfile.frameworks?.join(', ')}
- Coding Comfort Level: ${studentProfile.experienceLevel}
- College Curriculum Focus: ${studentProfile.academicFocus || 'General CSE Core'}
- Primary Career Goal: ${studentProfile.primaryGoal || 'High-Growth Tech Employment'}

Provide ONLY valid JSON matching this schema:
{
  "primaryRole": "Exact job title",
  "matchScore": number (60-98),
  "marketDemand": "Very High" | "High" | "Moderate",
  "salaryRange": "e.g. $75k-$110k or ₹8-18 LPA",
  "summary": "2-3 sentences of direct career appraisal",
  "industryCurriculumGaps": [
    {
      "collegeTeaches": "what university syllabus covers",
      "industryDemands": "what real production teams test for in 2026",
      "severity": "Critical" | "Important" | "Moderate"
    }
  ],
  "recommendedTechStack": ["tool1", "tool2", "tool3", "tool4", "tool5"],
  "alternativePathways": [
    {
      "role": "Alternative job title",
      "matchScore": number,
      "reason": "Short reason why they fit"
    }
  ],
  "thirtyDayActionPlan": [
    {
      "week": "Week 1",
      "focus": "Core concept focus",
      "action": "Concrete deliverable"
    },
    {
      "week": "Week 2",
      "focus": "Core concept focus",
      "action": "Concrete deliverable"
    },
    {
      "week": "Week 3",
      "focus": "Core concept focus",
      "action": "Concrete deliverable"
    },
    {
      "week": "Week 4",
      "focus": "Core concept focus",
      "action": "Concrete deliverable"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed, provider: 'gemini-2.5-flash' });
  } catch (error: any) {
    console.error('Gemini career guidance error:', error.message);
    return res.status(200).json({
      fallback: true,
      error: error.message,
    });
  }
});

// Feature 2: Skill Roadmap API
app.post('/api/ai/generate-roadmap', async (req, res) => {
  try {
    const { targetRole, currentLevel, weeklyHours } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    const prompt = `Generate a personalized, 4-phase learning roadmap for a CSE student aiming to become a "${targetRole}".
Current Level: ${currentLevel}, Available study time: ${weeklyHours} hrs/week.

Return ONLY a valid JSON object with:
{
  "role": "${targetRole}",
  "totalEstimatedWeeks": number,
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "tagline": "Short description of focus",
      "estimatedDuration": "e.g. 3 Weeks",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "milestones": [
        {
          "id": "m1",
          "title": "Milestone title",
          "description": "Concrete learning goal",
          "topics": ["topic A", "topic B", "topic C"],
          "recommendedResource": "Name of free resource or documentation",
          "deliverable": "Project or task to prove mastery"
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, data: parsed, provider: 'gemini-2.5-flash' });
  } catch (error: any) {
    console.error('Gemini roadmap generation error:', error.message);
    return res.status(200).json({ fallback: true, error: error.message });
  }
});

// Feature 4: AI Mentorship Chat API
app.post('/api/ai/mentor-chat', async (req, res) => {
  try {
    const { mentorPersona, message, history, studentContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    let personaPrompt = 'You are a warm, pragmatic, and high-standard software engineering mentor.';
    if (mentorPersona === 'tech-lead') {
      personaPrompt = 'You are Arun Kumar, a Senior Staff Engineer at a tier-1 tech company with 12+ years of experience. You give deep, concrete architectural advice, emphasize clean code, production realities, concurrency, system design, debugging, and systems thinking. When asked about any technology, algorithm, or engineering decision, you give precise, rigorous explanations with concrete code snippets, commands, or architectural trade-offs.';
    } else if (mentorPersona === 'interview-coach') {
      personaPrompt = 'You are Sarah Jenkins, a dedicated Technical Interview & DSA Coach with ex-FAANG hiring committee experience. You specialize in algorithmic patterns (Sliding Window, Two Pointers, BFS/DFS, DP, Heaps), behavioral answers via STAR method, and live interview thought articulation. When asked a coding or interview question, you break down the approach, time/space complexity, and invariant patterns clearly.';
    } else if (mentorPersona === 'campus-pivot') {
      personaPrompt = 'You are Dr. Priya Sharma, a Computer Science Professor who transitioned to Lead AI & Cloud Engineer. You deeply understand the gaps in traditional Indian/international university curricula (outdated C/Java, rote memorization, theoretical OS) and guide students on how to bridge the gap to modern high-paying tech jobs without neglecting their college GPA.';
    } else if (mentorPersona === 'resume-recruiter') {
      personaPrompt = 'You are Marcus Vance, a Senior Technical Recruiter who has screened over 25,000 engineering resumes. You give high-ROI advice on resume wording (Google XYZ formula: Accomplished X by doing Y measured by Z), ATS keywords, GitHub portfolio presentation, cold outreach, and how freshers without experience stand out.';
    }

    const systemInstruction = `${personaPrompt}

CRITICAL RULES FOR RELEVANT, ACCURATE, HIGH-QUALITY ANSWERS:
1. ALWAYS DIRECTLY AND SPECIFICALLY ANSWER THE STUDENT'S EXACT QUESTION. Never give generic boilerplate or deflect to general career topics if they asked a specific technical, conceptual, or tactical question.
2. If the user asks about a specific technology, concept, syntax, or tool (e.g. React hooks, Docker vs VM, SQL vs NoSQL, CORS, JWT, Big-O, Redis, Git rebase, etc.):
   - Give a clear, technically accurate explanation immediately.
   - Contrast university textbook definition with actual industry production practice.
   - Include a concise code snippet, CLI command, or ASCII architectural flow where appropriate.
3. If the user asks about interviews, resume, or career dilemmas:
   - Provide concrete, actionable frameworks (e.g. STAR method, NeetCode 150 roadmap, XYZ bullet formula).
4. Formatting structure:
   - **Direct Answer**: Clear, unambiguous technical or strategic response to the exact query.
   - **Production Nuance / How Senior Engineers Think**: The practical real-world reality.
   - **Actionable Next Step**: 1 concrete exercise or command the student can run today.
   - Tone: Friendly, encouraging, rigorous, and direct.`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: `Student Profile Context: Target Role = ${studentContext?.targetRole || 'Software Engineer'}, Academic Year = ${studentContext?.academicYear || 'Final Year'}, College = ${studentContext?.college || 'Engineering College'}.

Student's Question: "${message}"

Please provide a direct, highly relevant, and insightful answer addressing this exact question.`,
    });

    return res.json({
      success: true,
      reply: response.text,
      provider: 'gemini-2.5-flash',
    });
  } catch (error: any) {
    console.error('Gemini mentor chat error:', error.message);
    return res.status(200).json({ fallback: true, error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`learnpath ai server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resume, jobDescription, targetRole } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert resume analyzer and career coach. Analyze the resume against the job description and return a detailed JSON analysis.

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "matchScore": <number 0-100>,
  "scoreBreakdown": {
    "skillMatch": {"score": <0-40>, "maxScore": 40, "details": "explanation"},
    "experienceRelevance": {"score": <0-20>, "maxScore": 20, "details": "explanation"},
    "projects": {"score": <0-15>, "maxScore": 15, "details": "explanation"},
    "education": {"score": <0-10>, "maxScore": 10, "details": "explanation"},
    "atsKeywordPresence": {"score": <0-15>, "maxScore": 15, "details": "explanation"}
  },
  "extractedSkills": {
    "programming": ["skill1", "skill2"],
    "aiMl": ["skill1"],
    "toolsFrameworks": ["skill1"],
    "databases": ["skill1"],
    "softSkills": ["skill1"],
    "other": ["skill1"]
  },
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "irrelevantContent": ["description of irrelevant section 1"],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
  "sectionEvaluation": [
    {
      "section": "Skills",
      "strength": "Strong|Moderate|Needs Improvement",
      "feedback": "detailed feedback",
      "suggestions": ["suggestion 1"]
    }
  ],
  "weakBulletPoints": [
    {
      "original": "weak bullet text from resume",
      "section": "which section it's from"
    }
  ],
  "atsOptimization": {
    "missingKeywords": ["keyword1"],
    "suggestedKeywords": ["keyword1"],
    "formattingTips": ["tip1", "tip2"]
  },
  "careerPaths": [
    {
      "role": "Job Title",
      "matchPercentage": 85,
      "explanation": "Why this role fits based on skills"
    }
  ],
  "learningResources": [
    {
      "skill": "missing skill name",
      "resources": [
        {"name": "Course Name", "platform": "Coursera/edX/freeCodeCamp/YouTube/Google Cloud Skills Boost", "url": "https://..."}
      ]
    }
  ],
  "atsKeywords": ["keyword1", "keyword2"],
  "skillCategories": [
    {"category": "Technical Skills", "score": 80},
    {"category": "Experience", "score": 70},
    {"category": "Education", "score": 60},
    {"category": "Soft Skills", "score": 50},
    {"category": "Projects", "score": 40},
    {"category": "Keywords/ATS", "score": 30}
  ],
  "actionPlan": [
    "Concrete step 1 to improve resume",
    "Concrete step 2",
    "Concrete step 3",
    "Concrete step 4",
    "Concrete step 5"
  ]
}

Important rules:
- The matchScore MUST equal the sum of all scoreBreakdown scores.
- Extract ALL skills from the resume including those implied by experience descriptions.
- Handle abbreviations (ML = Machine Learning), synonyms, and misspellings with fuzzy matching.
- For weakBulletPoints, find 3-5 vague or weak bullet points from the resume that lack metrics or specifics.
- For careerPaths, suggest 3-5 roles that match the resume skills.
- For sectionEvaluation, evaluate: Skills, Projects, Work Experience, Education, and Achievements/Certifications.
- For learningResources, provide 3-5 real free courses per missing skill.
- For actionPlan, provide 5-7 concrete, prioritized steps.
- Be realistic, specific, and honest in scoring.`;

    const userPrompt = `Analyze this resume against the job description:

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

${targetRole ? `TARGET ROLE: ${targetRole}` : ""}

Return ONLY the JSON analysis object.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("No response from AI");

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        const objMatch = content.match(/\{[\s\S]*\}/);
        if (objMatch) {
          parsed = JSON.parse(objMatch[0]);
        } else {
          throw new Error("Could not parse AI response as JSON");
        }
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, TrendingUp, BookOpen, Lightbulb, Target, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScoreCircle } from "@/components/ScoreCircle";
import { SkillRadarChart } from "@/components/SkillRadarChart";

interface AnalysisResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  irrelevantContent: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  learningResources: { skill: string; resources: { name: string; platform: string; url: string }[] }[];
  atsKeywords: string[];
  skillCategories: { category: string; score: number }[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResults");
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch {
        navigate("/analyze");
      }
    } else {
      navigate("/analyze");
    }
  }, [navigate]);

  if (!results) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            ResumeAI
          </Link>
          <div className="flex gap-2">
            <Link to="/analyze">
              <Button variant="outline" size="sm" className="rounded-full">
                <RefreshCw className="w-4 h-4 mr-1" /> New Analysis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header + Score */}
          <motion.div initial="hidden" animate="visible" className="text-center mb-10">
            <motion.h1 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Analysis Results
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">
              Here's how your resume matches the job description
            </motion.p>
          </motion.div>

          {/* Score + Radar */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="bg-card rounded-2xl p-8 shadow-card flex flex-col items-center justify-center">
              <h2 className="font-display font-semibold text-foreground mb-4">Match Score</h2>
              <ScoreCircle score={results.matchScore} />
              <p className="text-muted-foreground text-sm mt-4 text-center">
                {results.matchScore >= 80 ? "Excellent match! Your resume aligns well." :
                 results.matchScore >= 60 ? "Good match with room for improvement." :
                 results.matchScore >= 40 ? "Moderate match. Consider the suggestions below." :
                 "Low match. Significant improvements needed."}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="bg-card rounded-2xl p-8 shadow-card">
              <h2 className="font-display font-semibold text-foreground mb-4 text-center">Skill Categories</h2>
              <SkillRadarChart categories={results.skillCategories} />
            </motion.div>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Matching Skills */}
            <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-mint-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Matching Skills</h3>
                <span className="ml-auto text-sm font-medium text-mint-foreground bg-mint rounded-full px-2 py-0.5">
                  {results.matchingSkills.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.matchingSkills.map(s => (
                  <span key={s} className="bg-mint/60 text-mint-foreground text-sm px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </motion.div>

            {/* Missing Skills */}
            <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-peach-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Missing Skills</h3>
                <span className="ml-auto text-sm font-medium text-peach-foreground bg-peach rounded-full px-2 py-0.5">
                  {results.missingSkills.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.map(s => (
                  <span key={s} className="bg-peach/60 text-peach-foreground text-sm px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-sky-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {results.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-lavender flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-lavender-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Weaknesses</h3>
              </div>
              <ul className="space-y-2">
                {results.weaknesses.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Irrelevant Content */}
          {results.irrelevantContent.length > 0 && (
            <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-peach-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Irrelevant or Weak Sections</h3>
              </div>
              <ul className="space-y-2">
                {results.irrelevantContent.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* AI Suggestions */}
          <motion.div variants={fadeUp} custom={9} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-lavender flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-lavender-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">AI Suggestions</h3>
            </div>
            <ul className="space-y-3">
              {results.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground bg-muted/50 rounded-xl p-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ATS Keywords */}
          {results.atsKeywords.length > 0 && (
            <motion.div variants={fadeUp} custom={10} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center">
                  <Target className="w-4 h-4 text-sky-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground">ATS Keywords to Include</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.atsKeywords.map(k => (
                  <span key={k} className="bg-sky/60 text-sky-foreground text-sm px-3 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Learning Resources */}
          <motion.div variants={fadeUp} custom={11} initial="hidden" animate="visible" className="bg-card rounded-2xl p-6 shadow-card mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-mint-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">Learning Resources</h3>
            </div>
            <div className="space-y-4">
              {results.learningResources.map((lr, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground text-sm mb-2">📚 {lr.skill}</h4>
                  <div className="space-y-1.5">
                    {lr.resources.map((r, j) => (
                      <a
                        key={j}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {r.name}
                        <span className="text-muted-foreground text-xs">({r.platform})</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action */}
          <motion.div variants={fadeUp} custom={12} initial="hidden" animate="visible" className="text-center">
            <Link to="/analyze">
              <Button size="lg" className="rounded-full px-10 shadow-soft">
                <RefreshCw className="w-4 h-4 mr-2" /> Analyze Again
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

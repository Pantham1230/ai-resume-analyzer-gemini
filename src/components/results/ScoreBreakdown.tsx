import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ScoreItem {
  score: number;
  maxScore: number;
  details: string;
}

interface ScoreBreakdownData {
  skillMatch: ScoreItem;
  experienceRelevance: ScoreItem;
  projects: ScoreItem;
  education: ScoreItem;
  atsKeywordPresence: ScoreItem;
}

const labels: Record<string, { label: string; colorClass: string }> = {
  skillMatch: { label: "Skill Match", colorClass: "bg-lavender" },
  experienceRelevance: { label: "Experience Relevance", colorClass: "bg-mint" },
  projects: { label: "Projects", colorClass: "bg-peach" },
  education: { label: "Education", colorClass: "bg-sky" },
  atsKeywordPresence: { label: "ATS Keywords", colorClass: "bg-secondary" },
};

export function ScoreBreakdown({ breakdown, totalScore, delay = 0 }: { breakdown: ScoreBreakdownData; totalScore: number; delay?: number }) {
  const entries = Object.entries(breakdown).filter(([, v]) => v && typeof v.score === "number");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-lavender flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-lavender-foreground" />
        </div>
        Score Breakdown
      </h2>
      <div className="space-y-4">
        {entries.map(([key, item], i) => {
          const config = labels[key] || { label: key, colorClass: "bg-muted" };
          const pct = (item.score / item.maxScore) * 100;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{config.label}</span>
                <span className="text-sm font-bold text-foreground">{item.score} / {item.maxScore}</span>
              </div>
              <Progress value={pct} className="h-2.5" />
              <p className="text-xs text-muted-foreground mt-1">{item.details}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="font-display font-semibold text-foreground">Total Match Score</span>
        <span className="text-2xl font-bold text-primary">{totalScore}%</span>
      </div>
    </motion.div>
  );
}

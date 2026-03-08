import { motion } from "framer-motion";
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectionEval {
  section: string;
  strength: string;
  feedback: string;
  suggestions: string[];
}

const strengthConfig: Record<string, { icon: typeof CheckCircle2; badgeClass: string }> = {
  Strong: { icon: CheckCircle2, badgeClass: "bg-mint text-mint-foreground" },
  Moderate: { icon: AlertTriangle, badgeClass: "bg-peach text-peach-foreground" },
  "Needs Improvement": { icon: XCircle, badgeClass: "bg-destructive/20 text-destructive" },
};

export function SectionEvaluation({ sections, delay = 0 }: { sections: SectionEval[]; delay?: number }) {
  if (!sections || sections.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center">
          <ClipboardCheck className="w-4 h-4 text-sky-foreground" />
        </div>
        Resume Section Evaluation
      </h2>
      <div className="space-y-4">
        {sections.map((s, i) => {
          const config = strengthConfig[s.strength] || strengthConfig["Moderate"];
          const Icon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + i * 0.08 }}
              className="bg-muted/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-foreground">{s.section}</h4>
                <Badge className={`${config.badgeClass} border-0`}>
                  <Icon className="w-3 h-3 mr-1" />
                  {s.strength}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{s.feedback}</p>
              {s.suggestions.length > 0 && (
                <ul className="space-y-1">
                  {s.suggestions.map((sug, j) => (
                    <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span> {sug}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

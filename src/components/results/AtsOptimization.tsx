import { motion } from "framer-motion";
import { Target, AlertCircle, Lightbulb, FileText } from "lucide-react";

interface AtsData {
  missingKeywords: string[];
  suggestedKeywords: string[];
  formattingTips: string[];
}

export function AtsOptimization({ data, delay = 0 }: { data: AtsData; delay?: number }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center">
          <Target className="w-4 h-4 text-sky-foreground" />
        </div>
        ATS Optimization Suggestions
      </h2>

      <div className="space-y-4">
        {data.missingKeywords?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-foreground">Missing ATS Keywords</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.missingKeywords.map((k) => (
                <span key={k} className="bg-peach/60 text-peach-foreground text-xs px-2.5 py-1 rounded-full">{k}</span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Adding these keywords can significantly improve your ATS pass rate.</p>
          </div>
        )}

        {data.suggestedKeywords?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Suggested Keywords</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.suggestedKeywords.map((k) => (
                <span key={k} className="bg-mint/60 text-mint-foreground text-xs px-2.5 py-1 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        )}

        {data.formattingTips?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Resume Formatting Tips</span>
            </div>
            <ul className="space-y-1.5">
              {data.formattingTips.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

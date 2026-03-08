import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";

export function ActionPlan({ steps, delay = 0 }: { steps: string[]; delay?: number }) {
  if (!steps || steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center">
          <ListChecks className="w-4 h-4 text-mint-foreground" />
        </div>
        Action Plan to Improve Your Resume
      </h2>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.06 }}
            className="flex items-start gap-3 bg-muted/50 rounded-xl p-3"
          >
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </span>
            <p className="text-sm text-foreground">{step}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

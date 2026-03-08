import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CareerPath {
  role: string;
  matchPercentage: number;
  explanation: string;
}

export function CareerPaths({ paths, delay = 0 }: { paths: CareerPath[]; delay?: number }) {
  if (!paths || paths.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-lavender flex items-center justify-center">
          <Compass className="w-4 h-4 text-lavender-foreground" />
        </div>
        Best Career Paths Based on Your Resume
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {paths.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + i * 0.08 }}
            className="bg-muted/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-foreground">{p.role}</h4>
              <span className="text-xs font-bold text-primary">{p.matchPercentage}%</span>
            </div>
            <Progress value={p.matchPercentage} className="h-1.5 mb-2" />
            <p className="text-xs text-muted-foreground">{p.explanation}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

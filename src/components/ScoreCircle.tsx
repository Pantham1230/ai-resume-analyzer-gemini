import { motion } from "framer-motion";

export function ScoreCircle({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "hsl(160, 45%, 45%)";
    if (s >= 60) return "hsl(200, 60%, 50%)";
    if (s >= 40) return "hsl(40, 80%, 55%)";
    return "hsl(0, 70%, 60%)";
  };

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <motion.circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-display font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-muted-foreground">Match</span>
      </div>
    </div>
  );
}

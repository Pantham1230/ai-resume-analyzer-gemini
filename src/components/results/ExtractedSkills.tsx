import { motion } from "framer-motion";
import { Code2, Brain, Wrench, Database, Users, MoreHorizontal } from "lucide-react";

interface ExtractedSkillsData {
  programming?: string[];
  aiMl?: string[];
  toolsFrameworks?: string[];
  databases?: string[];
  softSkills?: string[];
  other?: string[];
}

const categoryConfig = [
  { key: "programming", label: "Programming", icon: Code2, colorClass: "bg-lavender text-lavender-foreground" },
  { key: "aiMl", label: "AI / ML", icon: Brain, colorClass: "bg-peach text-peach-foreground" },
  { key: "toolsFrameworks", label: "Tools & Frameworks", icon: Wrench, colorClass: "bg-mint text-mint-foreground" },
  { key: "databases", label: "Databases", icon: Database, colorClass: "bg-sky text-sky-foreground" },
  { key: "softSkills", label: "Soft Skills", icon: Users, colorClass: "bg-secondary text-secondary-foreground" },
  { key: "other", label: "Other", icon: MoreHorizontal, colorClass: "bg-muted text-muted-foreground" },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export function ExtractedSkills({ skills, delay = 0 }: { skills: ExtractedSkillsData; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Code2 className="w-4 h-4 text-primary-foreground" />
        </div>
        Extracted Skills from Resume
      </h2>
      <div className="space-y-4">
        {categoryConfig.map(({ key, label, icon: Icon, colorClass }, idx) => {
          const items = skills[key as keyof ExtractedSkillsData];
          if (!items || items.length === 0) return null;
          return (
            <motion.div key={key} variants={fadeUp} custom={idx} initial="hidden" animate="visible">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span key={skill} className={`${colorClass} text-xs px-2.5 py-1 rounded-full font-medium`}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

interface Props {
  categories: { category: string; score: number }[];
}

export function SkillRadarChart({ categories }: Props) {
  if (!categories || categories.length === 0) {
    return <p className="text-muted-foreground text-sm text-center">No category data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={categories}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

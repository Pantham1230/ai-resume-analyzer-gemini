import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Clock, TrendingUp, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Analysis {
  id: string;
  target_role: string | null;
  match_score: number | null;
  created_at: string;
  results: any;
  resume_text: string;
  job_description: string;
}

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) fetchAnalyses();
  }, [user, authLoading]);

  const fetchAnalyses = async () => {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setAnalyses(data as Analysis[]);
    setLoading(false);
  };

  const deleteAnalysis = async (id: string) => {
    const { error } = await supabase.from("analyses").delete().eq("id", id);
    if (!error) {
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Deleted", description: "Analysis removed." });
    }
  };

  const viewAnalysis = (analysis: Analysis) => {
    sessionStorage.setItem("analysisResults", JSON.stringify(analysis.results));
    navigate("/results");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) return null;

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
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your resume analyses</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/analyze">
              <div className="bg-card rounded-2xl p-8 shadow-card border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors cursor-pointer text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-lavender flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">New Analysis</h3>
                <p className="text-muted-foreground text-sm">Upload your resume and job description</p>
              </div>
            </Link>
          </motion.div>

          {/* Past Analyses */}
          <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" /> Past Analyses
          </h2>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : analyses.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 shadow-card text-center">
              <p className="text-muted-foreground">No analyses yet. Start your first one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl p-5 shadow-card flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-lavender flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {a.target_role || "Resume Analysis"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()} · Match: {a.match_score ?? "N/A"}%
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => viewAnalysis(a)}>
                      View
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteAnalysis(a.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

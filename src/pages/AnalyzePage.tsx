import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Briefcase, Loader2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DEMO_RESUME = `John Doe
Software Engineer | 5 years experience

Skills: JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Docker, AWS, REST APIs

Experience:
- Senior Frontend Developer at TechCorp (2022-Present)
  Built React applications serving 100K+ users
  Led migration from JavaScript to TypeScript
  Implemented CI/CD pipelines

- Full Stack Developer at StartupXYZ (2020-2022)
  Developed REST APIs with Node.js and Express
  Built responsive UIs with React and Tailwind CSS
  Managed PostgreSQL databases

Education: BS Computer Science, State University (2019)

Projects:
- E-commerce platform with React, Node.js, Stripe integration
- Real-time chat application using WebSocket and Redis`;

const DEMO_JD = `Senior Full Stack Engineer

We're looking for an experienced engineer to join our team.

Required Skills:
- 4+ years experience with React and TypeScript
- Strong Node.js and Express.js skills
- Experience with PostgreSQL or similar databases
- Docker and Kubernetes knowledge
- AWS or GCP cloud services experience
- GraphQL API development
- CI/CD pipeline management
- Unit and integration testing (Jest, Cypress)

Nice to have:
- Experience with microservices architecture
- Knowledge of Redis and message queues
- Machine learning basics
- Experience with Terraform or infrastructure as code`;

export default function AnalyzePage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadDemo = () => {
    setResume(DEMO_RESUME);
    setJobDescription(DEMO_JD);
    setTargetRole("Senior Full Stack Engineer");
    toast({ title: "Demo loaded!", description: "Sample resume and job description have been filled in." });
  };

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast({ title: "Missing information", description: "Please provide both resume and job description.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resume, jobDescription, targetRole },
      });

      if (error) throw error;

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("analysisResults", JSON.stringify(data));
      sessionStorage.setItem("analysisResume", resume);
      sessionStorage.setItem("analysisJD", jobDescription);
      navigate("/results");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Analysis failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            ResumeAI
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Analyze Your Resume
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              Paste your resume and job description to get AI-powered insights
            </p>
            <Button variant="outline" size="sm" onClick={loadDemo} className="rounded-full">
              <Sparkles className="w-4 h-4 mr-1" /> Load Demo Data
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-card rounded-2xl p-6 shadow-card h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center">
                    <Upload className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-foreground">Resume</h2>
                    <p className="text-xs text-muted-foreground">Paste your resume content</p>
                  </div>
                </div>
                <Textarea
                  placeholder="Paste your resume text here..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  className="min-h-[300px] resize-none rounded-xl border-border bg-muted/30 focus:bg-card transition-colors"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-card rounded-2xl p-6 shadow-card h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-foreground">Job Description</h2>
                    <p className="text-xs text-muted-foreground">Paste the target job description</p>
                  </div>
                </div>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[300px] resize-none rounded-xl border-border bg-muted/30 focus:bg-card transition-colors"
                />
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 shadow-card mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-foreground">Target Role</h2>
                <p className="text-xs text-muted-foreground">Optional: specify the role you're targeting</p>
              </div>
            </div>
            <Input
              placeholder="e.g., Senior Software Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="rounded-xl bg-muted/30 focus:bg-card transition-colors"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resume.trim() || !jobDescription.trim()}
              className="rounded-full px-10 text-base shadow-soft"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  Start AI Analysis <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10 text-center"
              >
                <div className="bg-card rounded-2xl p-8 shadow-card max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">Analyzing your resume...</h3>
                  <p className="text-muted-foreground text-sm">Our AI is parsing skills, matching keywords, and generating insights</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

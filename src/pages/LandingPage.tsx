import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Target, Brain, Lightbulb, TrendingUp, BookOpen, Star, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  { icon: Target, title: "Skill Matching", desc: "See exactly which skills match the job requirements", color: "bg-lavender" },
  { icon: Brain, title: "AI Analysis", desc: "Deep NLP-powered resume parsing and scoring", color: "bg-mint" },
  { icon: Lightbulb, title: "Smart Suggestions", desc: "Get actionable tips to improve your resume", color: "bg-peach" },
  { icon: TrendingUp, title: "Match Score", desc: "Know your compatibility percentage instantly", color: "bg-sky" },
  { icon: BookOpen, title: "Learning Resources", desc: "Free courses to fill your skill gaps", color: "bg-lavender" },
  { icon: Sparkles, title: "ATS Optimization", desc: "Optimize keywords for applicant tracking systems", color: "bg-mint" },
];

const testimonials = [
  { name: "Sarah K.", role: "Software Engineer", text: "This tool helped me land my dream job at a top tech company. The skill gap analysis was incredibly accurate!", rating: 5 },
  { name: "James R.", role: "Product Manager", text: "I improved my resume match score from 45% to 89% using the suggestions. Highly recommend!", rating: 5 },
  { name: "Priya M.", role: "Data Analyst", text: "The learning resource recommendations were perfect. I filled my skill gaps in just 2 weeks.", rating: 5 },
];

export default function LandingPage() {
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
          <div className="flex items-center gap-3">
            <Link to="/analyze">
              <Button variant="ghost" size="sm">Try Demo</Button>
            </Link>
            <Link to="/analyze">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-card rounded-full px-4 py-1.5 shadow-card mb-6 text-sm font-medium text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Resume Analysis
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
              AI Resume<br />
              <span className="text-primary">Analyzer</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Understand how well your resume matches your dream job. Get AI-powered insights, skill gap analysis, and free learning resources.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze">
                <Button size="lg" className="rounded-full px-8 text-base shadow-soft">
                  Analyze My Resume <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/analyze">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base">
                  Try Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-lg mx-auto">
              Everything you need to perfect your resume for any job
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-shadow duration-300"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Upload Resume", desc: "Paste your resume text or key details" },
              { step: "2", title: "Add Job Description", desc: "Paste the job description you're targeting" },
              { step: "3", title: "Get AI Insights", desc: "Receive detailed analysis with actionable feedback" },
            ].map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
            Loved by Job Seekers
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground text-sm mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Improve Your Resume?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
              Start your free analysis now and get closer to your dream job
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/analyze">
                <Button size="lg" className="rounded-full px-10 text-base shadow-soft">
                  Start Free Analysis <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2026 ResumeAI. AI-powered resume analysis for job seekers.
        </div>
      </footer>
    </div>
  );
}

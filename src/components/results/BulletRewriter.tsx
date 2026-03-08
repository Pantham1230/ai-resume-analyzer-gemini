import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeakBullet {
  original: string;
  section: string;
}

export function BulletRewriter({ bullets, jobDescription, delay = 0 }: { bullets: WeakBullet[]; jobDescription?: string; delay?: number }) {
  const [improved, setImproved] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  if (!bullets || bullets.length === 0) return null;

  const handleRewrite = async (index: number, bullet: string) => {
    setLoading((p) => ({ ...p, [index]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("rewrite-bullet", {
        body: { bulletPoint: bullet, jobContext: jobDescription },
      });
      if (error) throw error;
      setImproved((p) => ({ ...p, [index]: data.improved }));
    } catch (err: any) {
      toast({ title: "Rewrite failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading((p) => ({ ...p, [index]: false }));
    }
  };

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [index]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [index]: false })), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center">
          <Wand2 className="w-4 h-4 text-peach-foreground" />
        </div>
        AI Bullet Point Rewriter
      </h2>
      <p className="text-sm text-muted-foreground mb-4">These bullet points could be more impactful. Click "Improve with AI" to get a stronger version.</p>
      <div className="space-y-4">
        {bullets.map((b, i) => (
          <div key={i} className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">{b.section}</span>
            </div>
            <p className="text-sm text-foreground mb-2">
              <span className="text-muted-foreground">Original: </span>{b.original}
            </p>
            {improved[i] ? (
              <div className="bg-mint/30 rounded-lg p-3 mb-2">
                <p className="text-sm text-foreground">
                  <span className="text-mint-foreground font-medium">Improved: </span>{improved[i]}
                </p>
              </div>
            ) : null}
            <div className="flex gap-2">
              {!improved[i] ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={() => handleRewrite(i, b.original)}
                  disabled={loading[i]}
                >
                  {loading[i] ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
                  Improve with AI
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={() => handleCopy(i, improved[i])}
                >
                  {copied[i] ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied[i] ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

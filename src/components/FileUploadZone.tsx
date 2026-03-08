import { useCallback, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadZoneProps {
  label: string;
  description: string;
  onTextExtracted: (text: string) => void;
  extractedText: string;
  colorClass: string;
}

export function FileUploadZone({ label, description, onTextExtracted, extractedText, colorClass }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 20MB.", variant: "destructive" });
      return;
    }

    setFileName(file.name);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data, error } = await supabase.functions.invoke("parse-resume", {
        body: formData,
      });

      if (error) throw error;
      if (data?.text) {
        onTextExtracted(data.text);
        toast({ title: "File parsed!", description: "Text extracted successfully." });
      } else {
        throw new Error("No text returned");
      }
    } catch (err: any) {
      console.error("Parse error:", err);
      toast({ title: "Parse failed", description: err.message || "Could not extract text.", variant: "destructive" });
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  }, [onTextExtracted, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setFileName(null);
    onTextExtracted("");
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
        }`}
      >
        {isParsing ? (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-full ${colorClass} flex items-center justify-center animate-pulse-soft`}>
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
            <p className="font-medium text-foreground">Extracting text from {fileName}...</p>
            <p className="text-xs text-muted-foreground">This may take a moment</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-full ${colorClass} flex items-center justify-center`}>
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{fileName}</p>
              <button onClick={clearFile} className="text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-full ${colorClass} flex items-center justify-center`}>
              <Upload className="w-7 h-7 text-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
            <label>
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <span>Browse Files</span>
              </Button>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {extractedText && (
        <div className="bg-muted/50 rounded-xl p-4 max-h-48 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground mb-1">Extracted Text Preview:</p>
          <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-[8]">{extractedText}</p>
        </div>
      )}
    </div>
  );
}

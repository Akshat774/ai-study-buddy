"use client";

import React from "react";

import { useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Summary {
  id: string;
  title: string;
  summary: string;
  subject?: string;
  examType?: string;
  timestamp: Date;
}

export default function NotesSummarizerPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [formData, setFormData] = useState({
    notes: "",
    subject: "",
    examType: "",
    title: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter some notes to summarize",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("[v0] Fetching summarize-notes API...");
      const response = await fetch("/api/summarize-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("[v0] Response status:", response.status);
      const data = await response.json();
      console.log("[v0] Response data:", data);

      if (!response.ok) {
        const errorMsg = data.error || `API Error: ${response.status}`;
        console.error("[v0] API Error:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.success) {
        console.error("[v0] API returned success=false:", data);
        throw new Error(data.error || "API returned unsuccessful response");
      }

      if (!data.summary) {
        console.warn("[v0] Warning: API returned no summary");
      }

      const newSummary: Summary = {
        id: Date.now().toString(),
        title: formData.title || `Summary - ${new Date().toLocaleDateString()}`,
        summary: data.summary || "",
        subject: formData.subject || undefined,
        examType: formData.examType || undefined,
        timestamp: new Date(),
      };

      setSummaries((prev) => [newSummary, ...prev]);
      setFormData({
        notes: "",
        subject: "",
        examType: "",
        title: "",
      });

      toast({
        title: "Success",
        description: "Notes summarized successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to summarize notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSummary = (summary: Summary) => {
    const element = document.createElement("a");
    const file = new Blob([summary.summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${summary.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Notes Summarizer
        </h1>
        <p className="text-muted-foreground mb-8">
          Convert your notes into smart, exam-focused summaries
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Notes Input Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  Summarize Notes
                </CardTitle>
                <CardDescription>Paste or enter your notes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title (optional)
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Photosynthesis Notes"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Your Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Paste your notes here..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-32"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject (optional)
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g., Biology"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="examType" className="text-sm font-medium">
                      Exam Type (optional)
                    </label>
                    <select
                      id="examType"
                      name="examType"
                      value={formData.examType}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select exam</option>
                      <option value="JEE Main">JEE Main</option>
                      <option value="JEE Advanced">JEE Advanced</option>
                      <option value="NEET">NEET</option>
                      <option value="GATE">GATE</option>
                      <option value="Board Exam">Board Exam</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Summarizing..." : "Summarize Notes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summaries Display */}
          <div className="lg:col-span-3">
            {summaries.length > 0 ? (
              <div className="space-y-6">
                {summaries.map((summary) => (
                  <Card key={summary.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle>{summary.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {summary.subject && `Subject: ${summary.subject}`}
                            {summary.subject && summary.examType && " • "}
                            {summary.examType && `Exam: ${summary.examType}`}
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => downloadSummary(summary)}
                          title="Download summary"
                        >
                          <Download size={18} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p
                                className="text-sm text-muted-foreground mb-2"
                                {...props}
                              />
                            ),
                            h1: ({ node, ...props }) => (
                              <h2
                                className="text-lg font-bold mt-4 mb-2"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h3
                                className="text-base font-semibold mt-4 mb-2"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h4
                                className="text-sm font-semibold mt-3 mb-1"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc list-inside space-y-1 text-sm ml-2"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal list-inside space-y-1 text-sm ml-2"
                                {...props}
                              />
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong
                                className="font-semibold text-foreground"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {summary.summary}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <p className="text-muted-foreground">
                    No summaries yet. Paste your notes to create your first
                    summary!
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { MessageCircle, Send, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Doubt {
  id: string;
  question: string;
  answer: string;
  subject?: string;
  examType?: string;
  timestamp: Date;
}

export default function DoubtSolverPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [formData, setFormData] = useState({
    question: "",
    subject: "",
    examType: "",
    language: "english",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    console.log(`[v0] Input changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Form submitted with data:", formData);

    if (!formData.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("[v0] Fetching solve doubt API...");
      const response = await fetch("/api/solve-doubt", {
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

      const newDoubt: Doubt = {
        id: Date.now().toString(),
        question: formData.question,
        answer: data.answer || "",
        subject: formData.subject || undefined,
        examType: formData.examType || undefined,
        timestamp: new Date(),
      };

      if (!data.answer) {
        console.warn("[v0] Warning: API returned no answer");
      }

      setDoubts((prev) => [newDoubt, ...prev]);
      setFormData({
        question: "",
        subject: "",
        examType: "",
        language: "english",
      });

      toast({
        title: "Success",
        description: "Your doubt has been solved!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to solve doubt",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <DashboardNav />

      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">
              Ask Your Doubts
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Get instant, exam-focused explanations for any concept
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Form */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-card sticky top-24 border-purple-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  New Question
                </CardTitle>
                <CardDescription>Ask and get instant answers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="question"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Your Question *
                    </label>
                    <textarea
                      id="question"
                      name="question"
                      placeholder="Ask your question in detail..."
                      value={formData.question}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm min-h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g., Physics"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-white/70 border border-purple-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="examType"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Exam Type
                    </label>
                    <select
                      id="examType"
                      name="examType"
                      value={formData.examType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select exam</option>
                      <option value="JEE Main">JEE Main</option>
                      <option value="JEE Advanced">JEE Advanced</option>
                      <option value="NEET">NEET</option>
                      <option value="GATE">GATE</option>
                      <option value="Board">Board</option>
                    </select>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full btn-gradient"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Getting Answer...
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Get Answer
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Doubts History */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {doubts.length > 0 ? (
              <div className="space-y-6">
                {doubts.map((doubt, index) => (
                  <motion.div
                    key={doubt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="glass-card border-purple-200/50">
                      <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {doubt.question}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {doubt.subject && `📚 ${doubt.subject}`}
                              {doubt.subject && doubt.examType && " • "}
                              {doubt.examType && `🎯 ${doubt.examType}`}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => (
                                <p
                                  className="text-sm text-gray-700 mb-2"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h3
                                  className="text-base font-semibold mt-4 mb-2 text-purple-700"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h4
                                  className="text-sm font-semibold mt-3 mb-1 text-purple-600"
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc list-inside space-y-1 text-sm"
                                  {...props}
                                />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong
                                  className="font-semibold text-purple-700"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {doubt.answer}
                          </ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-card h-96 flex items-center justify-center border-purple-200/50">
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <MessageCircle className="w-20 h-20 mx-auto mb-4 text-purple-300" />
                    </motion.div>
                    <p className="text-gray-600 font-semibold">
                      No questions yet. Ask your first doubt!
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}

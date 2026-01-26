"use client";

import React, { useState } from "react";
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
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  Zap,
  Clock,
  Target,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function StudyPlannerPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    exam: "JEE Advanced",
    numDays: "30",
    topicsLength: "5",
    difficulty: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject",
        variant: "destructive",
      });
      return;
    }

    const days = parseInt(formData.numDays);
    if (isNaN(days) || days < 1 || days > 365) {
      toast({
        title: "Error",
        description: "Please enter days between 1 and 365",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch("/api/generate-study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate study plan");
      }

      if (!data.success) {
        throw new Error(data.error || "API returned unsuccessful response");
      }

      if (!data.plan) {
        throw new Error("No plan received from API");
      }

      setPlan(data.plan);
      toast({
        title: "Success!",
        description: "Study plan generated successfully",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50">
      <DashboardNav />

      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Study Plan Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Create personalized, day-wise study plans powered by AI. Get
            detailed breakdown of topics, resources, and tips.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            className="lg:col-span-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="sticky top-24 border-purple-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Plan Details
                  </CardTitle>
                  <CardDescription>Customize your study plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="e.g., Physics, Chemistry, Biology"
                        className="w-full bg-white/70 border-purple-200 focus:border-purple-500"
                        required
                      />
                    </div>

                    {/* Exam Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Exam Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="exam"
                        value={formData.exam}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      >
                        <option value="JEE Advanced">JEE Advanced</option>
                        <option value="JEE Mains">JEE Mains</option>
                        <option value="NEET">NEET</option>
                        <option value="GATE">GATE</option>
                        <option value="Board Exam">Board Exam</option>
                        <option value="UPSC">UPSC</option>
                        <option value="CAT">CAT</option>
                        <option value="Custom Exam">Custom Exam</option>
                      </select>
                    </div>

                    {/* Days */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Days Available <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          name="numDays"
                          value={formData.numDays}
                          onChange={handleInputChange}
                          min="1"
                          max="365"
                          className="flex-1 bg-white/70 border-purple-200 focus:border-purple-500"
                          required
                        />
                        <span className="text-sm font-medium text-gray-600">
                          days
                        </span>
                      </div>
                    </div>

                    {/* Topics Count */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Topics
                      </label>
                      <Input
                        type="number"
                        name="topicsLength"
                        value={formData.topicsLength}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        className="w-full bg-white/70 border-purple-200 focus:border-purple-500"
                      />
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      >
                        <option value="easy">Easy (3-4 hours/day)</option>
                        <option value="medium">Medium (4-6 hours/day)</option>
                        <option value="hard">Hard (6-8 hours/day)</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Generate Plan
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {error && (
              <motion.div variants={itemVariants}>
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900">Error</h3>
                        <p className="text-sm text-red-800 mt-1">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {plan && (
              <motion.div variants={itemVariants}>
                <Card className="border-purple-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Your Personalized Study Plan
                    </CardTitle>
                    <CardDescription>
                      {formData.exam} • {formData.subject} • {formData.numDays}{" "}
                      days • {formData.difficulty} level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-linear-to-br from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200/50 prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-2xl font-bold text-purple-900 mt-6 mb-4 first:mt-0"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-xl font-bold text-purple-800 mt-5 mb-3"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-lg font-semibold text-purple-700 mt-4 mb-2"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p
                              className="text-gray-700 mb-3 leading-relaxed"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc list-inside space-y-1 mb-3 text-gray-700"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal list-inside space-y-1 mb-3 text-gray-700"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="text-gray-700" {...props} />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-4 border-purple-500 pl-4 py-2 italic text-gray-600 my-3"
                              {...props}
                            />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className="font-bold text-purple-900"
                              {...props}
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-purple-100 text-purple-900 px-2 py-1 rounded text-sm"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {plan}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!plan && !error && (
              <motion.div variants={itemVariants}>
                <Card className="border-dashed border-purple-300 bg-purple-50/50">
                  <CardContent className="pt-12 pb-12">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-purple-100 rounded-full">
                          <BookOpen className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Generate Your Study Plan
                      </h3>
                      <p className="text-gray-600 max-w-sm mx-auto">
                        Fill in your exam details on the left to generate a
                        personalized study plan with day-by-day breakdown,
                        resources, and tips.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: "Day-wise Breakdown",
                desc: "Topics organized by day with time allocation",
              },
              {
                icon: Target,
                title: "Focused Goals",
                desc: "Clear daily targets and revision schedules",
              },
              {
                icon: Zap,
                title: "Expert Tips",
                desc: "Study strategies tailored to your difficulty level",
              },
              {
                icon: Clock,
                title: "Time Management",
                desc: "Realistic time allocations for each topic",
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <Card className="border-purple-200/50 hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <feature.icon className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}

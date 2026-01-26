'use client'

import React from "react"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { BookOpen, Zap, Clock, Target, Sparkles } from 'lucide-react'

interface DailyPlan {
  day: number
  topics: string[]
  duration: string
  revision: string
  tips: string
}

interface StudyPlanResponse {
  overview: string
  daily_schedule: DailyPlan[]
  key_resources: string[]
  study_tips: string[]
  revision_strategy: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: {
    y: -5,
    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.15)',
    transition: { duration: 0.3 },
  },
}

export default function StudyPlannerPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    subject: '',
    exam: 'JEE Advanced',
    days: '30',
    topics: '',
    difficulty: 'medium',
  })

  const [loading, setLoading] = useState(false)
  const [studyPlan, setStudyPlan] = useState<StudyPlanResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget
    console.log(`[v0] Input changed: ${name} = ${value}`)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('[v0] Form submitted with data:', formData)

    if (!formData.subject || !formData.exam || !formData.days) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    setLoading(true)
    setError(null)
    setStudyPlan(null)

    try {
      console.log('[v0] Fetching study plan API...')
      const response = await fetch('/api/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('[v0] Response status:', response.status)
      const data = await response.json()
      console.log('[v0] Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study plan')
      }

      if (data.data) {
        setStudyPlan(data.data)
        toast({ title: 'Success!', description: 'Study plan generated successfully' })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.log('[v0] Error:', errorMessage)
      setError(errorMessage)
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
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
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient">AI Study Plan Generator</h1>
          </div>
          <p className="text-lg text-gray-600">Create personalized, day-wise study plans powered by AI</p>
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
              <Card className="glass-card sticky top-24 border-purple-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Plan Details
                  </CardTitle>
                  <CardDescription>Customize your study plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="e.g., Physics, Chemistry"
                        className="w-full bg-white/70 border border-purple-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type *</label>
                      <select
                        name="exam"
                        value={formData.exam}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="JEE Advanced">JEE Advanced</option>
                        <option value="JEE Mains">JEE Mains</option>
                        <option value="NEET">NEET</option>
                        <option value="GATE">GATE</option>
                        <option value="Board">Board Exams</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Days Available *</label>
                      <Input
                        type="number"
                        name="days"
                        value={formData.days}
                        onChange={handleInputChange}
                        min="1"
                        max="365"
                        className="w-full bg-white/70 border border-purple-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Topics to Cover</label>
                      <textarea
                        name="topics"
                        value={formData.topics}
                        onChange={handleInputChange}
                        placeholder="e.g., Thermodynamics, Waves"
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="easy">Easy (Basics)</option>
                        <option value="medium">Medium (Standard)</option>
                        <option value="hard">Hard (Advanced)</option>
                      </select>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-gradient font-semibold text-base h-11"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                          </div>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Generate Plan
                          </>
                        )}
                      </Button>
                    </motion.div>
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
                    <p className="text-red-800 font-medium">{error}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {studyPlan && (
              <>
                {/* Overview */}
                <motion.div variants={itemVariants} className="mb-6">
                  <Card className="glass-card border-purple-200/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        Plan Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{studyPlan.overview}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Daily Schedule */}
                <motion.div variants={itemVariants} className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Daily Schedule
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                    {studyPlan.daily_schedule.map((day, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover="hover"
                        className="h-fit"
                      >
                        <Card className="glass-card">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">Day {day.day}</CardTitle>
                              <span className="text-xs bg-purple-500/20 text-purple-700 px-2 py-1 rounded-full font-semibold">
                                {day.duration}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            <div>
                              <p className="font-semibold text-purple-700 mb-1">Topics:</p>
                              <ul className="space-y-1">
                                {day.topics.map((topic, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-start gap-2 text-gray-700"
                                  >
                                    <span className="text-purple-500 font-bold mt-0.5">•</span>
                                    {topic}
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            <div className="pt-2 border-t border-purple-200">
                              <p className="text-blue-700 font-semibold">✓ {day.revision}</p>
                            </div>
                            <div className="pt-1">
                              <p className="text-amber-700">💡 {day.tips}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Study Tips */}
                <motion.div variants={itemVariants} className="mb-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Study Tips & Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-purple-700 mb-3">Key Tips:</h3>
                        <ul className="space-y-2">
                          {studyPlan.study_tips.map((tip, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3 text-gray-700"
                            >
                              <span className="text-purple-500 font-bold text-lg">•</span>
                              <span>{tip}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-purple-200">
                        <h3 className="font-semibold text-blue-700 mb-2">Revision Strategy:</h3>
                        <p className="text-gray-700 leading-relaxed">{studyPlan.revision_strategy}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Resources */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Recommended Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {studyPlan.key_resources.map((resource, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-sm font-semibold text-gray-800 border border-purple-200 cursor-pointer"
                          >
                            {resource}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}

            {!studyPlan && !error && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center h-96 text-gray-500"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <BookOpen className="w-20 h-20 mb-4 opacity-30" />
                </motion.div>
                <p className="text-lg font-semibold">Fill in your details and generate a study plan</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}

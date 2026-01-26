'use client'

import React from "react"

import { useState } from 'react'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Trash2, Plus } from 'lucide-react'

interface Exam {
  id: string
  name: string
  examType: string
  date: string
  subject: string
  totalMarks: number
  status: 'upcoming' | 'completed' | 'preparation'
}

export default function ExamsPage() {
  const { toast } = useToast()
  const [exams, setExams] = useState<Exam[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    examType: '',
    date: '',
    subject: '',
    totalMarks: '100',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.date || !formData.subject) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      name: formData.name,
      examType: formData.examType || 'Other',
      date: formData.date,
      subject: formData.subject,
      totalMarks: parseInt(formData.totalMarks),
      status: 'preparation',
    }

    setExams((prev) => [newExam, ...prev])
    setFormData({
      name: '',
      examType: '',
      date: '',
      subject: '',
      totalMarks: '100',
    })
    setShowForm(false)

    toast({
      title: 'Success',
      description: 'Exam added to your preparation list!',
    })
  }

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id))
    toast({
      title: 'Deleted',
      description: 'Exam removed from your list',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'upcoming':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-yellow-50 border-yellow-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'upcoming':
        return 'Upcoming'
      default:
        return 'In Preparation'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Exams</h1>
            <p className="text-muted-foreground mt-2">Track and manage all your upcoming exams</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={20} />
            Add Exam
          </Button>
        </div>

        {/* Add Exam Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Exam</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Exam Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., JEE Main 2024"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="examType" className="text-sm font-medium">
                    Exam Type
                  </label>
                  <select
                    id="examType"
                    name="examType"
                    value={formData.examType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select type</option>
                    <option value="JEE Main">JEE Main</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="GATE">GATE</option>
                    <option value="Board Exam">Board Exam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Exam Date
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Physics"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="totalMarks" className="text-sm font-medium">
                    Total Marks
                  </label>
                  <Input
                    id="totalMarks"
                    name="totalMarks"
                    type="number"
                    placeholder="100"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex gap-2 items-end">
                  <Button type="submit" className="flex-1">
                    Add Exam
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Exams List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.length > 0 ? (
            exams.map((exam) => (
              <Card key={exam.id} className={`border ${getStatusColor(exam.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{exam.name}</CardTitle>
                      <CardDescription>{exam.subject}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExam(exam.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exam Type:</span>
                      <span className="font-medium">{exam.examType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(exam.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Marks:</span>
                      <span className="font-medium">{exam.totalMarks}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : exam.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusLabel(exam.status)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 lg:col-span-3 h-40 flex items-center justify-center">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No exams added yet. Click "Add Exam" to get started!
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

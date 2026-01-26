'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/auth'
import { BookOpen, Brain, FileText, Clock } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Fetch user details
      const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()

      setUser(data || session.user)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.full_name || 'Student'}!
          </h1>
          <p className="text-muted-foreground mt-2">Here's what you can do today</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Study Planner Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain size={20} className="text-primary" />
                    Study Planner
                  </CardTitle>
                  <CardDescription>Create personalized study plans</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Plan your studies day-by-day with AI-powered suggestions tailored to your exam goals.
              </p>
              <Link href="/study-planner">
                <Button className="w-full">Create Study Plan</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Doubt Solver Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Doubt Solver
              </CardTitle>
              <CardDescription>Get instant answers to your questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Ask questions in multiple languages and get exam-focused explanations instantly.
              </p>
              <Link href="/doubt-solver">
                <Button className="w-full">Ask a Question</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notes Summarizer Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Notes Summarizer
              </CardTitle>
              <CardDescription>Convert PDFs to smart notes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your PDFs or notes and get AI-generated summaries and key points.
              </p>
              <Link href="/notes-summarizer">
                <Button className="w-full">Summarize Notes</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground mt-2">Study Plans Created</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground mt-2">Questions Asked</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground mt-2">Notes Summarized</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock size={20} className="text-primary" />
                  <p className="text-3xl font-bold text-primary">0h</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Study Time</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

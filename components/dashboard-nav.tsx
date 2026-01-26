'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/auth'
import { Menu, X, LogOut, BookOpen, Brain, FileText, Settings } from 'lucide-react'

export function DashboardNav() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { href: '/study-planner', label: 'Study Planner', icon: Brain },
    { href: '/doubt-solver', label: 'Doubt Solver', icon: FileText },
    { href: '/notes-summarizer', label: 'Notes Summarizer', icon: FileText },
  ]

  return (
    <nav className="border-b bg-primary text-primary-foreground shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen size={24} />
            <span className="hidden sm:inline">AI Study Buddy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    <Icon size={18} className="mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right side - Logout button and Mobile menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </Button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-primary-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} className="mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}

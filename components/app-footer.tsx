"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  Brain,
  BookOpen,
  ShieldCheck,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
  Zap,
  Target,
  Users,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // GSAP animations on mount
  useEffect(() => {
    if (!footerRef.current) return;

    // Animate footer sections
    gsap.fromTo(
      footerRef.current.querySelectorAll("[data-animate]"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating animation for icons
    gsap.to(footerRef.current.querySelectorAll("[data-float]"), {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.1,
    });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 2000);
    }
  };

  const footerSections = [
    {
      title: "Product",
      icon: Zap,
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Study Planner", href: "/study-planner" },
        { label: "Doubt Solver", href: "/doubt-solver" },
        { label: "Notes Summarizer", href: "/notes-summarizer" },
      ],
    },
    {
      title: "Features",
      icon: Lightbulb,
      links: [
        { label: "Daily Quizzes", href: "/quiz" },
        { label: "Progress Analytics", href: "/dashboard" },
        { label: "Video Recommendations", href: "/notes-summarizer" },
        { label: "Study Plans", href: "/study-planner" },
      ],
    },
    {
      title: "Company",
      icon: Users,
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Legal",
      icon: ShieldCheck,
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Support", href: "/support" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/aistudybuddy", label: "Twitter" },
    { icon: Github, href: "https://github.com/aistudybuddy", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/aistudybuddy", label: "LinkedIn" },
    { icon: Mail, href: "mailto:support@aistudybuddy.com", label: "Email" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative z-40 border-t border-border/60 bg-gradient-to-b from-white/80 via-indigo-50/40 to-white/80 dark:from-[#0b1020]/80 dark:via-purple-900/20 dark:to-[#0b1020]/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-0 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl opacity-0 animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-border/30">
          {/* Brand Story */}
          <div data-animate className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg" data-float>
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AI Study Buddy
                </h3>
                <p className="text-xs text-muted-foreground">v2.0 - Advanced Learning</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering Indian students with AI-driven study tools. From competitive exams to board preparations, we're here to make learning smarter, faster, and more engaging.
            </p>
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all hover:scale-110 duration-300"
                    title={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div data-animate className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-200/40 dark:border-indigo-500/30">
            <h4 className="text-lg font-bold mb-2 text-foreground">
              Stay Updated 📧
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get weekly tips, new features, and exclusive content for students.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-indigo-200 dark:border-indigo-500/30"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition"
                  size="icon"
                >
                  {subscribed ? <Heart size={18} fill="white" /> : <ArrowRight size={18} />}
                </Button>
              </div>
              {subscribed && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ Thanks for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 pb-12 border-b border-border/30">
          {footerSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} data-animate className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-bold text-foreground">{section.title}</h4>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center group"
                      >
                        {link.label}
                        <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div data-animate className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} AI Study Buddy</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={12} className="text-red-500" /> for Indian students 🇮🇳
            </span>
          </div>
          <div data-animate className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100/50 dark:bg-green-900/30 rounded-full">
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-700 dark:text-green-400 font-medium">All Systems Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

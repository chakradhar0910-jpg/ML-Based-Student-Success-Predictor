import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap, BarChart2, ShieldCheck, Users, BrainCircuit,
  TrendingUp, AlertTriangle, FileSpreadsheet, ChevronRight,
  CheckCircle2, ArrowRight, Menu, X, BookOpen, Target,
  Activity, Lightbulb
} from 'lucide-react'
import { isAuthenticated } from '../utils/auth.js'

/* ─── Data ───────────────────────────────────────────────────── */
const features = [
  {
    icon: BrainCircuit,
    title: 'ML-Driven CGPA Prediction',
    description:
      'Leverages regression models trained on academic records to generate data-driven semester CGPA predictions.',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: AlertTriangle,
    title: 'Early Risk Identification',
    description:
      'Automatically classifies students into risk categories based on academic indicators, enabling timely intervention.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: TrendingUp,
    title: 'Academic Analytics',
    description:
      'Visualise performance trends across departments, semesters, and cohorts through interactive charts.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Lightbulb,
    title: 'Actionable Recommendations',
    description:
      'Generates targeted academic improvement suggestions based on each student\'s specific indicators.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: FileSpreadsheet,
    title: 'Bulk CSV Prediction',
    description:
      'Upload entire student cohorts via CSV and receive predictions, grades, and risk classifications in bulk.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description:
      'Separate access controls for Admin and Faculty roles with secure JWT authentication.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

const steps = [
  {
    num: '01',
    icon: BookOpen,
    title: 'Collect Academic Data',
    description:
      'Input student academic records including attendance, internal marks, previous CGPA, and backlog count.',
  },
  {
    num: '02',
    icon: BrainCircuit,
    title: 'ML Model Processes Data',
    description:
      'The trained regression pipeline preprocesses inputs and generates a CGPA prediction using the best-performing model.',
  },
  {
    num: '03',
    icon: Target,
    title: 'Get Prediction & Grade',
    description:
      'Receive the predicted semester CGPA, grade classification, and performance category instantly.',
  },
  {
    num: '04',
    icon: Activity,
    title: 'Risk Assessment & Action',
    description:
      'Identify at-risk students early and act on tailored academic recommendations before the semester ends.',
  },
]

const performanceCategories = [
  { label: 'Excellent', range: 'CGPA ≥ 8.5', color: 'bg-emerald-500', textColor: 'text-emerald-700', lightBg: 'bg-emerald-50' },
  { label: 'Good',      range: '7.0 – 8.49', color: 'bg-blue-500',    textColor: 'text-blue-700',    lightBg: 'bg-blue-50' },
  { label: 'Average',   range: '5.0 – 6.99', color: 'bg-amber-500',   textColor: 'text-amber-700',   lightBg: 'bg-amber-50' },
  { label: 'At Risk',   range: 'CGPA < 5.0', color: 'bg-red-500',     textColor: 'text-red-700',     lightBg: 'bg-red-50' },
]

const stats = [
  { label: 'Input Features',        value: '12',   suffix: '' },
  { label: 'ML Models Compared',    value: '3',    suffix: '+' },
  { label: 'Performance Categories',value: '4',    suffix: '' },
  { label: 'Risk Levels',           value: '3',    suffix: '' },
]

/* ─── Navbar ─────────────────────────────────────────────────── */
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'About',    href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Analytics',  href: '#analytics' },
  ]

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-surface-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className={`font-bold text-sm ${scrolled ? 'text-surface-900' : 'text-white'}`}>
              Student Success Predictor
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-surface-600 hover:text-surface-900'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Link
              to="/login"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                scrolled
                  ? 'text-surface-700 hover:text-surface-900 hover:bg-surface-100'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Login
            </Link>
            <Link
              to="/login"
              className="btn-primary btn-sm"
            >
              Get Started
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`ml-auto md:hidden p-2 rounded-lg ${scrolled ? 'text-surface-700' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-surface-200 shadow-lg animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="block px-3 py-2.5 text-sm font-medium text-surface-700
                             hover:bg-surface-50 hover:text-surface-900 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ))}
              <div className="pt-3 border-t border-surface-100 flex gap-3">
                <Link to="/login" className="btn-secondary btn-sm flex-1">Login</Link>
                <Link to="/login" className="btn-primary btn-sm flex-1">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

/* ─── Hero Section ───────────────────────────────────────────── */
function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative bg-gradient-hero min-h-screen flex items-center overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 rounded-full bg-primary-400/10 blur-2xl" />
        {/* Grid dots */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-6">
              <BrainCircuit size={12} className="text-accent-400" />
              Machine Learning for Academic Prediction
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              ML-Based{' '}
              <span className="text-accent-400">Student</span>
              <br />
              Success Predictor
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              Predict academic performance early. Identify students at risk.
              Enable <span className="text-accent-400 font-medium">timely academic intervention</span> using
              data-driven machine learning.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 btn-lg bg-accent-500
                           hover:bg-accent-600 text-white rounded-xl font-semibold
                           shadow-lg hover:shadow-xl transition-all duration-200 px-7 py-3.5"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 btn-lg bg-white/10
                           hover:bg-white/20 text-white border border-white/20
                           rounded-xl font-medium px-7 py-3.5 transition-all duration-200"
              >
                How It Works
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map(({ label, value, suffix }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">
                    {value}<span className="text-accent-400">{suffix}</span>
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Pipeline visual */}
          <div className="hidden lg:flex flex-col items-center gap-0 animate-fade-in">
            <PipelineVisual />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="fill-white block">
          <path d="M0,64 C360,0 1080,0 1440,64 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  )
}

/* ─── ML Pipeline Visual ─────────────────────────────────────── */
function PipelineVisual() {
  const steps = [
    { icon: Users,         label: 'Student Data',      sublabel: 'Academic records',      color: 'bg-primary-500' },
    { icon: BrainCircuit,  label: 'Machine Learning',  sublabel: 'XGBoost / Random Forest',color: 'bg-accent-500' },
    { icon: TrendingUp,    label: 'CGPA Prediction',   sublabel: 'Regression output',     color: 'bg-violet-500' },
    { icon: Lightbulb,     label: 'Academic Insights', sublabel: 'Risk & recommendations',color: 'bg-emerald-500' },
  ]

  return (
    <div className="flex flex-col items-center gap-0 w-full max-w-xs">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          {/* Card */}
          <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl
                           p-5 flex items-center gap-4 hover:bg-white/15 transition-colors">
            <div className={`w-11 h-11 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <step.icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{step.label}</p>
              <p className="text-white/50 text-xs">{step.sublabel}</p>
            </div>
            <div className="ml-auto">
              <CheckCircle2 size={16} className="text-white/30" />
            </div>
          </div>

          {/* Arrow connector */}
          {i < steps.length - 1 && (
            <div className="flex flex-col items-center py-1">
              <div className="w-px h-4 bg-white/20" />
              <ChevronRight size={14} className="text-white/30 rotate-90" />
              <div className="w-px h-4 bg-white/20" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

/* ─── About Section ──────────────────────────────────────────── */
function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
              About the System
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-6 leading-tight">
              Data-driven academic prediction for proactive student support
            </h2>
            <p className="text-surface-600 leading-relaxed mb-4">
              The ML-Based Student Success Predictor is an academic analytics platform designed
              to assist faculty and academic administrators in identifying students who may need
              additional support before the end of a semester.
            </p>
            <p className="text-surface-600 leading-relaxed mb-4">
              The system analyses academic input features — including attendance, mid-term marks,
              internal assessment scores, and historical academic performance — to generate
              predicted semester CGPA estimates using trained machine learning models.
            </p>
            <p className="text-surface-600 leading-relaxed">
              Results are presented alongside performance classifications and actionable academic
              recommendations, enabling departments to plan targeted interventions.
            </p>
          </div>

          {/* Performance category cards */}
          <div className="grid grid-cols-2 gap-4">
            {performanceCategories.map((cat) => (
              <div
                key={cat.label}
                className={`card-hover ${cat.lightBg} border-0`}
              >
                <div className={`w-10 h-10 rounded-xl ${cat.color} mb-3 flex items-center justify-center`}>
                  <GraduationCap size={18} className="text-white" />
                </div>
                <p className={`font-bold text-lg ${cat.textColor}`}>{cat.label}</p>
                <p className="text-surface-500 text-sm mt-1">{cat.range}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Features Section ───────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Key Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">
            Everything you need for academic prediction
          </h2>
          <p className="text-surface-500 mt-4 max-w-2xl mx-auto">
            A complete platform for managing student records, generating ML-based predictions,
            and delivering actionable academic insights.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card-hover group">
              <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon size={22} className={feature.color} />
              </div>
              <h3 className="font-semibold text-surface-900 mb-2">{feature.title}</h3>
              <p className="text-surface-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works Section ───────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">
            From student data to academic insights
          </h2>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center group">
              {/* Number + icon */}
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 border-2 border-primary-100
                               flex items-center justify-center
                               group-hover:bg-primary-600 group-hover:border-primary-600
                               transition-all duration-300">
                  <step.icon size={26} className="text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600
                                  text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="font-semibold text-surface-900 mb-2">{step.title}</h3>
              <p className="text-surface-500 text-sm leading-relaxed">{step.description}</p>

              {/* Connector arrow (not on last item) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute mt-8 text-surface-300">
                  {/* connector is just visual spacing in grid layout */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Analytics Preview Section ─────────────────────────────── */
function AnalyticsSection() {
  return (
    <section id="analytics" className="py-20 bg-primary-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-accent-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Analytics Dashboard
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
              Visualise academic performance across your institution
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              The analytics module provides interactive charts for CGPA distribution,
              department-wise performance, attendance trends, and risk distribution —
              helping administrators make data-informed decisions.
            </p>

            <ul className="space-y-3">
              {[
                'Grade and performance category distribution',
                'Department-wise average CGPA comparison',
                'Attendance vs predicted CGPA correlation view',
                'Risk level breakdown by semester',
                'Historical prediction trend analysis',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                  <CheckCircle2 size={16} className="text-accent-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-8 bg-accent-500
                         hover:bg-accent-600 text-white rounded-xl font-medium
                         px-6 py-3 text-sm transition-colors"
            >
              View Analytics Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mock analytics cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Grade Distribution',       value: 'A, B+, B, C', icon: BarChart2, color: 'text-primary-400' },
              { label: 'Average CGPA',              value: '7.42',        icon: TrendingUp, color: 'text-emerald-400' },
              { label: 'At-Risk Students',          value: 'Identified',  icon: AlertTriangle, color: 'text-amber-400' },
              { label: 'Departments Tracked',       value: 'All',         icon: Users, color: 'text-violet-400' },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-5
                           hover:bg-white/10 transition-colors"
              >
                <card.icon size={22} className={`${card.color} mb-3`} />
                <p className="text-white font-bold text-xl">{card.value}</p>
                <p className="text-white/40 text-xs mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Risk Identification Section ────────────────────────────── */
function RiskSection() {
  const risks = [
    {
      level: 'High Risk',
      desc: 'Predicted CGPA below 5.0',
      action: 'Immediate academic mentoring and structured improvement plan.',
      color: 'border-red-200 bg-red-50',
      badge: 'bg-red-100 text-red-700',
      dot: 'bg-red-500',
    },
    {
      level: 'Medium Risk',
      desc: 'Predicted CGPA 5.0 – 6.99',
      action: 'Focused faculty support and regular academic progress monitoring.',
      color: 'border-amber-200 bg-amber-50',
      badge: 'bg-amber-100 text-amber-700',
      dot: 'bg-amber-500',
    },
    {
      level: 'Low Risk',
      desc: 'Predicted CGPA ≥ 7.0',
      action: 'Maintain current performance; encourage continued engagement.',
      color: 'border-emerald-200 bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-700',
      dot: 'bg-emerald-500',
    },
  ]

  return (
    <section className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Risk Identification
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">
            Structured academic risk classification
          </h2>
          <p className="text-surface-500 mt-4 max-w-2xl mx-auto">
            Risk levels are derived from predicted CGPA using configurable thresholds,
            enabling consistent and transparent classification across your institution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {risks.map((r) => (
            <div key={r.level} className={`card border ${r.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-2.5 h-2.5 rounded-full ${r.dot}`} />
                <span className={`badge ${r.badge} px-3 py-1`}>{r.level}</span>
              </div>
              <p className="font-semibold text-surface-800 mb-2">{r.desc}</p>
              <p className="text-surface-500 text-sm">{r.action}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Section ────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-hero rounded-3xl px-8 py-16 text-center relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent-500/10 blur-2xl pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-6">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Log in to access the prediction dashboard, manage student records,
              and begin generating data-driven academic insights for your institution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600
                           text-white rounded-xl font-semibold px-8 py-3.5 transition-colors
                           shadow-lg hover:shadow-xl"
              >
                Login to Dashboard
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm">Student Success Predictor</span>
            </div>
            <p className="text-sm leading-relaxed">
              ML-based academic prediction platform for proactive student success management.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              {['Dashboard', 'Students', 'Prediction', 'Analytics', 'Recommendations'].map((item) => (
                <li key={item}>
                  <Link to="/login" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Technology</h4>
            <ul className="space-y-2 text-sm">
              {[
                'React.js Frontend',
                'Flask REST API',
                'MySQL Database',
                'XGBoost / Random Forest',
                'JWT Authentication',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-accent-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-700 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-2 text-xs">
          <p>© 2024 ML-Based Student Success Predictor. College Special Project.</p>
          <p className="text-surface-600">
            Built with React · Flask · MySQL · Scikit-learn · XGBoost
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Landing Page Root ──────────────────────────────────────── */
function LandingPage() {
  const navigate = useNavigate()

  // If already authenticated, skip landing page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <div className="w-full">
      <LandingNavbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AnalyticsSection />
      <RiskSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default LandingPage

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Layers,
  GraduationCap,
  MessageSquare,
  Languages,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Quote,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDemo = () => {
    demoLogin();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Smart Notes Generator',
      description: 'Transform messy lecture transcripts, raw text, or book chapters into structured, beautifully formatted notes in seconds.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: FileText,
      title: 'PDF Summarizer & Parser',
      description: 'Upload 100+ page research papers and syllabi. Extract key concepts, definitions, and executive summaries instantly.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Layers,
      title: 'Interactive Flashcards',
      description: 'Active recall spaced repetition decks generated automatically from your notes with 3D flip card drills.',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: GraduationCap,
      title: 'AI Quiz & Exam Prep',
      description: 'Test yourself with AI-generated multiple-choice questions, detailed explanations, and instant score tracking.',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: MessageSquare,
      title: 'Chat with Your Notes',
      description: 'Ask deep conceptual questions grounded directly in your uploaded textbooks with verifiable citations.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Languages,
      title: 'Bilingual: English & Hindi',
      description: 'Seamlessly generate notes, flashcards, or ELI5 concept breakdowns in English, clean Hindi, or Hinglish.',
      color: 'from-rose-500 to-purple-500',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Input Your Material',
      description: 'Paste text, upload a PDF document, or insert a lecture transcript in English or Hindi.',
    },
    {
      num: '02',
      title: 'AI Synthesis & Structuring',
      description: 'Our Google Gemini engine extracts key definitions, structures hierarchies, and eliminates filler.',
    },
    {
      num: '03',
      title: 'Master with Active Recall',
      description: 'Convert notes into interactive flashcards, take practice quizzes, and export as PDF or Markdown.',
    },
  ];

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Computer Science Undergrad, IIT Delhi',
      text: 'NotesPro AI cut my exam revision time in half. Converting 60-page PDF slides into Cornell notes and flashcards with one click is pure magic.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Pre-Med Student, Johns Hopkins',
      text: 'The grounded Q&A and active recall drills helped me master neurobiology pathways that usually take weeks to memorize.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Patel',
      role: 'UPSC Aspirant',
      text: 'The bilingual Hindi summary feature is incredible for Indian competitive exams. Definitions are accurate and crystal clear.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter Student',
      price: '$0',
      period: 'Forever free',
      desc: 'Perfect for casual learners and exam prep.',
      features: ['Up to 50 AI note generations', 'PDF text summarization (up to 15MB)', 'Interactive flashcards & quizzes', 'Markdown & TXT exports', 'Smart demo mode support'],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Pro Scholar',
      price: '$9',
      period: 'per month',
      desc: 'For serious college students & competitive exams.',
      features: [
        'Unlimited AI note generations',
        'Direct Gemini 2.5 Flash live integration',
        'High-density PDF exports with custom styling',
        'Unlimited flashcard decks & quiz tracking',
        'Bilingual English + Hindi smart summaries',
        'Priority AI chat response time'
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: true,
    },
    {
      name: 'Campus / Team',
      price: '$24',
      period: 'per seat / month',
      desc: 'For study groups, research labs, and universities.',
      features: [
        'Everything in Pro Scholar',
        'Shared study folders and flashcard decks',
        'Team workspace analytics & scoreboards',
        'Custom institution API keys & dedicated SLAs',
        'Export all notes in bulk'
      ],
      cta: 'Contact University Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white relative">
      {/* Animated Glowing Ambient Orbs & Floating Stars */}
      <AnimatedBackground showParticles={true} />

      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
              NotesPro
            </span>
            <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AI
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-purple-400 transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-purple-400 transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-purple-500/50"
          >
            Explore Demo
          </button>
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 lg:px-16 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span>Powered by Google Gemini 2.5 Flash & Active Recall</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
          >
            Study Smarter, Not Harder with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              AI Notes
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Transform heavy PDFs, textbooks, messy lectures, and research papers into crisp smart notes,
            interactive flashcards, and exam-ready quizzes in English & Hindi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Launch Instant Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700/80 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
            </Link>
          </motion.div>

          {/* Social Proof badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF & Markdown export ready
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> English & Hindi support
            </span>
          </div>

          {/* Interactive UI Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 rounded-3xl p-3 bg-gradient-to-b from-purple-500/20 via-slate-800/40 to-slate-950 border border-slate-800 shadow-2xl relative"
          >
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-2xl p-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">NotesPro AI — Studio Preview</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                  Exam Mode: ON
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-sm">
                    <span className="font-bold text-purple-300 block mb-1">
                      📚 Synthesized Topic: Quantum Computing & Qubits
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Unlike classical bits that exist in binary states (0 or 1), a qubit harnesses superposition
                      $\\lvert \\psi \\rangle = \\alpha \\lvert 0 \\rangle + \\beta \\lvert 1 \\rangle$, enabling exponential computational parallelization.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                    <div className="font-semibold text-cyan-300 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" /> High-Yield Revision Points
                    </div>
                    <ul className="list-disc pl-5 text-slate-400 space-y-1">
                      <li>Superposition collapses upon measurement.</li>
                      <li>Entanglement links qubit states instantaneously across space.</li>
                      <li>Shor's Algorithm breaks RSA encryption in polynomial time.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/30 text-xs">
                    <div className="flex items-center justify-between text-purple-400 font-bold mb-2">
                      <span>Interactive Flashcard</span>
                      <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded">Card 1 of 8</span>
                    </div>
                    <p className="font-medium text-white mb-3">
                      What is the mathematical condition for qubit probability amplitudes $\alpha$ and $\beta$?
                    </p>
                    <div className="p-2.5 rounded-lg bg-purple-950/40 text-purple-200 border border-purple-500/20 font-mono text-center">
                      $|\alpha|^2 + |\beta|^2 = 1$
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Mastery Score</p>
                      <p className="text-[10px] text-slate-400">92% Exam Readiness</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-xs">
                      A+
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-24 px-6 lg:px-16 border-t border-slate-800/80 bg-slate-950/50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
              Power Packed Capabilities
            </h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Everything You Need to Ace Any Subject
            </h3>
            <p className="text-slate-400 text-base sm:text-lg">
              Engineered for university students, competitive exam aspirants (GATE, NEET, UPSC), and lifelong researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section: How it works */}
      <section id="workflow" className="py-24 px-6 lg:px-16 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              Frictionless Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Raw Confusion to 100% Retention in 3 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative group">
                <span className="text-4xl font-extrabold text-purple-500/20 mb-4 block group-hover:text-purple-500/40 transition-colors font-mono">
                  {step.num}
                </span>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 lg:px-16 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
              Loved by Scholars
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by 10,000+ Students Worldwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30" />
                  <div>
                    <h5 className="text-sm font-bold text-white">{t.name}</h5>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 lg:px-16 border-t border-slate-800/80 bg-slate-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              Fair & Transparent
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Invest in High Grades
            </h3>
            <p className="text-slate-400 text-sm">
              Start free, upgrade whenever you need unlimited document summaries and cloud sync.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950 border-2 border-purple-500 shadow-2xl shadow-purple-600/20 scale-105 relative'
                    : 'bg-slate-900/60 border border-slate-800'
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-[11px] font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                  <p className="text-xs text-slate-400 mb-6">{tier.desc}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/{tier.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleLaunchDemo}
                  className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-12 px-6 lg:px-16 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-300">NotesPro AI</span>
            <span>— The intelligent study assistant.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/help" className="hover:text-slate-300 transition-colors">Documentation</Link>
            <Link to="/settings" className="hover:text-slate-300 transition-colors">API Settings</Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
          </div>

          <p>© 2026 NotesPro AI Inc. Built with Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

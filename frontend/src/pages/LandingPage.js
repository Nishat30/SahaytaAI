import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Volume2, Zap, Star, ArrowRight, CheckCircle,
  Users, BarChart2, Smile, GraduationCap, HeadphonesIcon,
  Layers, Clock, Award
} from 'lucide-react';

/* ─── tiny hook for intersection-based fade-ins ─── */
function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Robot SVG mascot ─── */
function RobotMascot() {
  return (
    <div className="animate-float relative">
      <svg width="120" height="130" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Graduation cap */}
        <rect x="28" y="8" width="64" height="8" rx="4" fill="#1e293b"/>
        <polygon points="60,2 90,14 60,20 30,14" fill="#1e293b"/>
        <line x1="90" y1="14" x2="90" y2="28" stroke="#F4A261" strokeWidth="2"/>
        <circle cx="90" cy="30" r="4" fill="#F4A261"/>
        {/* Head */}
        <rect x="25" y="16" width="70" height="60" rx="16" fill="#e0e7ff"/>
        <rect x="25" y="16" width="70" height="60" rx="16" fill="url(#robotHead)"/>
        {/* Eyes */}
        <circle cx="45" cy="38" r="10" fill="white"/>
        <circle cx="75" cy="38" r="10" fill="white"/>
        <circle cx="45" cy="38" r="6" fill="#4F46E5"/>
        <circle cx="75" cy="38" r="6" fill="#4F46E5"/>
        <circle cx="47" cy="36" r="2" fill="white"/>
        <circle cx="77" cy="36" r="2" fill="white"/>
        {/* Smile */}
        <path d="M42 56 Q60 68 78 56" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Ears/antenna */}
        <rect x="15" y="30" width="10" height="20" rx="5" fill="#c7d2fe"/>
        <rect x="95" y="30" width="10" height="20" rx="5" fill="#c7d2fe"/>
        {/* Body */}
        <rect x="30" y="76" width="60" height="45" rx="14" fill="#4F46E5"/>
        {/* Chest panel */}
        <rect x="42" y="85" width="36" height="26" rx="8" fill="#6366f1"/>
        <circle cx="52" cy="95" r="5" fill="#a5b4fc"/>
        <circle cx="68" cy="95" r="5" fill="#f9a8d4"/>
        <rect x="46" y="103" width="28" height="4" rx="2" fill="#a5b4fc"/>
        {/* Arms */}
        <rect x="8" y="78" width="22" height="10" rx="5" fill="#4F46E5"/>
        <rect x="90" y="78" width="22" height="10" rx="5" fill="#4F46E5"/>
        <defs>
          <linearGradient id="robotHead" x1="25" y1="16" x2="95" y2="76" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0e7ff"/>
            <stop offset="1" stopColor="#c7d2fe"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Speech bubble */}
      <div className="absolute -top-2 -right-28 bg-white rounded-2xl shadow-lg px-3 py-2 text-xs font-bold text-indigo-700 w-28 text-center border-2 border-indigo-200">
        Hi! I'm your AI Tutor 👋
        <div className="absolute left-0 top-4 -translate-x-2 w-3 h-3 bg-white border-l-2 border-b-2 border-indigo-200 rotate-45"/>
      </div>
    </div>
  );
}

/* ─── Section heading ─── */
function SectionHeading({ emoji, title, subtitle, color = "text-indigo-700" }) {
  return (
    <div className="text-center mb-12">
      <span className="text-4xl">{emoji}</span>
      <h2 className={`text-3xl md:text-4xl font-black mt-2 ${color}`}>{title}</h2>
      {subtitle && <p className="text-gray-500 mt-2 text-lg max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

/* ─── Disability feature card ─── */
function DisabilityCard({ icon: Icon, title, color, bgColor, borderColor, features, badge, delay = 0 }) {
  const [ref, visible] = useVisible();
  return (
    <div
      ref={ref}
      className={`rounded-3xl border-2 p-6 card-hover transition-all duration-700 ${bgColor} ${borderColor} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xl`} style={{ background: color }}>
          <Icon size={20} />
        </div>
        <span className={`font-black text-lg`} style={{ color }}>{title}</span>
      </div>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700 text-sm font-semibold">
            <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Benefit card ─── */
function BenefitCard({ icon, title, desc, color }) {
  return (
    <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white shadow-md card-hover border border-gray-100">
      <div className={`text-4xl mb-3`}>{icon}</div>
      <h4 className="font-black text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function LandingPage() {
  const [heroRef, heroVisible] = useVisible(0.05);
  const [benefitsRef, benefitsVisible] = useVisible();

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ══════════ HERO SECTION ══════════ */}
      <section
        className="relative min-h-screen flex flex-col justify-center dotted-bg overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #fef3c7 50%, #f0fdf4 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full opacity-30 blur-3xl -z-0"/>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200 rounded-full opacity-30 blur-3xl -z-0"/>
        <div className="absolute top-40 right-1/3 w-48 h-48 bg-green-200 rounded-full opacity-20 blur-2xl -z-0"/>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div className={`transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-indigo-200">
              <Zap size={14} className="text-yellow-500" />
              AI-Powered Adaptive Learning
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
              AI Educator for{' '}
              <span className="text-indigo-600">Differently</span>
              <span className="text-purple-600">-Abled</span> Students
            </h1>
            <p className="text-xl font-bold text-amber-600 mb-4">
              Every Student. Every Ability. Equal Learning. 🌟
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              SahaytaAI adapts to <strong>dyslexia</strong>, <strong>ADHD</strong>, and <strong>visual impairments</strong> —
              delivering personalized AI tutoring, interactive games, and accessible content for every learner.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/chat"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg"
              >
                Start Learning <ArrowRight size={20} />
              </Link>
              <Link
                to="/games"
                className="flex items-center gap-2 bg-white border-2 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-black px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-lg"
              >
                🎮 Play Games
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 mt-8">
              {[['3', 'Learning Modes'], ['10+', 'Mini Games'], ['100%', 'Inclusive']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-indigo-700">{num}</div>
                  <div className="text-xs text-gray-500 font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: cards + robot */}
          <div className={`relative transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
            <div className="relative flex justify-center">
              {/* Problem card */}
              <div className="absolute -left-10 bottom-25 bg-red-50 border-2 border-red-200 rounded-3xl p-5 w-52 shadow-lg z-10">
                <div className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-3">THE PROBLEM</div>
                <p className="text-gray-700 text-sm font-semibold leading-snug">
                  Students with dyslexia, ADHD, or visual impairments get <strong>no personalized support</strong> in standard classrooms.
                </p>
                <div className="mt-2 space-y-1">
                  {['Too much text...', "Can't focus...", 'Hard to read...'].map(t => (
                    <div key={t} className="bg-white border border-red-100 rounded-lg px-2 py-1 text-xs text-gray-500 italic">{t}</div>
                  ))}
                </div>
              </div>

              {/* Robot */}
              <div className="relative top-60 z-20">
                <RobotMascot />
              </div>

              {/* Solution card */}
              <div className="absolute -right-14 top-4 bg-green-50 border-2 border-green-200 rounded-3xl p-5 w-52 shadow-lg z-10">
                <div className="bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-3">THE SOLUTION</div>
                <p className="text-gray-700 text-sm font-semibold leading-snug">
                  An AI tutor that adapts content delivery style per disability — simplifies text, converts to audio, breaks tasks into micro-steps.
                </p>
              </div>

              {/* Dashboard preview card */}
              <div className="absolute -top-20 right-8 -translate-x-1/2 bg-indigo-700 rounded-3xl p-4 w-64 shadow-2xl z-30 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-black text-sm">AI Tutor Dashboard</span>
                </div>
                <div className="bg-indigo-600 rounded-2xl p-3 mb-2">
                  <div className="text-xs font-bold text-indigo-200 mb-1">Today's Plan</div>
                  <div className="font-black text-sm">📚 Science: Photosynthesis</div>
                  <div className="mt-2 bg-indigo-500 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full w-1/2 transition-all"/>
                  </div>
                  <div className="text-xs text-indigo-200 mt-1">2 / 4 Steps Completed</div>
                </div>
                <div className="flex gap-3 text-center">
                  {[['🔊', 'Listen'], ['📖', 'Read'], ['☰', 'Steps'], ['❓', 'Quiz']].map(([ico, lbl]) => (
                    <div key={lbl} className="flex-1">
                      <div className="text-lg">{ico}</div>
                      <div className="text-xs text-indigo-200 font-semibold">{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce">
          <span className="text-xs font-semibold">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce"/>
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading emoji="⚙️" title="How It Works" subtitle="Three specialized modes, one powerful platform." />

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <DisabilityCard
              icon={BookOpen}
              title="For Dyslexia"
              color="#4F86C6"
              bgColor="bg-blue-50"
              borderColor="border-blue-200"
              delay={0}
              features={[
                'Dyslexia-friendly fonts & spacing',
                'Short sentences (max 10 words)',
                'Bold key words & analogies',
                'Calming color themes',
                'Visual bullet-point format',
              ]}
            />
            <DisabilityCard
              icon={HeadphonesIcon}
              title="For Visual Impairment"
              color="#2A9D8F"
              bgColor="bg-teal-50"
              borderColor="border-teal-200"
              delay={150}
              features={[
                'Text-to-speech (natural voice)',
                'Rich verbal descriptions',
                'Screen reader compatible',
                'Audio-first content delivery',
                'Sensory-based analogies',
              ]}
            />
            <DisabilityCard
              icon={Zap}
              title="For ADHD"
              color="#F4A261"
              bgColor="bg-orange-50"
              borderColor="border-orange-200"
              delay={300}
              features={[
                'Micro-step lesson breakdown',
                'Focus timer & reminders',
                'Energetic emojis & rewards',
                'Quick summaries (3 bullets)',
                'Encouragement & badges',
              ]}
            />
          </div>

          {/* Comparison demo strip */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-teal-50 rounded-3xl border border-gray-200 p-8 grid md:grid-cols-3 gap-6 items-center">
            {/* Standard text */}
            <div>
              <div className="bg-gray-200 text-gray-700 text-xs font-black px-3 py-1 rounded-full inline-block mb-3">Standard Text</div>
              <p className="text-gray-600 text-xs leading-loose">
                Photosynthesis is the process used by plants to convert light energy into chemical energy.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="text-white" size={18} />
                </div>
                <span className="text-xs font-black text-indigo-600">AI Adapts</span>
              </div>
            </div>
            {/* Simplified text */}
            <div>
              <div className="bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-3">AI Simplified Text</div>
              <p className="text-blue-800 text-sm font-bold leading-loose">
                🌱 Plants use <strong>light energy</strong> to make food.<br/>
                This is called <strong>photosynthesis</strong>.<br/>
                Simple. Clear. Got it? ✅
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ GAMES SECTION ══════════ */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #fef9c3 0%, #ecfdf5 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading emoji="🎮" title="Interactive Mind Games" subtitle="Learning through play — designed for each ability." color="text-purple-700" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🔤', title: 'Word Match', desc: 'Match words to emoji pictures with hints. Perfect for building vocabulary.', tag: 'Dyslexia', color: '#4F86C6', bg: 'bg-blue-50', border: 'border-blue-200' },
              { emoji: '🧩', title: 'Sentence Builder', desc: 'Drag and drop words to build correct sentences step by step.', tag: 'Dyslexia', color: '#4F86C6', bg: 'bg-blue-50', border: 'border-blue-200' },
              { emoji: '🎯', title: 'Focus Challenge', desc: 'Find target items quickly! Timed challenges to build concentration.', tag: 'ADHD', color: '#F4A261', bg: 'bg-orange-50', border: 'border-orange-200' },
              { emoji: '🧠', title: 'Memory Sprint', desc: 'Remember growing sequences! Trains working memory in fun bursts.', tag: 'ADHD', color: '#F4A261', bg: 'bg-orange-50', border: 'border-orange-200' },
              { emoji: '🔢', title: 'Audio Quiz', desc: 'Math and logic questions delivered verbally for screen-reader users.', tag: 'Visual', color: '#2A9D8F', bg: 'bg-teal-50', border: 'border-teal-200' },
              { emoji: '📐', title: 'Pattern Words', desc: 'Verbal number and word patterns — no visuals needed!', tag: 'Visual', color: '#2A9D8F', bg: 'bg-teal-50', border: 'border-teal-200' },
            ].map((game, i) => (
              <div key={i} className={`${game.bg} border-2 ${game.border} rounded-3xl p-6 card-hover`}>
                <div className="text-4xl mb-3">{game.emoji}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-black text-gray-800 text-lg">{game.title}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: game.color }}>{game.tag}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{game.desc}</p>
                <Link
                  to="/games"
                  className="inline-flex items-center gap-1 text-sm font-black"
                  style={{ color: game.color }}
                >
                  Play Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              🎮 Go to Games Hub <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ KEY BENEFITS ══════════ */}
      <section ref={benefitsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading emoji="✨" title="Key Benefits" subtitle="Why SahaytaAI is different from every other learning platform." />

          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <BenefitCard icon="🎯" title="Personalized Learning" desc="Every response adapts to the student's specific cognitive needs." color="indigo" />
            <BenefitCard icon="📈" title="Better Engagement" desc="Interactive games and micro-lessons keep attention alive." color="amber" />
            <BenefitCard icon="💪" title="Builds Confidence" desc="Encouragement baked into every interaction and achievement." color="green" />
            <BenefitCard icon="🎓" title="Inclusive Education" desc="Ensures no student is left behind due to learning differences." color="purple" />
          </div>

          {/* Bottom banner */}
          <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-2xl">
            <div className="text-4xl mb-3">💗</div>
            <h3 className="text-2xl font-black mb-2">Different abilities, same potential.</h3>
            <p className="text-indigo-200 text-lg mb-6">AI makes learning accessible for every student.</p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black px-8 py-3 rounded-2xl hover:bg-yellow-50 transition-colors"
            >
              Begin Your Journey <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">SAI</span>
              </div>
              <span className="text-white font-black text-lg">SahaytaAI</span>
            </div>
            <p className="text-sm leading-relaxed">AI-powered adaptive learning for students with dyslexia, ADHD, and visual impairments.</p>
          </div>
          <div>
            <h4 className="text-white font-black mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/chat', 'AI Tutor Chat'], ['/games', 'Mind Games'], ['/upload', 'Upload PDF']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-indigo-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-3">Supported Modes</h4>
            <ul className="space-y-2 text-sm">
              <li>📖 Dyslexia-Friendly</li>
              <li>⚡ ADHD-Optimized</li>
              <li>🎧 Visual Impairment</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-xs border-t border-gray-800 pt-6">
          © 2026 SahaytaAI · Built for inclusive education by team Algo-Allies
        </div>
      </footer>
    </div>
  );
}

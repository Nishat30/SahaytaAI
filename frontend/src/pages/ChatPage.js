import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, RotateCcw, Sparkles, BookOpen, Zap, Headphones, ChevronRight, Star, Trophy, Brain } from 'lucide-react';
import MicButton from '../components/MicButton';
import { useSpeechInput } from '../hooks/useSpeechInput';

const DISABILITY_TYPES = [
  {
    id: 'dyslexia', label: 'Dyslexia', emoji: '📖', icon: BookOpen,
    color: '#4F86C6', gradient: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200', softBg: '#EFF6FF',
    desc: 'Simplified text, short sentences',
    longDesc: 'Content simplified with short sentences, dyslexia-friendly fonts, bold key words and calming visuals.',
    stats: [{ label: 'Sentence', value: '≤10 words' }, { label: 'Format', value: 'Bullets' }, { label: 'Style', value: 'Bold' }],
    badge: 'Most Popular', badgeColor: 'bg-blue-100 text-blue-700',
    features: ['Short sentences', 'Bold keywords', 'Bullet points', 'Simple words'],
  },
  {
    id: 'adhd', label: 'ADHD', emoji: '⚡', icon: Zap,
    color: '#F4A261', gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-50', border: 'border-orange-200', softBg: '#FFF7ED',
    desc: 'Micro-steps, energetic format',
    longDesc: 'Content broken into micro-steps with emojis, focus timers, quick summaries and motivational nudges.',
    stats: [{ label: 'Steps', value: 'Micro' }, { label: 'Format', value: 'Numbered' }, { label: 'Energy', value: '🚀 High' }],
    badge: 'High Energy', badgeColor: 'bg-orange-100 text-orange-700',
    features: ['Micro-steps', 'Emojis', 'Quick summaries', 'Rewards'],
  },
  {
    id: 'visual', label: 'Visual Impairment', emoji: '🎧', icon: Headphones,
    color: '#2A9D8F', gradient: 'from-teal-400 to-emerald-500', bg: 'bg-teal-50', border: 'border-teal-200', softBg: '#F0FDFA',
    desc: 'Audio-first, rich descriptions',
    longDesc: 'All content described verbally with vivid language, screen reader compatible and sensory-rich analogies.',
    stats: [{ label: 'Format', value: 'Audio' }, { label: 'Visuals', value: 'Described' }, { label: 'TTS', value: 'Built-in' }],
    badge: 'Voice First', badgeColor: 'bg-teal-100 text-teal-700',
    features: ['Text-to-speech', 'Rich descriptions', 'Screen reader', 'Sensory analogies'],
  },
];

const SUGGESTED = [
  { text: 'Explain photosynthesis', emoji: '🌱' },
  { text: 'What is gravity?', emoji: '🍎' },
  { text: 'How does the heart work?', emoji: '❤️' },
  { text: 'Teach me fractions', emoji: '➗' },
  { text: 'What are clouds made of?', emoji: '☁️' },
  { text: 'Explain the water cycle', emoji: '💧' },
];

const XP_PER_MESSAGE = 15;

/* ── Minion SVG Left (happy, waving) ── */
function MinionLeft() {
  return (
    <div className="absolute left-0 bottom-0 w-44 select-none pointer-events-none animate-float" style={{ animationDuration: '4s' }}>
      <svg viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="80" cy="155" rx="45" ry="55" fill="#F6C90E"/>
        {/* Overalls */}
        <ellipse cx="80" cy="175" rx="45" ry="38" fill="#3B6FD4"/>
        <rect x="60" y="130" width="40" height="50" rx="5" fill="#3B6FD4"/>
        {/* Overall straps */}
        <rect x="62" y="128" width="10" height="30" rx="5" fill="#3B6FD4"/>
        <rect x="88" y="128" width="10" height="30" rx="5" fill="#3B6FD4"/>
        {/* Overall buckles */}
        <rect x="63" y="128" width="8" height="6" rx="2" fill="#FFD700"/>
        <rect x="89" y="128" width="8" height="6" rx="2" fill="#FFD700"/>
        {/* Buttons */}
        <circle cx="80" cy="162" r="3" fill="#1a3a7a"/>
        <circle cx="80" cy="172" r="3" fill="#1a3a7a"/>
        {/* Head */}
        <ellipse cx="80" cy="95" rx="42" ry="48" fill="#F6C90E"/>
        {/* Goggle band */}
        <rect x="38" y="78" width="84" height="22" rx="11" fill="#888" opacity="0.5"/>
        {/* Goggles */}
        <circle cx="80" cy="89" r="18" fill="white" stroke="#555" strokeWidth="3"/>
        <circle cx="80" cy="89" r="13" fill="#87CEEB"/>
        <circle cx="80" cy="89" r="9" fill="#1a1a2e"/>
        <circle cx="76" cy="85" r="3" fill="white" opacity="0.8"/>
        {/* Mouth - big smile */}
        <path d="M62 110 Q80 125 98 110" stroke="#333" strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Teeth */}
        <rect x="70" y="110" width="20" height="8" rx="2" fill="white"/>
        {/* Ears */}
        <ellipse cx="38" cy="95" rx="8" ry="10" fill="#E5B800"/>
        <ellipse cx="122" cy="95" rx="8" ry="10" fill="#E5B800"/>
        {/* Left arm waving up */}
        <ellipse cx="28" cy="135" rx="10" ry="28" fill="#F6C90E" transform="rotate(-40 28 135)"/>
        <ellipse cx="14" cy="112" rx="8" ry="8" fill="#F6C90E"/>
        {/* Right arm down */}
        <ellipse cx="132" cy="148" rx="10" ry="25" fill="#F6C90E" transform="rotate(15 132 148)"/>
        <ellipse cx="138" cy="170" rx="8" ry="8" fill="#F6C90E"/>
        {/* Feet */}
        <ellipse cx="62" cy="208" rx="18" ry="10" fill="#333"/>
        <ellipse cx="98" cy="208" rx="18" ry="10" fill="#333"/>
        {/* Hair strands */}
        <line x1="70" y1="47" x2="65" y2="30" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        <line x1="80" y1="47" x2="80" y2="28" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        <line x1="90" y1="47" x2="95" y2="30" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        {/* Stars around */}
        <text x="5" y="60" fontSize="16" fill="#FFD700">⭐</text>
        <text x="120" y="50" fontSize="12" fill="#FFD700">✨</text>
      </svg>
    </div>
  );
}

/* ── Minion SVG Right (excited, book) ── */
function MinionRight() {
  return (
    <div className="absolute right-0 bottom-0 w-44 select-none pointer-events-none animate-float" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
      <svg viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="80" cy="155" rx="45" ry="55" fill="#F6C90E"/>
        {/* Overalls purple */}
        <ellipse cx="80" cy="175" rx="45" ry="38" fill="#7B2D8B"/>
        <rect x="60" y="130" width="40" height="50" rx="5" fill="#7B2D8B"/>
        <rect x="62" y="128" width="10" height="30" rx="5" fill="#7B2D8B"/>
        <rect x="88" y="128" width="10" height="30" rx="5" fill="#7B2D8B"/>
        <rect x="63" y="128" width="8" height="6" rx="2" fill="#FFD700"/>
        <rect x="89" y="128" width="8" height="6" rx="2" fill="#FFD700"/>
        <circle cx="80" cy="162" r="3" fill="#4a0a6a"/>
        <circle cx="80" cy="172" r="3" fill="#4a0a6a"/>
        {/* Head */}
        <ellipse cx="80" cy="90" rx="42" ry="48" fill="#F6C90E"/>
        {/* TWO goggles */}
        <rect x="38" y="76" width="84" height="22" rx="11" fill="#666" opacity="0.6"/>
        <circle cx="64" cy="87" r="14" fill="white" stroke="#555" strokeWidth="2.5"/>
        <circle cx="64" cy="87" r="10" fill="#90EE90"/>
        <circle cx="64" cy="87" r="6" fill="#1a1a2e"/>
        <circle cx="61" cy="84" r="2" fill="white" opacity="0.8"/>
        <circle cx="96" cy="87" r="14" fill="white" stroke="#555" strokeWidth="2.5"/>
        <circle cx="96" cy="87" r="10" fill="#90EE90"/>
        <circle cx="96" cy="87" r="6" fill="#1a1a2e"/>
        <circle cx="93" cy="84" r="2" fill="white" opacity="0.8"/>
        {/* Mouth O shape - surprised/excited */}
        <ellipse cx="80" cy="112" rx="10" ry="8" fill="#333"/>
        <ellipse cx="80" cy="113" rx="7" ry="5" fill="#cc2200"/>
        {/* Ears */}
        <ellipse cx="38" cy="90" rx="8" ry="10" fill="#E5B800"/>
        <ellipse cx="122" cy="90" rx="8" ry="10" fill="#E5B800"/>
        {/* Left arm holding book */}
        <ellipse cx="28" cy="148" rx="10" ry="25" fill="#F6C90E" transform="rotate(-10 28 148)"/>
        {/* Book */}
        <rect x="5" y="155" width="30" height="22" rx="3" fill="#e74c3c"/>
        <rect x="7" y="157" width="26" height="18" rx="2" fill="#c0392b"/>
        <line x1="20" y1="157" x2="20" y2="175" stroke="#fff" strokeWidth="1.5"/>
        <line x1="9" y1="162" x2="19" y2="162" stroke="#fff" strokeWidth="1"/>
        <line x1="9" y1="166" x2="19" y2="166" stroke="#fff" strokeWidth="1"/>
        <line x1="9" y1="170" x2="19" y2="170" stroke="#fff" strokeWidth="1"/>
        {/* Right arm up excited */}
        <ellipse cx="132" cy="132" rx="10" ry="28" fill="#F6C90E" transform="rotate(35 132 132)"/>
        <ellipse cx="148" cy="112" rx="8" ry="8" fill="#F6C90E"/>
        {/* Feet */}
        <ellipse cx="62" cy="208" rx="18" ry="10" fill="#333"/>
        <ellipse cx="98" cy="208" rx="18" ry="10" fill="#333"/>
        {/* Hair */}
        <line x1="72" y1="42" x2="68" y2="25" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        <line x1="80" y1="42" x2="80" y2="22" stroke="#333" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="88" y1="42" x2="93" y2="25" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        {/* Stars */}
        <text x="110" y="55" fontSize="16" fill="#FFD700">⭐</text>
        <text x="5" y="40" fontSize="12" fill="#FFD700">✨</text>
      </svg>
    </div>
  );
}

function TypingIndicator({ color }) {
  return (
    <div className="flex gap-1.5 items-center px-5 py-4">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2.5 h-2.5 rounded-full animate-bounce"
          style={{ background: color, animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

function ModeCard({ type, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={() => onSelect(type.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative group text-left rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 focus:outline-none"
      style={{ boxShadow: hovered ? `0 24px 48px ${type.color}44` : '0 4px 20px rgba(0,0,0,0.15)' }}>
      <div className={`h-2 w-full bg-gradient-to-r ${type.gradient}`} />
      <div className="bg-white p-7">
        <div className="flex justify-between items-start mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl bg-gradient-to-br ${type.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {type.emoji}
          </div>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${type.badgeColor}`}>{type.badge}</span>
        </div>
        <h3 className="font-black text-xl text-gray-900 mb-1">{type.label}</h3>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">{type.longDesc}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {type.features.map(f => (
            <span key={f} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: type.color + '18', color: type.color }}>{f}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-2xl" style={{ background: type.softBg }}>
          {type.stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-black text-xs" style={{ color: type.color }}>{s.value}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className={`flex items-center justify-between p-3 rounded-2xl text-white bg-gradient-to-r ${type.gradient} group-hover:shadow-lg transition-all`}>
          <span className="font-black text-sm">Start Learning</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}

function XPBar({ xp, color }) {
  const max = 100;
  const pct = Math.min((xp % max) / max * 100, 100);
  const level = Math.floor(xp / max) + 1;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full text-white" style={{ background: color }}>
        <Star size={10} className="fill-yellow-300 text-yellow-300" /> Lv.{level}
      </div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-20">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold text-gray-400">{xp} XP</span>
    </div>
  );
}

export default function ChatPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [xp, setXp] = useState(0);
  const [showXpPop, setShowXpPop] = useState(false);
  const [streak, setStreak] = useState(0);
  const bottomRef = useRef(null);
  const { listening, transcript, startListening, stopListening, supported, error: micError } = useSpeechInput();

  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (selectedType === 'visual') setTtsEnabled(true); }, [selectedType]);

  const gainXp = () => {
    setXp(x => x + XP_PER_MESSAGE);
    setShowXpPop(true);
    setTimeout(() => setShowXpPop(false), 1500);
    setStreak(s => s + 1);
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || !selectedType || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, disability_type: selectedType, conversation_history: messages }),
      });
      const data = await res.json();
      const assistantMsg = { role: 'assistant', content: data.response };
      setMessages([...history, assistantMsg]);
      gainXp();
      if (ttsEnabled && data.response) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(data.response);
        utt.rate = 0.9;
        window.speechSynthesis.speak(utt);
      }
    } catch {
      setMessages([...history, { role: 'assistant', content: '⚠️ Could not connect to server. Make sure backend is running on port 8000.' }]);
    }
    setLoading(false);
  };

  const handleMicStart = () => {
    setInput('');
    startListening((finalText) => { setTimeout(() => sendMessage(finalText), 400); });
  };

  const currentType = DISABILITY_TYPES.find(t => t.id === selectedType);

  /* ══════ MODE SELECTOR ══════ */
  if (!selectedType) {
    return (
      <div className="min-h-screen pt-16 overflow-hidden relative" style={{ background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
        {/* Animated bg orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full opacity-10 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* LEFT Minion */}
        <div className="fixed left-0 bottom-0 w-48 z-10 hidden lg:block">
          <MinionLeft />
        </div>
        {/* RIGHT Minion */}
        <div className="fixed right-0 bottom-0 w-48 z-10 hidden lg:block">
          <MinionRight />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/80 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">
              <Sparkles size={14} className="text-yellow-400" /> Adaptive AI Learning Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">Learning Style</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Our AI tutor adapts completely to how you learn. Pick your profile and get a personalized experience.</p>
            <div className="flex justify-center gap-8 mt-8">
              {[['🧠', '3', 'Learning Modes'], ['🎮', '6', 'Mini Games'], ['⚡', '100%', 'Adaptive']].map(([emoji, val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-white font-black text-xl">{val}</div>
                  <div className="text-white/50 text-xs font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {DISABILITY_TYPES.map(type => <ModeCard key={type.id} type={type} onSelect={setSelectedType} />)}
          </div>
          <p className="text-center text-white/40 text-sm mt-12">You can switch your learning mode at any time.</p>
        </div>
      </div>
    );
  }

  /* ══════ CHAT INTERFACE ══════ */
  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ background: currentType.softBg }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-white bg-gradient-to-r ${currentType.gradient} shadow-md`}>
            <span className="text-lg">{currentType.emoji}</span>
            <div>
              <div className="font-black text-sm leading-none">{currentType.label}</div>
              <div className="text-white/70 text-xs">{currentType.desc}</div>
            </div>
          </div>
          <div className="flex-1 hidden sm:block"><XPBar xp={xp} color={currentType.color} /></div>
          {streak > 0 && <div className="hidden sm:flex items-center gap-1 text-orange-600 font-black text-sm px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-200">🔥 {streak} streak</div>}
          <div className="flex items-center gap-2">
            {supported && <div className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${listening ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>🎙️ {listening ? 'Listening…' : 'Mic ready'}</div>}
            <button onClick={() => setTtsEnabled(!ttsEnabled)} className={`p-2 rounded-xl border-2 transition-all ${ttsEnabled ? 'text-white border-transparent' : 'border-gray-200 text-gray-400 bg-white'}`} style={ttsEnabled ? { background: currentType.color } : {}}>
              {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button onClick={() => { setMessages([]); setSelectedType(null); setXp(0); setStreak(0); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:text-red-500 text-xs font-bold transition-all">
              <RotateCcw size={13} /> Switch
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex max-w-5xl w-full mx-auto px-4 py-6 gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3"><Trophy size={18} style={{ color: currentType.color }} /><span className="font-black text-gray-800 text-sm">Your Progress</span></div>
            <div className="text-4xl font-black text-center py-4 rounded-2xl mb-3" style={{ background: currentType.color + '15', color: currentType.color }}>Lv. {Math.floor(xp / 100) + 1}</div>
            <XPBar xp={xp} color={currentType.color} />
            <div className="mt-3 text-xs text-gray-400 text-center font-semibold">{100 - (xp % 100)} XP to next level</div>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3"><Brain size={18} style={{ color: currentType.color }} /><span className="font-black text-gray-800 text-sm">Active Mode</span></div>
            <div className={`w-full h-1.5 rounded-full mb-4 bg-gradient-to-r ${currentType.gradient}`} />
            <ul className="space-y-2">
              {currentType.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentType.color }} />{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="font-black text-gray-800 text-sm mb-3">📊 Session Stats</div>
            <div className="space-y-2">
              {[['Questions asked', messages.filter(m => m.role === 'user').length], ['XP earned', xp], ['Streak', `🔥 ${streak}`]].map(([label, val]) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-500 font-semibold">{label}</span>
                  <span className="font-black" style={{ color: currentType.color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.length === 0 && (
              <div>
                <div className={`bg-gradient-to-br ${currentType.gradient} rounded-3xl p-8 text-white mb-6 shadow-xl`}>
                  <div className="text-5xl mb-3">{currentType.emoji}</div>
                  <h2 className="text-2xl font-black mb-2">Ready to learn, {currentType.label} mode!</h2>
                  <p className="text-white/80 text-sm leading-relaxed">{currentType.longDesc}</p>
                  {currentType.id === 'visual' && supported && (
                    <div className="mt-4 flex items-center gap-3 bg-white/20 rounded-2xl p-3">
                      <MicButton listening={listening} onStart={handleMicStart} onStop={stopListening} supported={supported} color="white" size="md" label="Speak" />
                      <div>
                        <div className="font-black text-sm">Voice-First Mode Active</div>
                        <div className="text-white/70 text-xs">Tap the mic and speak your question!</div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">💡 Try asking about…</p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED.map((s) => (
                    <button key={s.text} onClick={() => sendMessage(s.text)}
                      className="flex items-center gap-2.5 text-left px-4 py-3 bg-white rounded-2xl border-2 border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 text-sm font-semibold text-gray-700"
                      onMouseEnter={e => e.currentTarget.style.borderColor = currentType.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#f3f4f6'}>
                      <span className="text-xl">{s.emoji}</span>{s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md bg-gradient-to-br ${currentType.gradient}`}>🤖</div>
                )}
                <div className={`max-w-[80%] rounded-3xl text-sm font-semibold leading-relaxed shadow-sm px-5 py-4 ${m.role === 'user' ? 'text-white rounded-br-lg' : 'bg-white text-gray-800 rounded-bl-lg border border-gray-100'}`}
                  style={m.role === 'user' ? { background: `linear-gradient(135deg, ${currentType.color}, ${currentType.color}cc)` } : {}}>
                  <pre className="whitespace-pre-wrap font-[inherit]">{m.content}</pre>
                </div>
                {m.role === 'user' && <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gray-200 flex-shrink-0 text-base">👤</div>}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md bg-gradient-to-br ${currentType.gradient}`}>🤖</div>
                <div className="bg-white rounded-3xl rounded-bl-lg border border-gray-100 shadow-sm"><TypingIndicator color={currentType.color} /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {showXpPop && (
            <div className="fixed top-24 right-6 z-50 font-black text-white px-4 py-2 rounded-2xl shadow-xl animate-bounce-in text-sm" style={{ background: currentType.color }}>
              +{XP_PER_MESSAGE} XP ⭐
            </div>
          )}

          {micError && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-2 text-red-600 text-xs font-semibold mb-2">⚠️ {micError}</div>}
          {listening && (
            <div className="bg-white border-2 border-dashed rounded-2xl px-4 py-2.5 text-sm font-semibold text-gray-500 flex items-center gap-2 mb-2" style={{ borderColor: currentType.color }}>
              <span className="text-red-500 animate-pulse">🔴</span>
              <span className="flex-1 italic">{transcript || 'Listening…'}</span>
              <button onClick={stopListening} className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 font-bold">Cancel</button>
            </div>
          )}

          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-3 flex items-end gap-3"
            style={{ boxShadow: `0 0 0 2px ${listening ? currentType.color + '44' : 'transparent'}, 0 8px 32px rgba(0,0,0,0.08)` }}>
            <MicButton listening={listening} onStart={handleMicStart} onStop={stopListening} supported={supported} color={currentType.color} size="md" label="Speak" />
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={supported ? 'Type or tap 🎙️ to speak…' : 'Ask me anything…'}
              rows={1} className="flex-1 resize-none border-none outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 py-2"
              style={{ maxHeight: 120, background: 'transparent' }} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: !input.trim() || loading ? '#d1d5db' : `linear-gradient(135deg, ${currentType.color}, ${currentType.color}bb)` }}>
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2 font-semibold">🎙️ Tap mic → speak → auto-sends · ⌨️ Enter to send · Each answer earns XP ⭐</p>
        </div>
      </div>
    </div>
  );
}
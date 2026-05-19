import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, Clock, Star, Trophy, Zap } from 'lucide-react';
import MicButton from '../components/MicButton';
import { useSpeechInput } from '../hooks/useSpeechInput';

/* ══════════ CONFIG ══════════ */
const DISABILITY_TYPES = [
  { id: 'dyslexia', label: 'Dyslexia', emoji: '📖', color: '#4F86C6', gradient: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', softBg: '#EFF6FF' },
  { id: 'adhd',    label: 'ADHD',     emoji: '⚡', color: '#F4A261', gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-50', softBg: '#FFF7ED' },
  { id: 'visual',  label: 'Visual Impairment', emoji: '🎧', color: '#2A9D8F', gradient: 'from-teal-400 to-emerald-500', bg: 'bg-teal-50', softBg: '#F0FDFA' },
];

const GAMES_META = {
  dyslexia: [
    { id: 'flip_match',       emoji: '🃏', title: 'Flip & Match',      desc: 'Flip cards to find matching word pairs' },
    { id: 'sentence_builder', emoji: '🧩', title: 'Sentence Builder',  desc: 'Drag words to build sentences' },
    { id: 'word_scramble',    emoji: '🔀', title: 'Word Unscramble',   desc: 'Rearrange letters to spell words' },
    { id: 'fill_blank',       emoji: '📝', title: 'Fill in the Blank', desc: 'Pick the correct missing word' },
    { id: 'rhyme_time',       emoji: '🎵', title: 'Rhyme Time',        desc: 'Find words that rhyme' },
    { id: 'word_chain',       emoji: '🔗', title: 'Word Chain',        desc: 'Pick the next word that starts with the last letter' },
  ],
  adhd: [
    { id: 'focus_challenge',  emoji: '🎯', title: 'Focus Challenge',   desc: 'Find all target items before time runs out' },
    { id: 'memory_sprint',    emoji: '🧠', title: 'Memory Sprint',     desc: 'Remember growing sequences' },
    { id: 'rapid_sort',       emoji: '⚡', title: 'Rapid Sort',        desc: 'Sort items into categories fast!' },
    { id: 'number_pop',       emoji: '💥', title: 'Number Pop',        desc: 'Pop numbers in ascending order' },
    { id: 'color_match',      emoji: '🎨', title: 'Color Match',       desc: 'Match the word color not the word text' },
    { id: 'odd_one_out',      emoji: '🔍', title: 'Odd One Out',       desc: 'Find which item does not belong' },
  ],
  visual: [
    { id: 'audio_quiz',       emoji: '🔢', title: 'Audio Quiz',        desc: 'Math & logic questions — speak your answer', mic: true },
    { id: 'pattern_words',    emoji: '📐', title: 'Pattern Words',     desc: 'Complete number patterns', mic: true },
    { id: 'word_math',        emoji: '🧮', title: 'Word Math',         desc: 'Solve math problems read aloud', mic: true },
    { id: 'story_sequence',   emoji: '📖', title: 'Story Sequence',    desc: 'Put story events in correct order' },
    { id: 'sound_spelling',   emoji: '🔤', title: 'Sound & Spell',     desc: 'Listen and spell the word', mic: true },
    { id: 'riddle_me',        emoji: '🤔', title: 'Riddle Me',         desc: 'Solve fun riddles read aloud', mic: true },
  ],
};

/* ══════════ FLOATING DECORATIONS ══════════ */
function FloatingDeco() {
  const items = [
    { el: '📐', s: { top: '8%', left: '3%' }, dur: 5 }, { el: '🎮', s: { top: '20%', left: '7%' }, dur: 4 },
    { el: '📏', s: { top: '15%', right: '4%' }, dur: 4.5 }, { el: '🕹️', s: { top: '35%', right: '6%' }, dur: 5 },
    { el: '➕', s: { top: '50%', left: '2%' }, dur: 3.5 }, { el: '🧮', s: { bottom: '30%', right: '3%' }, dur: 4 },
    { el: '➗', s: { bottom: '40%', left: '4%' }, dur: 5.5 }, { el: '🏆', s: { top: '55%', right: '8%' }, dur: 5 },
    { el: '⭐', s: { top: '10%', left: '22%' }, dur: 3 }, { el: '✨', s: { bottom: '20%', right: '18%' }, dur: 2.5 },
    { el: '🎲', s: { bottom: '25%', left: '8%' }, dur: 3.8 }, { el: '🔢', s: { top: '70%', left: '5%' }, dur: 4.2 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((item, i) => (
        <div key={i} className="absolute text-3xl opacity-30 animate-float select-none"
          style={{ animationDuration: `${item.dur}s`, animationDelay: `${i * 0.3}s`, ...item.s }}>
          {item.el}
        </div>
      ))}
    </div>
  );
}

/* ══════════ CARTOON CHARACTERS ══════════ */
function CartoonCat() {
  return (
    <div className="animate-float select-none pointer-events-none" style={{ animationDuration: '4s' }}>
      <svg viewBox="0 0 120 150" width="110" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="110" rx="32" ry="38" fill="#FF9F43"/>
        <ellipse cx="60" cy="175" rx="45" ry="38" fill="#3B6FD4" opacity="0"/>
        <ellipse cx="60" cy="118" rx="18" ry="22" fill="#FFD5A8"/>
        <ellipse cx="60" cy="62" rx="36" ry="34" fill="#FF9F43"/>
        <polygon points="28,38 18,10 42,30" fill="#FF9F43"/>
        <polygon points="32,35 24,16 42,30" fill="#FF8FAF"/>
        <polygon points="92,38 102,10 78,30" fill="#FF9F43"/>
        <polygon points="88,35 96,16 78,30" fill="#FF8FAF"/>
        <ellipse cx="48" cy="58" rx="9" ry="10" fill="white"/>
        <ellipse cx="72" cy="58" rx="9" ry="10" fill="white"/>
        <circle cx="49" cy="59" r="6" fill="#333"/>
        <circle cx="73" cy="59" r="6" fill="#333"/>
        <circle cx="51" cy="57" r="2" fill="white"/>
        <circle cx="75" cy="57" r="2" fill="white"/>
        <ellipse cx="60" cy="70" rx="4" ry="3" fill="#FF6B9D"/>
        <path d="M54 73 Q60 79 66 73" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="24" y1="68" x2="50" y2="70" stroke="#888" strokeWidth="1.5"/>
        <line x1="24" y1="73" x2="50" y2="72" stroke="#888" strokeWidth="1.5"/>
        <line x1="70" y1="70" x2="96" y2="68" stroke="#888" strokeWidth="1.5"/>
        <line x1="70" y1="72" x2="96" y2="73" stroke="#888" strokeWidth="1.5"/>
        <ellipse cx="26" cy="105" rx="10" ry="22" fill="#FF9F43" transform="rotate(-20 26 105)"/>
        <ellipse cx="94" cy="105" rx="10" ry="22" fill="#FF9F43" transform="rotate(20 94 105)"/>
        <rect x="82" y="112" width="22" height="14" rx="7" fill="#555"/>
        <circle cx="99" cy="117" r="2.5" fill="#e74c3c"/>
        <circle cx="94" cy="114" r="2.5" fill="#2ecc71"/>
        <rect x="85" y="116" width="5" height="2" rx="1" fill="#aaa"/>
        <rect x="87" y="114" width="2" height="5" rx="1" fill="#aaa"/>
        <path d="M90 138 Q115 120 108 100" stroke="#FF9F43" strokeWidth="10" strokeLinecap="round" fill="none"/>
        <ellipse cx="46" cy="145" rx="16" ry="9" fill="#FF9F43"/>
        <ellipse cx="74" cy="145" rx="16" ry="9" fill="#FF9F43"/>
      </svg>
    </div>
  );
}

function CartoonOwl() {
  return (
    <div className="animate-float select-none pointer-events-none" style={{ animationDuration: '5s', animationDelay: '0.4s' }}>
      <svg viewBox="0 0 100 130" width="90" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="88" rx="32" ry="38" fill="#8B6914"/>
        <ellipse cx="20" cy="90" rx="16" ry="28" fill="#6B4F10" transform="rotate(-15 20 90)"/>
        <ellipse cx="80" cy="90" rx="16" ry="28" fill="#6B4F10" transform="rotate(15 80 90)"/>
        <ellipse cx="50" cy="95" rx="20" ry="26" fill="#D4A853"/>
        <ellipse cx="50" cy="48" rx="30" ry="32" fill="#8B6914"/>
        <polygon points="28,26 22,8 36,22" fill="#8B6914"/>
        <polygon points="72,26 78,8 64,22" fill="#8B6914"/>
        <circle cx="38" cy="46" r="13" fill="white"/>
        <circle cx="62" cy="46" r="13" fill="white"/>
        <circle cx="38" cy="46" r="9" fill="#FF9F43"/>
        <circle cx="62" cy="46" r="9" fill="#FF9F43"/>
        <circle cx="38" cy="46" r="5" fill="#1a1a2e"/>
        <circle cx="62" cy="46" r="5" fill="#1a1a2e"/>
        <circle cx="40" cy="44" r="2" fill="white"/>
        <circle cx="64" cy="44" r="2" fill="white"/>
        <polygon points="50,54 44,62 56,62" fill="#E67E22"/>
        <rect x="28" y="18" width="44" height="7" rx="3" fill="#2d3436"/>
        <polygon points="50,10 70,20 50,25 30,20" fill="#2d3436"/>
        <line x1="70" y1="20" x2="72" y2="32" stroke="#e74c3c" strokeWidth="2"/>
        <circle cx="72" cy="34" r="3" fill="#e74c3c"/>
        <ellipse cx="38" cy="124" rx="10" ry="7" fill="#E67E22"/>
        <ellipse cx="62" cy="124" rx="10" ry="7" fill="#E67E22"/>
      </svg>
    </div>
  );
}

/* ══════════ SCORE HEADER ══════════ */
function ScoreHeader({ score, total, color, label }) {
  const pct = total > 0 ? (score / total) * 100 : 0;
  return (
    <div className="flex items-center justify-between mb-6 p-4 rounded-2xl" style={{ background: color + '15' }}>
      <div className="flex items-center gap-2">
        <Trophy size={18} style={{ color }} />
        <span className="font-black text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="font-black text-lg" style={{ color }}>{score}/{total}</span>
      </div>
    </div>
  );
}

/* ══════════ WIN SCREEN ══════════ */
function WinScreen({ score, total, onReplay }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="text-center py-8 animate-bounce-in">
      <div className="text-7xl mb-4">{pct === 100 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
      <h3 className="text-3xl font-black text-gray-800 mb-2">{pct === 100 ? 'Perfect Score!' : pct >= 60 ? 'Great Job!' : 'Keep Practicing!'}</h3>
      <div className="text-5xl font-black my-4" style={{ color: '#4F46E5' }}>{pct}%</div>
      <p className="text-gray-500 mb-6">You got {score} out of {total} correct</p>
      <button onClick={onReplay} className="px-8 py-3 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg">
        🔄 Play Again
      </button>
    </div>
  );
}

/* ══════════ GAME 1: FLIP & MATCH ══════════ */
const FLIP_DATA = [
  { id: 1, word: 'cat', emoji: '🐱' }, { id: 2, word: 'dog', emoji: '🐶' },
  { id: 3, word: 'sun', emoji: '☀️' }, { id: 4, word: 'tree', emoji: '🌳' },
  { id: 5, word: 'book', emoji: '📚' }, { id: 6, word: 'fish', emoji: '🐟' },
];

function FlipMatch({ color }) {
  const cards = [...FLIP_DATA.map(d => ({ ...d, type: 'word', uid: `w${d.id}` })),
                  ...FLIP_DATA.map(d => ({ ...d, type: 'emoji', uid: `e${d.id}` }))];
  const [deck, setDeck] = useState(() => [...cards].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  const flip = (uid) => {
    if (locked || flipped.includes(uid) || matched.some(m => m === uid)) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = next.map(u => deck.find(c => c.uid === u));
      if (a.id === b.id && a.type !== b.type) {
        setTimeout(() => { setMatched(prev => [...prev, a.uid, b.uid]); setFlipped([]); setLocked(false); }, 600);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  };

  const reset = () => { setDeck([...cards].sort(() => Math.random() - 0.5)); setFlipped([]); setMatched([]); setMoves(0); setLocked(false); };
  const done = matched.length === cards.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="font-black text-gray-700 flex items-center gap-2"><Zap size={16} style={{ color }}/> Moves: {moves}</div>
        <div className="font-black text-gray-700">Matched: {matched.length / 2}/{FLIP_DATA.length}</div>
        <button onClick={reset} className="text-sm font-bold px-3 py-1.5 rounded-xl border-2 border-gray-200 hover:bg-gray-50 flex items-center gap-1"><RefreshCw size={13}/>Reset</button>
      </div>
      {done ? <WinScreen score={FLIP_DATA.length} total={FLIP_DATA.length} onReplay={reset} /> : (
        <div className="grid grid-cols-4 gap-3">
          {deck.map(card => {
            const isFlipped = flipped.includes(card.uid) || matched.includes(card.uid);
            const isMatched = matched.includes(card.uid);
            return (
              <button key={card.uid} onClick={() => flip(card.uid)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black text-sm transition-all duration-300 border-3 shadow-md
                  ${isMatched ? 'scale-95 opacity-60 cursor-default' : 'hover:scale-105 hover:shadow-lg cursor-pointer'}
                `}
                style={{
                  background: isMatched ? '#d1fae5' : isFlipped ? 'white' : `linear-gradient(135deg, ${color}, ${color}bb)`,
                  borderColor: isMatched ? '#10b981' : isFlipped ? color : 'transparent',
                  borderWidth: 2,
                  minHeight: 80
                }}>
                {isFlipped ? (
                  <div className="flex flex-col items-center gap-1">
                    {card.type === 'emoji' ? <span className="text-3xl">{card.emoji}</span> : <span className="text-base text-gray-800">{card.word}</span>}
                    {isMatched && <CheckCircle size={14} className="text-green-500" />}
                  </div>
                ) : <span className="text-2xl text-white">?</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════ GAME 2: SENTENCE BUILDER ══════════ */
const SENTENCE_DATA = [
  { words: ['The', 'cat', 'sat', 'on', 'the', 'mat'], hint: 'Cat resting somewhere' },
  { words: ['Birds', 'can', 'fly', 'high', 'in', 'the', 'sky'], hint: 'Birds and the sky' },
  { words: ['I', 'love', 'to', 'eat', 'ice', 'cream'], hint: 'A favourite treat' },
  { words: ['The', 'sun', 'is', 'bright', 'today'], hint: 'About the weather' },
];

function SentenceBuilder({ color }) {
  const [idx, setIdx] = useState(0);
  const [order, setOrder] = useState([]);
  const [pool, setPool] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const sentence = SENTENCE_DATA[idx];

  useEffect(() => { if (sentence) { setPool([...sentence.words].sort(() => Math.random() - 0.5)); setOrder([]); setFeedback(null); } }, [idx]);

  if (idx >= SENTENCE_DATA.length) return <WinScreen score={score} total={SENTENCE_DATA.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const addWord = (w, i) => { setOrder([...order, w]); setPool(pool.filter((_, pi) => pi !== i)); };
  const removeWord = (i) => { setPool([...pool, order[i]]); setOrder(order.filter((_, oi) => oi !== i)); };
  const check = () => {
    const correct = order.join(' ') === sentence.words.join(' ');
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => setIdx(i => i + 1), 1400);
  };

  return (
    <div>
      <ScoreHeader score={score} total={SENTENCE_DATA.length} color={color} label={`Sentence ${idx + 1}/${SENTENCE_DATA.length}`} />
      <div className="bg-blue-50 rounded-2xl px-4 py-2 mb-4 text-center text-sm font-semibold text-blue-600">💡 Hint: {sentence.hint}</div>
      <div className="min-h-16 border-3 border-dashed rounded-2xl p-4 flex flex-wrap gap-2 mb-5 transition-all" style={{ borderColor: color + '88', background: color + '08' }}>
        {order.length === 0 && <span className="text-gray-400 text-sm font-semibold self-center">Tap words below to build the sentence…</span>}
        {order.map((w, i) => (
          <button key={i} onClick={() => removeWord(i)}
            className="px-4 py-2 rounded-xl text-white text-sm font-black shadow-md hover:opacity-80 transition-opacity flex items-center gap-1"
            style={{ background: color }}>{w} <span className="opacity-70">×</span></button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {pool.map((w, i) => (
          <button key={i} onClick={() => addWord(w, i)}
            className="px-4 py-2 rounded-xl text-sm font-black border-2 bg-white hover:shadow-md transition-all hover:-translate-y-0.5"
            style={{ borderColor: color, color }}>
            {w}
          </button>
        ))}
      </div>
      {feedback && <div className={`text-center font-black text-lg py-3 rounded-2xl mb-3 ${feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{feedback === 'correct' ? '✅ Perfect!' : `❌ "${sentence.words.join(' ')}"`}</div>}
      {!feedback && <button onClick={check} disabled={order.length !== sentence.words.length} className="w-full py-3 rounded-2xl font-black text-white disabled:opacity-40 transition-all hover:opacity-90" style={{ background: color }}>Check Answer ✅</button>}
    </div>
  );
}

/* ══════════ GAME 3: WORD SCRAMBLE ══════════ */
const SCRAMBLE_DATA = [
  { word: 'apple', emoji: '🍎', hint: 'A red fruit' },
  { word: 'happy', emoji: '😊', hint: 'Feeling joyful' },
  { word: 'cloud', emoji: '☁️', hint: 'In the sky' },
  { word: 'music', emoji: '🎵', hint: 'Songs and sounds' },
  { word: 'tiger', emoji: '🐯', hint: 'A big striped cat' },
  { word: 'water', emoji: '💧', hint: 'You drink this' },
];

function WordScramble({ color }) {
  const scramble = (w) => w.split('').sort(() => Math.random() - 0.5).join('');
  const [idx, setIdx] = useState(0);
  const [letters, setLetters] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const item = SCRAMBLE_DATA[idx];

  useEffect(() => {
    if (!item) return;
    let sc = scramble(item.word);
    while (sc === item.word) sc = scramble(item.word);
    setLetters(sc.split('').map((l, i) => ({ l, i, used: false })));
    setChosen([]); setFeedback(null);
  }, [idx]);

  if (idx >= SCRAMBLE_DATA.length) return <WinScreen score={score} total={SCRAMBLE_DATA.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const addLetter = (letterObj) => {
    if (letterObj.used) return;
    setLetters(prev => prev.map(l => l.i === letterObj.i ? { ...l, used: true } : l));
    setChosen(prev => [...prev, letterObj]);
  };
  const removeLetter = (pos) => {
    const removed = chosen[pos];
    setLetters(prev => prev.map(l => l.i === removed.i ? { ...l, used: false } : l));
    setChosen(prev => prev.filter((_, p) => p !== pos));
  };
  const check = () => {
    const attempt = chosen.map(c => c.l).join('');
    const correct = attempt === item.word;
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setTimeout(() => setIdx(i => i + 1), 1200);
  };
  const clear = () => { setLetters(item.word.split('').map((l, i) => ({ l, i, used: false }))); setChosen([]); setFeedback(null); let sc = scramble(item.word); while (sc === item.word) sc = scramble(item.word); setLetters(sc.split('').map((l, i) => ({ l, i, used: false }))); };

  return (
    <div>
      <ScoreHeader score={score} total={SCRAMBLE_DATA.length} color={color} label={`Word ${idx + 1}/${SCRAMBLE_DATA.length}`} />
      <div className="text-center mb-6">
        <div className="text-8xl mb-3">{item.emoji}</div>
        <div className="text-gray-500 font-semibold bg-gray-50 rounded-xl px-4 py-2 inline-block">💡 {item.hint}</div>
      </div>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {item.word.split('').map((_, i) => (
          <button key={i} onClick={() => chosen[i] && removeLetter(i)}
            className="w-12 h-14 rounded-xl border-3 flex items-center justify-center text-xl font-black transition-all"
            style={{ borderColor: chosen[i] ? color : '#d1d5db', background: chosen[i] ? color + '15' : '#f9fafb' }}>
            {chosen[i] ? chosen[i].l.toUpperCase() : ''}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {letters.map((letterObj) => (
          <button key={letterObj.i} onClick={() => addLetter(letterObj)}
            disabled={letterObj.used}
            className="w-12 h-12 rounded-xl text-lg font-black shadow-md transition-all hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: letterObj.used ? '#e5e7eb' : `linear-gradient(135deg, ${color}, ${color}bb)`, color: letterObj.used ? '#9ca3af' : 'white' }}>
            {letterObj.l.toUpperCase()}
          </button>
        ))}
      </div>
      {feedback === 'wrong' && <div className="bg-red-50 text-red-600 font-black text-center rounded-2xl py-3 mb-4">❌ Not quite! Try again or clear ↓</div>}
      {feedback === 'correct' && <div className="bg-green-50 text-green-700 font-black text-center rounded-2xl py-3 mb-4">✅ Brilliant!</div>}
      <div className="flex gap-3">
        <button onClick={clear} className="flex-1 py-3 rounded-2xl font-black border-2 border-gray-200 text-gray-600 hover:bg-gray-50">Clear 🔄</button>
        <button onClick={check} disabled={chosen.length !== item.word.length || feedback === 'correct'} className="flex-1 py-3 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: color }}>Check ✅</button>
      </div>
    </div>
  );
}

/* ══════════ GAME 4: FILL IN THE BLANK ══════════ */
const FILL_DATA = [
  { sentence: 'The ___ is shining brightly today.', answer: 'sun', options: ['sun', 'moon', 'star', 'cloud'] },
  { sentence: 'A ___ has four legs and says "woof".', answer: 'dog', options: ['cat', 'dog', 'bird', 'fish'] },
  { sentence: 'We read books in a ___.', answer: 'library', options: ['garden', 'library', 'kitchen', 'garage'] },
  { sentence: 'Plants need water and ___ to grow.', answer: 'sunlight', options: ['music', 'sunlight', 'darkness', 'ice'] },
  { sentence: 'The opposite of cold is ___.', answer: 'hot', options: ['wet', 'fast', 'hot', 'loud'] },
  { sentence: 'You use a ___ to brush your teeth.', answer: 'toothbrush', options: ['toothbrush', 'hairbrush', 'paintbrush', 'spoon'] },
];

function FillBlank({ color }) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const item = FILL_DATA[idx];

  if (idx >= FILL_DATA.length) return <WinScreen score={score} total={FILL_DATA.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const select = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt === item.answer) setScore(s => s + 1);
    setTimeout(() => { setChosen(null); setIdx(i => i + 1); }, 1200);
  };

  const parts = item.sentence.split('___');

  return (
    <div>
      <ScoreHeader score={score} total={FILL_DATA.length} color={color} label={`Question ${idx + 1}/${FILL_DATA.length}`} />
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border-2 text-center" style={{ borderColor: color + '44' }}>
        <p className="text-xl font-black text-gray-800 leading-relaxed">
          {parts[0]}
          <span className="inline-block border-b-4 px-4 py-1 mx-2 min-w-[80px] text-center rounded-lg" style={{ borderColor: color, background: chosen ? color + '15' : '#f3f4f6', color: chosen ? color : '#9ca3af' }}>
            {chosen || '___'}
          </span>
          {parts[1]}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {item.options.sort(() => Math.random() - 0.5).map((opt, i) => (
          <button key={`${idx}-${opt}`} onClick={() => select(opt)}
            className={`py-4 rounded-2xl font-black text-lg transition-all border-2 ${
              chosen === null ? 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-0.5' :
              opt === item.answer ? 'bg-green-100 border-green-500 text-green-700' :
              opt === chosen ? 'bg-red-100 border-red-400 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════ GAME 5: RHYME TIME ══════════ */
const RHYME_DATA = [
  { word: 'cat', options: ['dog', 'hat', 'sun', 'tree'], answer: 'hat' },
  { word: 'blue', options: ['red', 'glue', 'pink', 'grey'], answer: 'glue' },
  { word: 'cake', options: ['pie', 'lake', 'bread', 'rice'], answer: 'lake' },
  { word: 'night', options: ['day', 'light', 'moon', 'star'], answer: 'light' },
  { word: 'bear', options: ['wolf', 'chair', 'lion', 'frog'], answer: 'chair' },
  { word: 'run', options: ['walk', 'fun', 'jump', 'swim'], answer: 'fun' },
];

function RhymeTime({ color }) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const item = RHYME_DATA[idx];

  if (idx >= RHYME_DATA.length) return <WinScreen score={score} total={RHYME_DATA.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const select = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt === item.answer) setScore(s => s + 1);
    setTimeout(() => { setChosen(null); setIdx(i => i + 1); }, 1200);
  };

  return (
    <div>
      <ScoreHeader score={score} total={RHYME_DATA.length} color={color} label={`Round ${idx + 1}/${RHYME_DATA.length}`} />
      <div className="text-center mb-8">
        <p className="text-gray-500 font-semibold mb-3">Find the word that RHYMES with:</p>
        <div className="inline-block px-10 py-5 rounded-3xl text-4xl font-black text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
          🎵 {item.word.toUpperCase()}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {item.options.map((opt) => (
          <button key={`${idx}-${opt}`} onClick={() => select(opt)}
            className={`py-5 rounded-2xl font-black text-xl transition-all border-2 shadow-sm ${
              chosen === null ? 'bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1' :
              opt === item.answer ? 'bg-green-100 border-green-500 text-green-700' :
              opt === chosen ? 'bg-red-100 border-red-400 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════ GAME 6: WORD CHAIN ══════════ */
const WORD_CHAIN_DATA = [
  { word: 'apple', options: ['egg', 'elephant', 'arm', 'ink'], answer: 'elephant', hint: 'Starts with E' },
  { word: 'tiger', options: ['rabbit', 'rose', 'ring', 'egg'], answer: 'rabbit', hint: 'Starts with R' },
  { word: 'nest', options: ['train', 'tree', 'time', 'toy'], answer: 'train', hint: 'Starts with T' },
  { word: 'kite', options: ['eagle', 'exit', 'ear', 'eye'], answer: 'eagle', hint: 'Starts with E' },
  { word: 'cloud', options: ['drum', 'door', 'duck', 'dive'], answer: 'drum', hint: 'Starts with D' },
  { word: 'lamp', options: ['pencil', 'paper', 'park', 'play'], answer: 'pencil', hint: 'Starts with P' },
];

function WordChain({ color }) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const item = WORD_CHAIN_DATA[idx];

  if (idx >= WORD_CHAIN_DATA.length) return <WinScreen score={score} total={WORD_CHAIN_DATA.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const select = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt === item.answer) setScore(s => s + 1);
    setTimeout(() => { setChosen(null); setIdx(i => i + 1); }, 1200);
  };

  const lastLetter = item.word.slice(-1).toUpperCase();

  return (
    <div>
      <ScoreHeader score={score} total={WORD_CHAIN_DATA.length} color={color} label={`Link ${idx + 1}/${WORD_CHAIN_DATA.length}`} />
      <div className="text-center mb-8">
        <p className="text-gray-500 font-semibold mb-4">Pick the word that STARTS with the last letter of:</p>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="px-8 py-4 rounded-2xl text-3xl font-black text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
            {item.word}
          </div>
          <div className="text-3xl">🔗</div>
          <div className="px-6 py-4 rounded-2xl text-3xl font-black bg-yellow-100 border-2 border-yellow-400 text-yellow-700">
            {lastLetter}...
          </div>
        </div>
        <p className="text-xs text-gray-400 font-semibold">💡 {item.hint}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {item.options.map((opt) => (
          <button key={`${idx}-${opt}`} onClick={() => select(opt)}
            className={`py-5 rounded-2xl font-black text-xl transition-all border-2 ${
              chosen === null ? 'bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1' :
              opt === item.answer ? 'bg-green-100 border-green-500 text-green-700' :
              opt === chosen ? 'bg-red-100 border-red-400 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════ ADHD GAMES ══════════ */
function FocusChallenge({ color }) {
  const tasks = [
    { task: 'Tap all the 🌟 STARS!', items: ['🌟','🔴','🌟','🔵','🌟','🟢','🌟','🟡','🔴','🌟','🟣','🌟'], target: '🌟', time: 12 },
    { task: 'Find the 🐱 CATS!', items: ['🐱','🐶','🐱','🐰','🐱','🐻','🐶','🐱','🐰','🐱','🐻','🐶'], target: '🐱', time: 10 },
    { task: 'Select all ❤️ HEARTS!', items: ['❤️','💙','❤️','💚','❤️','💛','❤️','💜','💙','❤️','💛','❤️'], target: '❤️', time: 10 },
    { task: 'Click every 🍎 APPLE!', items: ['🍎','🍊','🍎','🍋','🍇','🍎','🍊','🍎','🍋','🍎','🍇','🍊'], target: '🍎', time: 10 },
  ];
  const [taskIdx, setTaskIdx] = useState(0);
  const [selected, setSelected] = useState([]);
  const [timeLeft, setTimeLeft] = useState(tasks[0].time);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const task = tasks[taskIdx];
  useEffect(() => {
    if (result) return;
    const iv = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(iv); setResult('timeout'); return 0; } return t - 1; }), 1000);
    return () => clearInterval(iv);
  }, [taskIdx, result]);
  const toggle = (i) => { if (result) return; setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]); };
  const check = () => {
    const targets = task.items.map((it, i) => it === task.target ? i : -1).filter(i => i !== -1);
    const correct = targets.every(i => selected.includes(i)) && selected.length === targets.length;
    if (correct) setScore(s => s + 1);
    setResult(correct ? 'correct' : 'wrong');
  };
  const next = () => {
    if (taskIdx + 1 < tasks.length) { setTaskIdx(t => t + 1); setSelected([]); setResult(null); setTimeLeft(tasks[taskIdx + 1]?.time || 10); }
    else setTaskIdx(tasks.length);
  };
  if (taskIdx >= tasks.length) return <WinScreen score={score} total={tasks.length} onReplay={() => { setTaskIdx(0); setScore(0); setSelected([]); setResult(null); setTimeLeft(tasks[0].time); }} />;
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <span className="font-black text-gray-700">Task {taskIdx + 1}/{tasks.length} · ⭐ {score}</span>
        <div className={`flex items-center gap-1 font-black text-lg px-4 py-1.5 rounded-full ${timeLeft <= 4 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'}`}><Clock size={16}/> {timeLeft}s</div>
      </div>
      <div className="text-center mb-5 py-3 rounded-2xl font-black text-lg" style={{ background: color + '15', color }}>{task.task}</div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {task.items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`text-3xl p-3 rounded-2xl border-3 transition-all ${selected.includes(i) ? 'scale-110 shadow-lg' : 'hover:scale-105 border-gray-200 bg-white'}`}
            style={selected.includes(i) ? { borderColor: color, background: color + '20' } : {}}>
            {item}
          </button>
        ))}
      </div>
      {!result ? <button onClick={check} disabled={!selected.length} className="w-full py-3 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: color }}>Submit ✅</button>
        : <div className={`text-center p-4 rounded-2xl font-black text-lg ${result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {result === 'correct' ? '🎉 Perfect!' : result === 'timeout' ? '⏰ Time up!' : '❌ Try again!'}
          <button onClick={next} className="block mx-auto mt-3 px-6 py-2 rounded-xl text-white text-sm font-black" style={{ background: color }}>Next →</button>
        </div>}
    </div>
  );
}

function MemorySprint({ color }) {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState('show');
  const [userSeq, setUserSeq] = useState([]);
  const [score, setScore] = useState(0);
  const allEmojis = ['🔴','🔵','🟢','🟡','🟣','🟠'];
  const sequences = [[0,1,2],[0,2,1,3],[2,1,3,0,4],[1,0,3,2,4,5],[2,4,1,3,0,5,4]];
  const seq = sequences[round]?.map(i => allEmojis[i]);
  useEffect(() => {
    if (!seq) return;
    setPhase('show'); setUserSeq([]);
    const t = setTimeout(() => setPhase('input'), (round + 2) * 900);
    return () => clearTimeout(t);
  }, [round]);
  if (round >= sequences.length) return <WinScreen score={score} total={sequences.length} onReplay={() => { setRound(0); setScore(0); }} />;
  const check = () => {
    const correct = userSeq.every((e, i) => e === seq[i]) && userSeq.length === seq.length;
    if (correct) setScore(s => s + 1);
    setPhase(correct ? 'correct' : 'wrong');
    setTimeout(() => setRound(r => r + 1), 1400);
  };
  return (
    <div className="text-center">
      <ScoreHeader score={score} total={sequences.length} color={color} label={`Round ${round + 1}/${sequences.length} · Length ${seq?.length}`} />
      {phase === 'show' && <div><p className="text-gray-500 mb-4 font-semibold">Memorize the order! 👀</p><div className="flex justify-center gap-3 flex-wrap">{seq?.map((e, i) => <div key={i} className="w-16 h-16 rounded-2xl bg-white border-2 shadow-md flex items-center justify-center text-3xl animate-bounce-in" style={{ animationDelay: `${i * 0.15}s`, borderColor: color }}>{e}</div>)}</div></div>}
      {phase === 'input' && <div>
        <p className="text-gray-500 mb-4 font-semibold">Now reproduce it! ({userSeq.length}/{seq?.length})</p>
        <div className="flex justify-center gap-3 mb-5 flex-wrap min-h-16">{userSeq.map((e, i) => <div key={i} className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2" style={{ borderColor: color, background: color + '15' }}>{e}</div>)}</div>
        <div className="flex justify-center flex-wrap gap-3 mb-5">{allEmojis.map((e, i) => <button key={i} onClick={() => setUserSeq(s => [...s, e])} disabled={userSeq.length >= (seq?.length || 0)} className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-200 text-2xl hover:border-orange-300 disabled:opacity-40 shadow-sm hover:shadow-md">{e}</button>)}</div>
        <div className="flex gap-3 justify-center">
          <button onClick={check} disabled={userSeq.length < (seq?.length || 0)} className="px-8 py-3 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: color }}>Submit ✅</button>
          <button onClick={() => setUserSeq([])} className="px-4 py-3 rounded-2xl border-2 border-gray-200 font-black text-gray-500"><RefreshCw size={16}/></button>
        </div>
      </div>}
      {(phase === 'correct' || phase === 'wrong') && <div className={`text-3xl font-black py-8 ${phase === 'correct' ? 'text-green-600' : 'text-red-500'}`}>{phase === 'correct' ? '✅ Excellent!' : '❌ Oops!'}</div>}
    </div>
  );
}

function RapidSort({ color }) {
  const categories = [
    { name: 'Animals 🐾', items: ['🐱','🐶','🐰','🐻','🦊','🐯'], emoji: '🐾' },
    { name: 'Fruits 🍎', items: ['🍎','🍊','🍋','🍇','🍓','🍑'], emoji: '🍎' },
    { name: 'Vehicles 🚗', items: ['🚗','🚌','✈️','🚂','🚢','🏍️'], emoji: '🚗' },
  ];
  const [catIdx, setCatIdx] = useState(0);
  const [items, setItems] = useState(() => [...categories[0].items].sort(() => Math.random() - 0.5));
  const [sorted, setSorted] = useState([]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(null);
  const cat = categories[catIdx];

  const tap = (item, i) => {
    if (cat.items.includes(item)) { setScore(s => s + 1); setSorted(p => [...p, item]); setItems(prev => prev.filter((_, pi) => pi !== i)); }
    else { setWrong(i); setTimeout(() => setWrong(null), 600); }
    if (sorted.length + 1 >= cat.items.length) setTimeout(() => { if (catIdx + 1 < categories.length) { setCatIdx(c => c + 1); setItems([...categories[catIdx + 1]?.items || []].sort(() => Math.random() - 0.5)); setSorted([]); } else setCatIdx(categories.length); }, 800);
  };

  if (catIdx >= categories.length) return <WinScreen score={score} total={categories.reduce((a, c) => a + c.items.length, 0)} onReplay={() => { setCatIdx(0); setItems([...categories[0].items].sort(() => Math.random() - 0.5)); setSorted([]); setScore(0); }} />;

  const allItems = [...items, ...categories.filter((_, i) => i !== catIdx).flatMap(c => [...c.items.slice(0, 2)])].sort(() => Math.random() - 0.5).slice(0, 12);

  return (
    <div>
      <ScoreHeader score={score} total={18} color={color} label={`Category ${catIdx + 1}/${categories.length}`} />
      <div className="text-center mb-5 py-3 rounded-2xl font-black text-lg" style={{ background: color + '15', color }}>
        Tap only the: <span className="text-2xl">{cat.emoji}</span> {cat.name}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {allItems.map((item, i) => (
          <button key={i} onClick={() => tap(item, i)}
            className={`text-3xl p-4 rounded-2xl border-2 transition-all hover:scale-110 ${wrong === i ? 'bg-red-100 border-red-400 animate-pulse' : 'bg-white border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-md'}`}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberPop({ color }) {
  const [nums, setNums] = useState(() => Array.from({ length: 12 }, (_, i) => ({ val: i + 1, id: i, popped: false })).sort(() => Math.random() - 0.5));
  const [next, setNext] = useState(1);
  const [wrong, setWrong] = useState(null);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState(0);

  const pop = (num) => {
    if (num.val === next) {
      setNums(prev => prev.map(n => n.id === num.id ? { ...n, popped: true } : n));
      if (next === 12) setDone(true);
      else setNext(n => n + 1);
    } else { setWrong(num.id); setErrors(e => e + 1); setTimeout(() => setWrong(null), 500); }
  };
  const reset = () => { setNums(Array.from({ length: 12 }, (_, i) => ({ val: i + 1, id: i, popped: false })).sort(() => Math.random() - 0.5)); setNext(1); setDone(false); setErrors(0); };

  if (done) return <WinScreen score={12 - errors} total={12} onReplay={reset} />;

  return (
    <div>
      <div className="flex justify-between mb-5">
        <div className="font-black text-gray-700">Next: <span className="text-2xl" style={{ color }}>{next}</span></div>
        <div className="font-black text-gray-500">Errors: {errors}</div>
        <div className="font-black text-gray-700">Progress: {next - 1}/12</div>
      </div>
      <p className="text-center text-gray-500 font-semibold mb-5">Pop numbers 1 → 12 in order! 💥</p>
      <div className="grid grid-cols-4 gap-3">
        {nums.map(num => (
          <button key={num.id} onClick={() => !num.popped && pop(num)} disabled={num.popped}
            className={`w-full aspect-square rounded-2xl font-black text-2xl transition-all shadow-md ${num.popped ? 'opacity-20 scale-75 cursor-default' : wrong === num.id ? 'bg-red-100 border-2 border-red-400 animate-pulse scale-95' : 'bg-white border-2 border-gray-200 hover:scale-110 hover:shadow-lg'}`}
            style={!num.popped && wrong !== num.id ? { borderColor: '#e5e7eb' } : {}}>
            {num.popped ? '✅' : num.val}
          </button>
        ))}
      </div>
    </div>
  );
}

const STROOP_DATA = [
  { word: 'RED', color: 'blue', answer: 'blue' }, { word: 'BLUE', color: 'green', answer: 'green' },
  { word: 'GREEN', color: 'red', answer: 'red' }, { word: 'YELLOW', color: 'purple', answer: 'purple' },
  { word: 'PURPLE', color: 'orange', answer: 'orange' }, { word: 'ORANGE', color: 'yellow', answer: 'yellow' },
];
const COLOR_MAP = { red: '#ef4444', blue: '#3b82f6', green: '#22c55e', yellow: '#eab308', purple: '#a855f7', orange: '#f97316' };

function ColorMatch({ color }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const item = STROOP_DATA[idx];
  if (idx >= STROOP_DATA.length) return <WinScreen score={score} total={STROOP_DATA.length} onReplay={() => { setIdx(0); setScore(0); }} />;
  const options = Object.keys(COLOR_MAP).sort(() => Math.random() - 0.5).slice(0, 4);
  if (!options.includes(item.answer)) { options[0] = item.answer; options.sort(() => Math.random() - 0.5); }
  const select = (opt) => {
    if (chosen) return; setChosen(opt);
    if (opt === item.answer) setScore(s => s + 1);
    setTimeout(() => { setChosen(null); setIdx(i => i + 1); }, 1000);
  };
  return (
    <div>
      <ScoreHeader score={score} total={STROOP_DATA.length} color={color} label={`Round ${idx + 1}/${STROOP_DATA.length}`} />
      <p className="text-center text-gray-500 font-semibold mb-6">Tap the COLOR of the text, NOT what it says! 🧠</p>
      <div className="text-center mb-8 py-6 bg-white rounded-3xl shadow-sm border-2 border-gray-100">
        <span className="text-6xl font-black" style={{ color: COLOR_MAP[item.color] }}>{item.word}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => (
          <button key={`${idx}-${opt}`} onClick={() => select(opt)}
            className={`py-4 rounded-2xl font-black text-white text-lg shadow-md transition-all border-4 ${chosen ? 'cursor-default' : 'hover:-translate-y-1 hover:shadow-lg'} ${chosen === opt && opt === item.answer ? 'border-green-400 scale-105' : chosen === opt ? 'border-red-400 opacity-80' : 'border-transparent'}`}
            style={{ background: COLOR_MAP[opt] }}>
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

function OddOneOut({ color }) {
  const rounds = [
    { items: ['🍎','🍊','🍋','🚗'], odd: '🚗', hint: 'Not a fruit' },
    { items: ['🐱','🐶','✈️','🐰'], odd: '✈️', hint: 'Not an animal' },
    { items: ['📚','📖','📝','🎮'], odd: '🎮', hint: 'Not for reading' },
    { items: ['🔴','🔵','🟢','🍌'], odd: '🍌', hint: 'Not a color circle' },
    { items: ['🌞','⭐','🌙','🌊'], odd: '🌊', hint: 'Not in the sky' },
    { items: ['1','2','A','3'], odd: 'A', hint: 'Not a number' },
  ];
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const round = rounds[idx];
  if (idx >= rounds.length) return <WinScreen score={score} total={rounds.length} onReplay={() => { setIdx(0); setScore(0); }} />;
  const select = (item) => {
    if (chosen) return; setChosen(item);
    if (item === round.odd) setScore(s => s + 1);
    setTimeout(() => { setChosen(null); setIdx(i => i + 1); }, 1200);
  };
  return (
    <div>
      <ScoreHeader score={score} total={rounds.length} color={color} label={`Round ${idx + 1}/${rounds.length}`} />
      <p className="text-center text-gray-500 font-semibold mb-2">Which one does NOT belong? 🔍</p>
      <p className="text-center text-xs text-gray-400 mb-6">💡 Hint: {round.hint}</p>
      <div className="grid grid-cols-2 gap-5">
        {round.items.map((item, i) => (
          <button key={i} onClick={() => select(item)}
            className={`py-8 rounded-3xl text-5xl font-black border-3 transition-all shadow-sm ${
              chosen === null ? 'bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1' :
              item === round.odd ? 'bg-green-100 border-green-500 scale-105' :
              item === chosen ? 'bg-red-100 border-red-400' : 'bg-gray-50 border-gray-200 opacity-50'
            }`}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════ VISUAL GAMES — shared speak helper ══════════ */
const speak = (text) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
};

/* ══════════ GAME: AUDIO QUIZ ══════════ */
function AudioQuiz({ color }) {
  const questions = [
    { q: 'If you have 8 apples and eat 3, how many remain?', opts: ['4','5','6','3'], ans: '5', exp: '8 minus 3 equals 5.' },
    { q: 'What is 6 multiplied by 7?', opts: ['42','36','48','54'], ans: '42', exp: '6 times 7 is 42.' },
    { q: 'A triangle has how many sides?', opts: ['4','2','3','5'], ans: '3', exp: 'A triangle always has 3 sides.' },
    { q: 'What is 100 divided by 4?', opts: ['20','25','30','40'], ans: '25', exp: '100 divided by 4 is 25.' },
    { q: 'If today is Tuesday, what day was yesterday?', opts: ['Wednesday','Sunday','Monday','Saturday'], ans: 'Monday', exp: 'The day before Tuesday is Monday.' },
    { q: 'How many hours are in 2 days?', opts: ['24','36','48','60'], ans: '48', exp: '2 days times 24 hours equals 48.' },
  ];
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState(null);
  const [score, setScore] = useState(0);
  const [micFb, setMicFb] = useState('');
  const { listening, transcript, startListening, stopListening, supported, error: micErr } = useSpeechInput();
  const q = questions[idx];

  // ── AUTO VOICE: speak question automatically when idx changes ──
  useEffect(() => {
    if (!q) return;
    setMicFb('');
    const t = setTimeout(() => speak(q.q), 300);
    return () => clearTimeout(t);
  }, [idx]);

  if (idx >= questions.length) return <WinScreen score={score} total={questions.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const select = (opt) => {
    if (ans) return;
    setAns(opt);
    if (opt === q.ans) setScore(s => s + 1);
    speak(opt === q.ans ? 'Correct! ' + q.exp : 'Not quite. ' + q.exp);
    setTimeout(() => { setAns(null); setMicFb(''); setIdx(i => i + 1); }, 1800);
  };

  const handleMic = () => {
    startListening((spoken) => {
      const matched = q.opts.find(o => spoken.toLowerCase().includes(o.toLowerCase()));
      if (matched) { setMicFb(`🎙️ "${spoken}" → ${matched}`); select(matched); }
      else setMicFb(`🎙️ "${spoken}" — no match`);
    });
  };

  return (
    <div>
      <ScoreHeader score={score} total={questions.length} color={color} label={`Q ${idx + 1}/${questions.length}`} />
      <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-5 mb-5">
        <p className="text-lg font-black text-gray-800">{q.q}</p>
        <button onClick={() => speak(q.q)} className="mt-2 text-xs font-bold text-teal-600 border border-teal-300 px-3 py-1 rounded-lg hover:bg-teal-50">🔊 Replay</button>
      </div>
      {!ans && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border mb-4">
          <MicButton listening={listening} onStart={handleMic} onStop={stopListening} supported={supported} color={color} size="sm" />
          <div>
            {listening ? <p className="text-xs text-red-500 font-bold animate-pulse">🔴 Listening…</p> : <p className="text-xs text-gray-500 font-semibold">Speak your answer</p>}
            {micFb && <p className="text-xs font-semibold mt-1" style={{ color }}>{micFb}</p>}
            {micErr && <p className="text-xs text-red-500">{micErr}</p>}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {q.opts.map(opt => (
          <button key={`${idx}-${opt}`} onClick={() => select(opt)}
            className={`py-4 rounded-2xl font-black text-lg border-2 transition-all ${ans === null ? 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-0.5' : opt === q.ans ? 'bg-green-100 border-green-500 text-green-700' : opt === ans ? 'bg-red-100 border-red-400 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════ GAME: PATTERN WORDS ══════════ */
function PatternWords({ color }) {
  const patterns = [
    { seq: '2, 4, 6, 8, ?', ans: '10', rule: 'Add 2 each time', hint: 'Even numbers' },
    { seq: '5, 10, 15, 20, ?', ans: '25', rule: 'Multiply by 5', hint: 'Times table of 5' },
    { seq: '1, 4, 9, 16, ?', ans: '25', rule: 'Square numbers', hint: '1², 2², 3², 4², 5²' },
    { seq: '3, 6, 12, 24, ?', ans: '48', rule: 'Double each time', hint: 'Multiply by 2' },
    { seq: '100, 90, 80, 70, ?', ans: '60', rule: 'Subtract 10', hint: 'Counting down by 10' },
    { seq: '1, 1, 2, 3, 5, 8, ?', ans: '13', rule: 'Fibonacci: add previous two', hint: '5 + 8 = ?' },
  ];
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [micFb, setMicFb] = useState('');
  const { listening, transcript, startListening, stopListening, supported } = useSpeechInput();
  const p = patterns[idx];

  // ── AUTO VOICE: speak pattern automatically when idx changes ──
  useEffect(() => {
    if (!p) return;
    setMicFb('');
    const t = setTimeout(() => speak(p.seq + '. Hint: ' + p.hint), 300);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

  if (idx >= patterns.length) return <WinScreen score={score} total={patterns.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const check = (val) => {
    const a = (val || input).trim();
    if (!a) return;
    const correct = a === p.ans;
    if (correct) setScore(s => s + 1);
    setResult(correct ? 'correct' : 'wrong');
    speak(correct ? 'Correct! ' + p.rule : 'The answer is ' + p.ans + '. ' + p.rule);
    setTimeout(() => { setInput(''); setResult(null); setMicFb(''); setIdx(i => i + 1); }, 1800);
  };

  const handleMic = () => {
    setInput('');
    startListening((spoken) => {
      const n = spoken.match(/\d+/);
      const a = n ? n[0] : spoken.trim().split(' ')[0];
      setMicFb(`🎙️ "${spoken}" → ${a}`);
      setInput(a);
      setTimeout(() => check(a), 300);
    });
  };

  return (
    <div>
      <ScoreHeader score={score} total={patterns.length} color={color} label={`Pattern ${idx + 1}/${patterns.length}`} />
      <div className="bg-teal-50 border-2 border-teal-200 rounded-3xl p-6 text-center mb-5">
        <p className="text-3xl font-black text-gray-800 mb-2">{p.seq}</p>
        <p className="text-sm text-gray-500 font-semibold">💡 {p.hint}</p>
        <button onClick={() => speak(p.seq + '. Hint: ' + p.hint)} className="mt-2 text-xs font-bold text-teal-600 border border-teal-300 px-3 py-1 rounded-lg">🔊 Replay</button>
      </div>
      {!result && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border mb-4">
          <MicButton listening={listening} onStart={handleMic} onStop={stopListening} supported={supported} color={color} size="sm" />
          <div>
            {listening ? <p className="text-xs text-red-500 font-bold animate-pulse">🔴 Listening…</p> : <p className="text-xs text-gray-500 font-semibold">Say the next number</p>}
            {micFb && <p className="text-xs font-semibold mt-1" style={{ color }}>{micFb}</p>}
          </div>
        </div>
      )}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !result && check()} placeholder="Type or speak the next number…" className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-2xl font-black text-center focus:outline-none mb-4" style={{ borderColor: input ? color : undefined }} disabled={!!result} />
      {result && <div className={`text-center p-3 rounded-2xl font-black mb-3 ${result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{result === 'correct' ? '✅ Correct!' : `❌ Answer: ${p.ans} — ${p.rule}`}</div>}
      {!result && <button onClick={() => check()} disabled={!input.trim()} className="w-full py-3 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: color }}>Check ✅</button>}
    </div>
  );
}

/* ══════════ GAME: WORD MATH ══════════ */
function WordMath({ color }) {
  const problems = [
    { q: 'Three plus five equals?', ans: '8', speak_q: 'Three plus five equals?' },
    { q: 'Ten minus four equals?', ans: '6', speak_q: 'Ten minus four equals?' },
    { q: 'Two times nine equals?', ans: '18', speak_q: 'Two times nine equals?' },
    { q: 'Twenty divided by four equals?', ans: '5', speak_q: 'Twenty divided by four equals?' },
    { q: 'Six squared equals?', ans: '36', speak_q: 'Six squared equals?' },
    { q: 'Half of fifty equals?', ans: '25', speak_q: 'Half of fifty equals?' },
  ];
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const { listening, transcript, startListening, stopListening, supported } = useSpeechInput();
  const p = problems[idx];

  // ── AUTO VOICE: speak problem automatically when idx changes ──
  useEffect(() => {
    if (!p) return;
    const t = setTimeout(() => speak(p.speak_q), 300);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

  if (idx >= problems.length) return <WinScreen score={score} total={problems.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const check = (val) => {
    const a = (val || input).trim();
    if (!a) return;
    const correct = a === p.ans;
    if (correct) setScore(s => s + 1);
    setResult(correct ? 'correct' : 'wrong');
    speak(correct ? 'Correct! The answer is ' + p.ans : 'Not quite. The answer is ' + p.ans);
    setTimeout(() => { setInput(''); setResult(null); setIdx(i => i + 1); }, 1800);
  };

  const handleMic = () => {
    setInput('');
    startListening((spoken) => {
      const n = spoken.match(/\d+/);
      const a = n ? n[0] : spoken.trim().split(' ')[0];
      setInput(a);
      setTimeout(() => check(a), 300);
    });
  };

  return (
    <div>
      <ScoreHeader score={score} total={problems.length} color={color} label={`Problem ${idx + 1}/${problems.length}`} />
      <div className="text-center mb-6 bg-teal-50 border-2 border-teal-200 rounded-3xl p-8">
        <div className="text-2xl font-black text-gray-800 mb-3">{p.q}</div>
        <button onClick={() => speak(p.speak_q)} className="text-xs font-bold text-teal-600 border border-teal-300 px-3 py-1 rounded-lg">🔊 Replay</button>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border mb-4">
        <MicButton listening={listening} onStart={handleMic} onStop={stopListening} supported={supported} color={color} size="sm" />
        <p className="text-xs text-gray-500 font-semibold">{listening ? '🔴 Listening…' : 'Speak your answer'}</p>
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !result && check()} placeholder="Type or speak the answer…" className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-2xl font-black text-center focus:outline-none mb-4" style={{ borderColor: input ? color : undefined }} disabled={!!result} />
      {result && <div className={`text-center p-3 rounded-2xl font-black mb-3 ${result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{result === 'correct' ? '✅ Correct!' : `❌ Answer: ${p.ans}`}</div>}
      {!result && <button onClick={() => check()} disabled={!input.trim()} className="w-full py-3 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: color }}>Submit ✅</button>}
    </div>
  );
}

/* ══════════ GAME: STORY SEQUENCE ══════════ */
function StorySequence({ color }) {
  const stories = [
    { title: 'Making Tea', steps: ['Boil water in a kettle', 'Put a tea bag in a cup', 'Pour hot water into the cup', 'Wait 3 minutes', 'Remove the tea bag and enjoy!'] },
    { title: 'Planting a Seed', steps: ['Dig a small hole in the soil', 'Place the seed inside', 'Cover the seed with soil', 'Water the seed gently', 'Wait for it to grow into a plant!'] },
  ];
  const [sIdx, setSIdx] = useState(0);
  const [order, setOrder] = useState(() => [...Array(stories[0].steps.length).keys()].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const story = stories[sIdx];
  if (sIdx >= stories.length) return <WinScreen score={score} total={stories.length} onReplay={() => { setSIdx(0); setScore(0); setOrder([...Array(stories[0].steps.length).keys()].sort(() => Math.random() - 0.5)); setChecked(false); }} />;
  const move = (from, to) => { const o = [...order]; [o[from], o[to]] = [o[to], o[from]]; setOrder(o); };
  const check = () => {
    const correct = order.every((v, i) => v === i);
    if (correct) setScore(s => s + 1);
    setChecked(true);
    setTimeout(() => { setChecked(false); if (sIdx + 1 < stories.length) { setSIdx(s => s + 1); setOrder([...Array(stories[sIdx + 1].steps.length).keys()].sort(() => Math.random() - 0.5)); } else setSIdx(stories.length); }, 2000);
  };
  return (
    <div>
      <ScoreHeader score={score} total={stories.length} color={color} label={story.title} />
      <p className="text-gray-500 font-semibold mb-4 text-center">Put the steps in the correct order 📖</p>
      <div className="space-y-2 mb-5">
        {order.map((stepIdx, pos) => (
          <div key={stepIdx} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${checked ? stepIdx === pos ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ background: color }}>{pos + 1}</span>
            <span className="flex-1 text-sm font-semibold text-gray-700">{story.steps[stepIdx]}</span>
            <div className="flex flex-col gap-1">
              {pos > 0 && <button onClick={() => move(pos, pos - 1)} className="text-gray-400 hover:text-gray-700 font-black text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200">▲</button>}
              {pos < order.length - 1 && <button onClick={() => move(pos, pos + 1)} className="text-gray-400 hover:text-gray-700 font-black text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200">▼</button>}
            </div>
          </div>
        ))}
      </div>
      <button onClick={check} className="w-full py-3 rounded-2xl font-black text-white" style={{ background: color }}>Check Order ✅</button>
    </div>
  );
}

/* ══════════ GAME: SOUND SPELLING ══════════ */
function SoundSpelling({ color }) {
  const words = [
    { word: 'elephant', hint: 'A large grey animal with a trunk' },
    { word: 'butterfly', hint: 'A colourful flying insect' },
    { word: 'rainbow', hint: 'Appears after rain in the sky' },
    { word: 'sunshine', hint: 'Light from the sun' },
    { word: 'computer', hint: 'An electronic device' },
    { word: 'chocolate', hint: 'A sweet brown treat' },
  ];
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const { listening, transcript, startListening, stopListening, supported } = useSpeechInput();
  const item = words[idx];

  // ── AUTO VOICE: speak word automatically when idx changes ──
  useEffect(() => {
    if (!item) return;
    setInput('');
    setResult(null);
    const t = setTimeout(() => speak(item.word), 300);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

  if (idx >= words.length) return <WinScreen score={score} total={words.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const check = () => {
    const correct = input.toLowerCase().trim() === item.word;
    if (correct) setScore(s => s + 1);
    setResult(correct ? 'correct' : 'wrong');
    setTimeout(() => { setResult(null); setInput(''); setIdx(i => i + 1); }, 1800);
  };

  return (
    <div>
      <ScoreHeader score={score} total={words.length} color={color} label={`Word ${idx + 1}/${words.length}`} />
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🎧</div>
        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 mb-3">
          <p className="text-sm text-gray-500 font-semibold mb-2">💡 {item.hint}</p>
          <p className="text-gray-400 text-xs">Listen carefully and type the word you hear</p>
        </div>
        <button onClick={() => speak(item.word)} className="px-6 py-3 rounded-2xl font-black text-white shadow-lg mb-2" style={{ background: color }}>🔊 Play Word</button>
        <button onClick={() => speak(item.word.split('').join(' '))} className="ml-2 px-4 py-3 rounded-2xl font-bold border-2 text-sm" style={{ borderColor: color, color }}>Spell it out</button>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border mb-4">
        <MicButton listening={listening} onStart={() => { setInput(''); startListening((s) => setInput(s)); }} onStop={stopListening} supported={supported} color={color} size="sm" />
        <p className="text-xs text-gray-500 font-semibold">{listening ? '🔴 Spell it out loud…' : 'Or speak the word'}</p>
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !result && check()} placeholder="Type the word here…" className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl font-black text-center focus:outline-none mb-4" style={{ borderColor: input ? color : undefined }} />
      {result && <div className={`text-center p-3 rounded-2xl font-black mb-3 ${result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{result === 'correct' ? '✅ Correct!' : `❌ It was: ${item.word}`}</div>}
      {!result && <button onClick={check} disabled={!input.trim()} className="w-full py-3 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: color }}>Check ✅</button>}
    </div>
  );
}

/* ══════════ GAME: RIDDLE ME ══════════ */
function RiddleMe({ color }) {
  const riddles = [
    { riddle: "I have hands but cannot clap. What am I?", answer: "clock", options: ["clock", "glove", "puppet", "robot"] },
    { riddle: "The more you take, the more you leave behind. What am I?", answer: "footsteps", options: ["footsteps", "sand", "breath", "time"] },
    { riddle: "I speak without a mouth and hear without ears. What am I?", answer: "echo", options: ["radio", "echo", "shadow", "mirror"] },
    { riddle: "What has to be broken before you can use it?", answer: "egg", options: ["egg", "lock", "code", "seal"] },
    { riddle: "I'm tall when I'm young, and short when I'm old. What am I?", answer: "candle", options: ["tree", "candle", "person", "pencil"] },
    { riddle: "What can run but never walks, has a mouth but never talks?", answer: "river", options: ["river", "car", "dog", "clock"] },
  ];
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [micFb, setMicFb] = useState('');
  const { listening, transcript, startListening, stopListening, supported } = useSpeechInput();
  const r = riddles[idx];

  // ── AUTO VOICE: speak riddle automatically when idx changes ──
  useEffect(() => {
    if (!r) return;
    setMicFb('');
    const t = setTimeout(() => speak(r.riddle), 300);
    return () => clearTimeout(t);
  }, [idx]);

  if (idx >= riddles.length) return <WinScreen score={score} total={riddles.length} onReplay={() => { setIdx(0); setScore(0); }} />;

  const select = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt === r.answer) setScore(s => s + 1);
    speak(opt === r.answer ? 'Correct! Well done!' : 'Not quite. The answer is ' + r.answer);
    setTimeout(() => { setChosen(null); setMicFb(''); setIdx(i => i + 1); }, 1500);
  };

  const handleMic = () => {
    startListening((spoken) => {
      const matched = r.options.find(o => spoken.toLowerCase().includes(o.toLowerCase()));
      if (matched) { setMicFb(`🎙️ "${spoken}"`); select(matched); }
      else setMicFb(`🎙️ "${spoken}" — try again!`);
    });
  };

  return (
    <div>
      <ScoreHeader score={score} total={riddles.length} color={color} label={`Riddle ${idx + 1}/${riddles.length}`} />
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-6 mb-5 text-center">
        <div className="text-4xl mb-3">🤔</div>
        <p className="text-lg font-black text-gray-800 italic leading-relaxed">"{r.riddle}"</p>
        <button onClick={() => speak(r.riddle)} className="mt-3 text-xs font-bold text-teal-600 border border-teal-300 px-3 py-1 rounded-lg">🔊 Replay</button>
      </div>
      {!chosen && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border mb-4">
          <MicButton listening={listening} onStart={handleMic} onStop={stopListening} supported={supported} color={color} size="sm" />
          <div>
            {listening ? <p className="text-xs text-red-500 font-bold animate-pulse">🔴 Say your answer…</p> : <p className="text-xs text-gray-500 font-semibold">Speak the answer</p>}
            {micFb && <p className="text-xs font-semibold mt-1" style={{ color }}>{micFb}</p>}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {r.options.map(opt => (
          <button key={`${idx}-${opt}`} onClick={() => select(opt)}
            className={`py-4 rounded-2xl font-black text-lg capitalize border-2 transition-all ${chosen === null ? 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-0.5' : opt === r.answer ? 'bg-green-100 border-green-500 text-green-700' : opt === chosen ? 'bg-red-100 border-red-400 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════ GAME RUNNER ══════════ */
function GameRunner({ gameId, color }) {
  switch (gameId) {
    case 'flip_match':       return <FlipMatch color={color} />;
    case 'sentence_builder': return <SentenceBuilder color={color} />;
    case 'word_scramble':    return <WordScramble color={color} />;
    case 'fill_blank':       return <FillBlank color={color} />;
    case 'rhyme_time':       return <RhymeTime color={color} />;
    case 'word_chain':       return <WordChain color={color} />;
    case 'focus_challenge':  return <FocusChallenge color={color} />;
    case 'memory_sprint':    return <MemorySprint color={color} />;
    case 'rapid_sort':       return <RapidSort color={color} />;
    case 'number_pop':       return <NumberPop color={color} />;
    case 'color_match':      return <ColorMatch color={color} />;
    case 'odd_one_out':      return <OddOneOut color={color} />;
    case 'audio_quiz':       return <AudioQuiz color={color} />;
    case 'pattern_words':    return <PatternWords color={color} />;
    case 'word_math':        return <WordMath color={color} />;
    case 'story_sequence':   return <StorySequence color={color} />;
    case 'sound_spelling':   return <SoundSpelling color={color} />;
    case 'riddle_me':        return <RiddleMe color={color} />;
    default: return <p>Game not found</p>;
  }
}

/* ══════════ MAIN PAGE ══════════ */
export default function GamesPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const currentType = DISABILITY_TYPES.find(t => t.id === selectedType);

  /* TYPE SELECTOR */
  if (!selectedType) return (
    <div className="min-h-screen pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)' }}>
      <FloatingDeco />
      <div className="fixed left-2 bottom-0 z-10 hidden lg:block"><CartoonCat /></div>
      <div className="fixed right-4 bottom-4 z-10 hidden lg:block"><CartoonOwl /></div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">🎮 18 Interactive Learning Games</div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Games <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Hub 🕹️</span></h1>
        <p className="text-white/60 text-lg mb-12">6 games per learning profile — all built for you!</p>
        <div className="grid md:grid-cols-3 gap-6">
          {DISABILITY_TYPES.map(t => (
            <button key={t.id} onClick={() => setSelectedType(t.id)}
              className="group bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-3 hover:bg-white/20 overflow-hidden relative"
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 24px 48px ${t.color}55`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
              <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`}/>
              <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">{t.emoji}</div>
              <div className="font-black text-xl text-white mb-2">{t.label}</div>
              <div className="text-white/50 text-sm mb-5">6 games available</div>
              <div className="flex justify-center gap-2 mb-5">
                {GAMES_META[t.id].map(g => <div key={g.id} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-base">{g.emoji}</div>)}
              </div>
              <div className={`py-2 px-4 rounded-xl text-white text-sm font-black bg-gradient-to-r ${t.gradient} opacity-80 group-hover:opacity-100`}>Play Now →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* GAME PICKER */
  if (!selectedGame) return (
    <div className="min-h-screen pt-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${currentType.color}22, ${currentType.softBg}, white)` }}>
      <FloatingDeco />
      <div className="fixed left-2 bottom-0 z-10 hidden lg:block"><CartoonCat /></div>
      <div className="fixed right-4 bottom-0 z-10 hidden lg:block"><CartoonOwl /></div>
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-6">
        <button onClick={() => setSelectedType(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-8 bg-white/80 px-4 py-2 rounded-xl backdrop-blur">
          <ArrowLeft size={18}/> Back
        </button>
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-white text-xl font-black bg-gradient-to-r ${currentType.gradient} shadow-xl mb-4`}>
            <span className="text-3xl">{currentType.emoji}</span> {currentType.label} — 6 Games
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES_META[selectedType].map(g => (
            <button key={g.id} onClick={() => setSelectedGame(g.id)}
              className="group bg-white rounded-3xl p-6 text-left shadow-lg border-2 border-gray-100 transition-all duration-300 hover:-translate-y-2 overflow-hidden relative"
              onMouseEnter={e => { e.currentTarget.style.borderColor = currentType.color; e.currentTarget.style.boxShadow = `0 20px 40px ${currentType.color}33`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.boxShadow = ''; }}>
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentType.gradient}`}/>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{g.emoji}</div>
              <h3 className="font-black text-lg text-gray-800 mb-1">{g.title}</h3>
              <p className="text-gray-500 text-xs mb-3">{g.desc}</p>
              {g.mic && <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border" style={{ color: currentType.color, borderColor: currentType.color, background: currentType.color + '10' }}>🎙️ Voice</div>}
              <div className="mt-3 font-black text-sm flex items-center gap-1" style={{ color: currentType.color }}>Play →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ACTIVE GAME */
  const gameMeta = GAMES_META[selectedType].find(g => g.id === selectedGame);
  return (
    <div className="min-h-screen pt-16 px-4 relative" style={{ background: currentType.softBg }}>
      <div className="fixed top-24 left-4 text-3xl opacity-20 animate-float hidden lg:block" style={{ animationDuration: '4s' }}>🎮</div>
      <div className="fixed bottom-20 right-6 text-3xl opacity-20 animate-float hidden lg:block" style={{ animationDuration: '5s' }}>⭐</div>
      <div className="max-w-2xl mx-auto py-10 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setSelectedGame(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold bg-white px-4 py-2 rounded-xl shadow-sm"><ArrowLeft size={18}/> Back</button>
          <div className="flex gap-2">
            {GAMES_META[selectedType].map(g => (
              <button key={g.id} onClick={() => setSelectedGame(g.id)} title={g.title}
                className={`w-9 h-9 rounded-xl text-lg transition-all ${g.id === selectedGame ? 'shadow-lg scale-110' : 'opacity-40 hover:opacity-80 bg-white'}`}
                style={g.id === selectedGame ? { background: `linear-gradient(135deg, ${currentType.color}, ${currentType.color}bb)` } : {}}>
                {g.emoji}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className={`bg-gradient-to-r ${currentType.gradient} p-5 text-white flex items-center gap-3`}>
            <span className="text-3xl">{gameMeta.emoji}</span>
            <div>
              <h2 className="font-black text-xl">{gameMeta.title}</h2>
              <p className="text-white/70 text-xs">{gameMeta.desc}</p>
            </div>
          </div>
          <div className="p-6"><GameRunner gameId={selectedGame} color={currentType.color} /></div>
        </div>
      </div>
    </div>
  );
}
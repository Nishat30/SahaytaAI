import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useSpeechInput — wraps the Web Speech API SpeechRecognition.
 *
 * Returns:
 *   listening      — bool, true while mic is active
 *   transcript     — current interim+final text
 *   startListening — fn(onResult) — starts recognition; calls onResult(text) on final result
 *   stopListening  — fn() — stops recognition
 *   supported      — bool, false if browser doesn't support it
 *   error          — string | null
 */
export function useSpeechInput() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(null);

  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => { setListening(true); setError(null); setTranscript(''); };
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed') setError('Microphone permission denied. Please allow mic access.');
      else if (e.error === 'no-speech') setError('No speech detected. Try again.');
      else setError(`Speech error: ${e.error}`);
    };
    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      if (final && onResultRef.current) {
        onResultRef.current(final.trim());
        onResultRef.current = null;
      }
    };

    recognitionRef.current = rec;
    return () => { try { rec.abort(); } catch {} };
  }, [supported]);

  const startListening = useCallback((onResult) => {
    if (!supported || !recognitionRef.current) return;
    onResultRef.current = onResult || null;
    setTranscript('');
    setError(null);
    try { recognitionRef.current.start(); } catch {}
  }, [supported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch {}
  }, []);

  return { listening, transcript, startListening, stopListening, supported, error };
}

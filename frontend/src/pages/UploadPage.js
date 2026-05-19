import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import API_BASE from '../config';

const DISABILITY_TYPES = [
  { id: 'dyslexia', label: 'Dyslexia', emoji: '📖', color: '#4F86C6', bg: 'bg-blue-50', border: 'border-blue-300' },
  { id: 'adhd', label: 'ADHD', emoji: '⚡', color: '#F4A261', bg: 'bg-orange-50', border: 'border-orange-300' },
  { id: 'visual', label: 'Visual Impairment', emoji: '🎧', color: '#2A9D8F', bg: 'bg-teal-50', border: 'border-teal-300' },
];

export default function UploadPage() {
  const [selectedType, setSelectedType] = useState('dyslexia');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const currentType = DISABILITY_TYPES.find(t => t.id === selectedType);

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setResult(null); setError(''); }
    else setError('Please upload a PDF file.');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/upload-pdf?disability_type=${selectedType}`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.detail || 'Upload failed.');
    } catch {
      setError('⚠️ Could not connect to server. Make sure the backend is running on port 8000.');
    }
    setLoading(false);
  };

  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen pt-20 px-6" style={{ background: 'linear-gradient(135deg, #f0fdf4, #fef9c3)' }}>
      <div className="max-w-3xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">📄</div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Upload PDF</h1>
          <p className="text-gray-500 text-lg">Upload any educational PDF and I'll summarize it in your preferred learning style.</p>
        </div>

        {/* Mode selector */}
        <div className="mb-8">
          <h2 className="font-black text-gray-700 mb-3 text-lg">1. Choose your learning mode:</h2>
          <div className="grid grid-cols-3 gap-4">
            {DISABILITY_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`${t.bg} border-2 rounded-2xl p-4 text-center transition-all font-black ${
                  selectedType === t.id ? `${t.border} shadow-md scale-105` : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="text-3xl mb-1">{t.emoji}</div>
                <div className="text-sm text-gray-700">{t.label}</div>
                {selectedType === t.id && <CheckCircle className="inline mt-1" size={14} style={{ color: t.color }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone */}
        <div className="mb-8">
          <h2 className="font-black text-gray-700 mb-3 text-lg">2. Upload your PDF:</h2>
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            className={`border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
              dragging
                ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                : file
                ? `${currentType.bg} ${currentType.border}`
                : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-indigo-50'
            }`}
            style={{ borderWidth: 2 }}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div>
                <FileText className="mx-auto mb-3" size={48} style={{ color: currentType.color }} />
                <p className="font-black text-gray-800 text-lg">{file.name}</p>
                <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="font-black text-gray-700 text-lg">Drop your PDF here</p>
                <p className="text-gray-400 text-sm mt-1">or click to browse · PDF only · Max 5 pages processed</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={upload}
          disabled={!file || loading}
          className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          style={{ background: currentType.color }}
        >
          {loading ? (
            <><Loader className="animate-spin" size={20} /> Analyzing PDF…</>
          ) : (
            <>📊 Summarize for {currentType.label}</>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`mt-8 ${currentType.bg} border-2 ${currentType.border} rounded-3xl p-8 animate-slide-up`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle style={{ color: currentType.color }} size={24} />
                <h3 className="font-black text-xl text-gray-800">AI Summary — {currentType.label} Mode</h3>
              </div>
              <button
                onClick={() => speak(result.summary)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all hover:shadow-md"
                style={{ borderColor: currentType.color, color: currentType.color, background: currentType.color + '11' }}
              >
                🔊 Read Aloud
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
              <pre className="whitespace-pre-wrap text-gray-800 font-semibold text-sm leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {result.summary}
              </pre>
            </div>
            <p className="text-sm font-semibold" style={{ color: currentType.color }}>
              📃 Processed {result.pages_processed} page{result.pages_processed !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

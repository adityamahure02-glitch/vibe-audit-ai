'use client';

import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Globe,
  AlertCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Mail,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Audit failed');

      setData(json);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyPitch = () => {
    const pitch = data?.audit?.coldPitchEmail || {
      subject: 'Quick CRO observation for your hero section',
      body: 'Hey team, noticed a quick win to boost visitor clarity and conversion on your landing page hero section.',
    };
    const textToCopy = `Subject: ${pitch.subject}\n\n${pitch.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const heroRewrite = data?.audit?.heroRewrite || {
    original: 'Financial infrastructure to grow your revenue',
    optimizedHeadline: 'The Fastest Engine to Scale Global Payments & Revenue',
    optimizedSubheadline: 'Accept cards, manage multi-currency payouts, and automate financial reconciliation with zero latency.',
    suggestedCTA: 'Start Integration Free — 5 Min Setup',
  };

  const coldPitch = data?.audit?.coldPitchEmail || {
    subject: 'Quick CRO observation on your hero section',
    body: 'Hey team, was exploring your homepage and noticed a quick opportunity to lift conversion rates. The current hero headline is slightly abstract, which might leak first-time visitors before they grasp your core value proposition. I generated an optimized headline rewrite and full audit breakdown. Happy to share if helpful!',
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 pt-16 pb-36 selection:bg-indigo-500 selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          AI Website & Vibe Auditor
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Audit Your Landing Page <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              In 5 Seconds.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Extract live DOM data, diagnose conversion bottlenecks, and generate actionable copy rewrites instantly.
          </p>
        </div>

        <form onSubmit={handleAudit} className="w-full max-w-xl flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="e.g. stripe.com or linear.app"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                Audit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="w-full max-w-xl p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Audit Dashboard */}
        {data && data.audit && (
          <div className="w-full max-w-3xl space-y-6 animate-in fade-in text-left">
            {/* Top Score Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
                  Overall Vibe & CRO Score
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {data.audit.vibeTagline}
                </h3>
                <p className="text-sm text-slate-400 mt-2 max-w-lg leading-relaxed">
                  {data.audit.firstImpression}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex-shrink-0 ml-4">
                <span className="text-3xl font-black text-indigo-400">
                  {data.audit.vibeScore}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-medium">/100</span>
              </div>
            </div>

            {/* Feature 1: Hero Copy Rewrite (Before vs After) */}
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Zap className="w-4 h-4 text-indigo-400" />
                AI Conversion Rewrite (Hero Section)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">
                    Current Headline (Scraped)
                  </span>
                  <p className="text-sm text-slate-300 font-medium">
                    "{heroRewrite.original}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/40 space-y-2">
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-indigo-400">
                    High-Converting Rewrite
                  </span>
                  <p className="text-sm text-white font-semibold">
                    "{heroRewrite.optimizedHeadline}"
                  </p>
                  <p className="text-xs text-slate-400">
                    {heroRewrite.optimizedSubheadline}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs font-semibold">
                      CTA: {heroRewrite.suggestedCTA}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Killers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" /> Strong Elements
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  {data.audit.strengths?.map((s: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4" /> Conversion Killers
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  {data.audit.conversionKillers?.map((k: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{k}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Fixes */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wide">
                <Lightbulb className="w-4 h-4" /> Actionable Fixes
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                {data.audit.actionableFixes?.map((fix: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="text-indigo-400 font-bold">{idx + 1}.</span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 2: 1-Click Founder Cold Pitch */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wide">
                  <Mail className="w-4 h-4" /> 1-Click Founder Cold Outreach Pitch
                </div>
                <button
                  onClick={copyPitch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Pitch
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300 font-mono leading-relaxed">
                <p className="text-indigo-400 font-semibold">
                  Subject: {coldPitch.subject}
                </p>
                <p className="whitespace-pre-line text-slate-400">
                  {coldPitch.body}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
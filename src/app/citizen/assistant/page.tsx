'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  ExternalLink,
  Satellite,
  HelpCircle,
  Loader2,
  RefreshCw,
  Compass,
  FileText,
  Languages,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: { source: string; type: string }[];
  isAiGenerated?: boolean;
  modelUsed?: string;
}

export default function AiAssistantPage() {
  const { selectedCity, language, setLanguage } = useClimate();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Hello! I am your **ClimateAI Maharashtra Demonstration Assistant** for **${selectedCity.name}**.\n\nI answer citizen inquiries regarding statutory climate pledges, Copernicus Sentinel-2 satellite audits, and public transit targets strictly grounded in verified registry records. Every response includes verifiable source citations.\n\n*Scientific Note:* Environmental indicators reflect observed spectral greenness (NDVI) and sensor telemetry rather than direct tree trunk counts, and missing data is classified as Inconclusive.\n\nWhat would you like to investigate today?`,
      timestamp: '10:00 AM',
      citations: [
        { source: selectedCity.climateActionPlanName, type: 'Statutory Policy Plan' },
        { source: 'Copernicus Sentinel-2 Level-2A', type: 'Satellite Remote Sensing' },
        { source: 'Deterministic Audit Matrix v2.4', type: 'Mathematical Engine' },
      ],
    },
    {
      id: 'msg-sample-q',
      sender: 'user',
      content: 'Why was Ward K-East green cover marked as a discrepancy?',
      timestamp: '10:02 AM',
    },
    {
      id: 'msg-sample-a',
      sender: 'assistant',
      content: `**Ward K-East (Andheri East) Green Canopy Discrepancy [Audit com-mum-exp-05]:**\n\n- **Official City Claim [MCAP Page 74]:** Municipal reports claimed 50% progress achieved via planting 45,000 tree saplings in industrial buffer zones.\n- **Independent Earth Observation:** Copernicus **Sentinel-2 Level-2A NDVI [Obs 2024-10-10]** and IIT Bombay drone surveys verified only **13.5% actual canopy progress**.\n- **The Discrepancy:** A reporting overstatement of **+36.5 percentage points** was detected. Illustrative demonstration records indicate significant sapling loss occurred due to post-monsoon irrigation neglect and MIDC soil contamination.\n- **Action Taken:** Flagged as **POTENTIAL DISCREPANCY** under the Scientific Integrity Matrix, triggering automated contractor payment holds.`,
      timestamp: '10:02 AM',
      citations: [
        { source: 'Copernicus Sentinel-2 Level-2A NDVI Index', type: 'Satellite Observation' },
        { source: 'IIT Bombay & NEERI Field Drone Photogrammetry', type: 'Independent Ground Survey' },
        { source: 'BMC K-East Ward Plantation Log', type: 'Municipal Operational Record' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const samplePrompts = [
    'Why was Ward K-East green cover marked as a discrepancy?',
    'What is the verified progress on electrifying 400 buses?',
    'How is the 30% transport emissions target pacing?',
    'Explain Sentinel-2 NDVI in plain language.',
    `What climate commitments has ${selectedCity.name} made?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          cityId: selectedCity.id,
          language: language,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'I could not retrieve an answer at this time.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        isAiGenerated: data.isAiGenerated,
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error fetching assistant response:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          content: 'An error occurred while connecting to the climate intelligence knowledge engine.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/80">
              Retrieval-Grounded AI Assistant
            </span>
            <span className="text-xs text-charcoal-400 font-mono">
              Grounded in {selectedCity.name} Audit Records &bull; Citations Required
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Ask ClimateAI &bull; {selectedCity.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-charcoal-500 font-mono self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Evidence-Grounded Guardrails & Citation Protocol</span>
        </div>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl bg-surface border border-charcoal-200 shadow-subtle">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-forest-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-subtle mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-forest-900 text-white rounded-tr-none'
                  : 'bg-background border border-charcoal-200 text-charcoal-900 rounded-tl-none shadow-subtle'
              }`}
            >
              <div className="whitespace-pre-line font-sans">{msg.content}</div>

              {/* Source Citations Chips */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-charcoal-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block font-mono">
                    Grounded Source Citations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((cite, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-charcoal-100 text-charcoal-700 border border-charcoal-200 font-mono"
                        title={cite.type}
                      >
                        <FileText className="w-3 h-3 text-emerald-700" />
                        <span>{cite.source}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                {msg.sender === 'assistant' && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-charcoal-100 text-charcoal-600 border border-charcoal-200">
                    {msg.isAiGenerated ? 'Gemini Flash • Retrieval Grounded' : 'Demonstration Knowledge Base (Offline)'}
                  </span>
                )}
                <div
                  className={`text-[10px] font-mono ${
                    msg.sender === 'user' ? 'text-forest-300 ml-auto' : 'text-charcoal-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-charcoal-200 text-charcoal-800 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-charcoal-500 font-mono py-2">
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Retrieving ground truth evidence & synthesising cited explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] font-bold text-charcoal-500 shrink-0 font-mono">
          Try asking:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 text-[11px] rounded-lg border border-charcoal-200 bg-surface hover:bg-charcoal-50 text-charcoal-700 font-medium whitespace-nowrap shadow-subtle transition-all shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask about ${selectedCity.name}'s climate commitments, satellite audits, or targets...`}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-charcoal-300 bg-surface text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-800/20 shadow-subtle"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-forest-900 hover:bg-forest-800 text-white shadow-subtle flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </form>

    </div>
  );
}

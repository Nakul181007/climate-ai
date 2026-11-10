'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  Map,
  Satellite,
  MessageSquare,
  Sparkles,
  Trees,
  Bus,
  Sun,
  ShieldCheck,
  Search,
  ExternalLink,
  Scale,
  FileSearch,
} from 'lucide-react';
import { useClimate } from '@/lib/context/ClimateContext';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function CitizenDashboardPage() {
  const { selectedCity, cityCommitments, stats, language } = useClimate();

  const translations = {
    en: {
      tag: 'Public Climate Transparency Portal',
      title: 'See What Your City Promised — And What Satellites See.',
      subtitle:
        'We connect official climate action commitments with independent Earth observation satellites and real-world sensors, translating complex scientific evidence into plain language for every citizen.',
      exploreCta: 'Explore Tracked Promises',
      askCta: 'Ask ClimateAI Assistant',
      tracked: 'Promises Tracked',
      onTrack: 'On Track & Verified',
      atRisk: 'At Risk / Delayed',
      discrepancy: 'Major Discrepancy',
      fiveQuestionsTitle: 'The Five Citizen Accountability Questions',
      fiveQuestionsDesc: 'How ClimateAI turns technical satellite and policy data into transparent public accountability.',
      q1: 'What did the city promise?',
      q1Desc: 'Extracted directly from official municipal climate plans (MCAP) into clear, measurable targets.',
      q2: 'What evidence is available?',
      q2Desc: 'Independent Copernicus Sentinel-2 satellites and ground air quality sensors.',
      q3: 'What has actually been measured?',
      q3Desc: 'Verified empirical progress calculated deterministically without AI exaggeration.',
      q4: 'What remains uncertain?',
      q4Desc: 'Missing sensor feeds or data gaps are clearly labeled as Inconclusive, never concealed.',
      q5: 'What should happen next?',
      q5Desc: 'Ranked, high-ROI engineering recommendations to close implementation gaps.',
    },
    hi: {
      tag: 'सार्वजनिक जलवायु पारदर्शिता पोर्टल',
      title: 'देखें शहर ने क्या वादा किया — और उपग्रह क्या देखते हैं।',
      subtitle:
        'हम सरकारी जलवायु कार्य योजनाओं को स्वतंत्र उपग्रहों और वास्तविक सेंसर डेटा से जोड़ते हैं, जिससे हर नागरिक के लिए पारदर्शी और सटीक जानकारी सुलभ हो सके।',
      exploreCta: 'सभी वादे देखें',
      askCta: 'क्लाइमेटएआई से पूछें',
      tracked: 'ट्रैक किए गए वादे',
      onTrack: 'सही रास्ते पर (सत्यापित)',
      atRisk: 'जोखिम में / विलंबित',
      discrepancy: 'गंभीर विसंगति',
      fiveQuestionsTitle: 'नागरिक जवाबदेही के ५ मुख्य प्रश्न',
      fiveQuestionsDesc: 'क्लाइमेटएआई कैसे तकनीकी उपग्रह डेटा को सरल और पारदर्शी सार्वजनिक जवाबदेही में बदलता है।',
      q1: 'शहर ने क्या वादा किया था?',
      q1Desc: 'आधिकारिक जलवायु योजनाओं (MCAP) से सीधे निकाले गए मापने योग्य लक्ष्य।',
      q2: 'क्या साक्ष्य उपलब्ध हैं?',
      q2Desc: 'स्वतंत्र कॉपरनिकस सेंटिनल-२ उपग्रह और सीपीसीबी वायु गुणवत्ता सेंसर।',
      q3: 'वास्तव में क्या मापा गया है?',
      q3Desc: 'बिना किसी अतिशयोक्ति के निष्पक्ष रूप से गणना की गई प्रत्यक्ष प्रगति।',
      q4: 'क्या अनिश्चित बना हुआ है?',
      q4Desc: 'डेटा की कमी को छिपाने के बजाय स्पष्ट रूप से "अनिर्णायक" चिह्नित किया जाता है।',
      q5: 'आगे क्या कदम उठाए जाने चाहिए?',
      q5Desc: 'कमियों को दूर करने के लिए प्राथमिकताप्राप्त व्यावहारिक सिफारिशें।',
    },
    mr: {
      tag: 'सार्वजनिक हवामान पारदर्शकता पोर्टल',
      title: 'शहराने काय वचन दिले — आणि उपग्रह काय पाहतात ते जाणून घ्या.',
      subtitle:
        'आम्ही अधिकृत हवामान कृती योजनांची स्वतंत्र उपग्रह आणि जमिनीवरील सेन्सर्सद्वारे पडताळणी करतो, जेणेकरून प्रत्येक नागरिकाला सत्य माहिती समजू शकेल.',
      exploreCta: 'सर्व आश्वासने पहा',
      askCta: 'क्लाइमेटएआय ला विचारा',
      tracked: 'नोंदवलेली आश्वासने',
      onTrack: 'योग्य मार्गावर (पडताळणी पूर्ण)',
      atRisk: 'धोक्यात / मंद गती',
      discrepancy: 'मोठी तफावत',
      fiveQuestionsTitle: 'नागरिक उत्तरदायित्वाचे ५ महत्त्वाचे प्रश्न',
      fiveQuestionsDesc: 'क्लाइमेटएआई कशा प्रकारे क्लिष्ट वैज्ञानिक डेटाचे रूपांतर सोप्या सार्वजनिक उत्तरदायित्वात करते.',
      q1: 'शहराने नेमके काय आश्वासन दिले होते?',
      q1Desc: 'अधिकृत महापालिका योजनांमधून (MCAP) घेतलेली मोजण्याजोगी उद्दिष्टे.',
      q2: 'कोणते पुरावे उपलब्ध आहेत?',
      q2Desc: 'स्वतंत्र सेंटिनेल-२ उपग्रह आणि जमिनीवरील प्रदूषण मापक सेन्सर्स.',
      q3: 'प्रत्यक्षात काय मोजले गेले आहे?',
      q3Desc: 'कोणत्याही अनुमानाशिवाय काटेकोरपणे मोजलेली प्रत्यक्ष प्रगती.',
      q4: 'कोणत्या बाबी अनिश्चित आहेत?',
      q4Desc: 'डेटा अपुरा असल्यास तो न लपवता थेट "अनिर्णित" म्हणून दाखवला जातो.',
      q5: 'पुढे काय करणे आवश्यक आहे?',
      q5Desc: 'तूट भरून काढण्यासाठी उच्च-प्रभावी शिफारसी आणि उपाययोजना.',
    },
  };

  const t = translations[language] || translations.en;

  const fiveQuestions = [
    {
      step: '01',
      question: t.q1,
      description: t.q1Desc,
      icon: FileSearch,
    },
    {
      step: '02',
      question: t.q2,
      description: t.q2Desc,
      icon: Satellite,
    },
    {
      step: '03',
      question: t.q3,
      description: t.q3Desc,
      icon: Scale,
    },
    {
      step: '04',
      question: t.q4,
      description: t.q4Desc,
      icon: AlertTriangle,
    },
    {
      step: '05',
      question: t.q5,
      description: t.q5Desc,
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Citizen Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-forest-900 via-forest-950 to-charcoal-900 text-white shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Compass className="w-3.5 h-3.5" />
            <span>{t.tag} &bull; {selectedCity.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-forest-200 leading-relaxed max-w-2xl">
            {t.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/citizen/tracker"
              className="px-4 py-2.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-forest-950 shadow-subtle flex items-center gap-1.5 transition-colors"
            >
              <span>{t.exploreCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/citizen/assistant"
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-forest-800/80 hover:bg-forest-800 text-white border border-forest-700 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.askCta}</span>
            </Link>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Citizen Summary Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="card-enterprise p-4">
          <span className="text-xs text-charcoal-500 font-medium">{t.tracked}</span>
          <div className="text-2xl font-extrabold text-forest-950 font-mono mt-1">
            {stats.totalCommitments}
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">
            From {selectedCity.climateActionPlanName.split(' ')[0]}
          </p>
        </div>

        <div className="card-enterprise p-4 border-emerald-200 bg-emerald-50/20">
          <span className="text-xs text-emerald-800 font-medium">{t.onTrack}</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
            {stats.onTrack}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">
            Verified within 5% tolerance
          </p>
        </div>

        <div className="card-enterprise p-4 border-amber-200 bg-amber-50/20">
          <span className="text-xs text-amber-800 font-medium">{t.atRisk}</span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono mt-1">
            {stats.atRisk}
          </div>
          <p className="text-[11px] text-amber-600 mt-1">
            Real progress but behind pace
          </p>
        </div>

        <div className="card-enterprise p-4 border-rose-200 bg-rose-50/20">
          <span className="text-xs text-rose-800 font-medium">{t.discrepancy}</span>
          <div className="text-2xl font-extrabold text-rose-700 font-mono mt-1">
            {stats.potentialDiscrepancy}
          </div>
          <p className="text-[11px] text-rose-600 mt-1">
            Satellite data conflicts claim
          </p>
        </div>

      </div>

      {/* The 5 Citizen Questions Framework */}
      <div className="card-enterprise p-6 bg-surface">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-forest-950">
            {t.fiveQuestionsTitle}
          </h2>
          <p className="text-xs text-charcoal-600 mt-0.5">
            {t.fiveQuestionsDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {fiveQuestions.map((q) => {
            const Icon = q.icon;
            return (
              <div
                key={q.step}
                className="p-3.5 rounded-xl border border-charcoal-200 bg-background hover:bg-surface transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-charcoal-400">
                      STEP {q.step}
                    </span>
                    <Icon className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h3 className="text-xs font-bold text-forest-950 mb-1 leading-snug">
                    {q.question}
                  </h3>
                  <p className="text-[11px] text-charcoal-600 leading-relaxed">
                    {q.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Tracked Commitments for Citizens */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-forest-950">
              Key Climate Commitments Under Public Scrutiny
            </h2>
            <p className="text-xs text-charcoal-500">
              Plain-language breakdown of promises versus verified Earth observation observations
            </p>
          </div>
          <Link
            href="/citizen/tracker"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All {cityCommitments.length} Promises</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cityCommitments.slice(0, 4).map((commitment) => {
            const overstatementPct = (commitment.reportingOverstatement * 100).toFixed(1);

            return (
              <div
                key={commitment.id}
                className="card-enterprise p-5 flex flex-col justify-between hover:border-charcoal-300 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <StatusBadge status={commitment.currentAuditStatus} size="sm" />
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-700">
                      Target Year: {commitment.targetYear}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-forest-950 mb-1">
                    {commitment.title}
                  </h3>

                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {commitment.originalPolicyStatement}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-charcoal-100 text-xs font-mono text-center">
                    <div className="p-2 rounded bg-charcoal-50 border border-charcoal-200">
                      <span className="text-[10px] text-charcoal-400 block uppercase">Planned</span>
                      <span className="font-bold text-charcoal-800">
                        {(commitment.plannedProgressToDate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="p-2 rounded bg-charcoal-50 border border-charcoal-200">
                      <span className="text-[10px] text-charcoal-400 block uppercase">City Claim</span>
                      <span className="font-bold text-charcoal-800">
                        {(commitment.cityReportedProgress * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="p-2 rounded bg-forest-50 border border-forest-200">
                      <span className="text-[10px] text-forest-700 block uppercase font-bold">Verified</span>
                      <span className="font-bold text-forest-950">
                        {(commitment.verifiedProgress * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-[11px] text-charcoal-500 truncate max-w-[220px]">
                    {commitment.geographicalCoverage}
                  </span>
                  <Link
                    href={`/admin/commitments/${commitment.id}`}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-0.5"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

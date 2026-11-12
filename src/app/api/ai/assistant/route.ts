import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DEMO_COMMITMENTS, DEMO_AUDITS, DEMO_OBSERVATIONS, CITIES } from '@/lib/demo-data';
import { CityId } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, cityId, chatHistory, language } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message in request' },
        { status: 400 }
      );
    }

    const currentCityId: CityId = (cityId || 'mumbai') as CityId;
    const city = CITIES.find((c) => c.id === currentCityId) || CITIES[0];
    const userLang = language || 'en';

    // Retrieve approved commitments and audits for this city
    const commitments = DEMO_COMMITMENTS.filter((c) => c.cityId === currentCityId);
    const audits = DEMO_AUDITS.filter((a) => a.cityId === currentCityId);

    // Build grounded retrieval context
    const retrievalContext = {
      city: city.name,
      climatePlan: city.climateActionPlanName,
      baselineYear: city.baselineYear,
      commitments: commitments.map((c) => ({
        id: c.id,
        title: c.title,
        quote: c.originalPolicyStatement,
        page: c.sourcePageNumber,
        authority: c.responsibleAuthority,
        target: `${c.targetValue} ${c.targetUnit} by ${c.targetYear}`,
        plannedProgress: `${(c.plannedProgressToDate * 100).toFixed(0)}%`,
        cityClaimed: `${(c.cityReportedProgress * 100).toFixed(0)}%`,
        verifiedProgress: `${(c.verifiedProgress * 100).toFixed(1)}%`,
        gapVsPlan: `${(c.gapVsPlan * 100).toFixed(1)}%`,
        overstatement: `${(c.reportingOverstatement * 100).toFixed(1)}%`,
        progressStatus: c.progressStatus,
        auditStatus: c.currentAuditStatus,
      })),
      audits: audits.map((a) => ({
        commitmentId: a.commitmentId,
        outcome: a.outcome,
        score: a.evidenceQualityScore,
        aiExplanation: a.aiGeneratedCitizenExplanation,
        supporting: a.supportingEvidenceSummary,
        contradictory: a.contradictoryEvidenceSummary,
        recommendations: a.recommendedNextActions,
      })),
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: `You are the ClimateAI Maharashtra Citizen Assistant.
You provide clear, factual, and accessible answers about municipal climate commitments in Mumbai and Pune.

MANDATORY RULES:
1. ONLY answer based on the provided ground truth context below.
2. NEVER invent, hallucinate, or fabricate climate targets, satellite observations, or citations.
3. If information is missing or not verified, explicitly say: "Data is currently not available in our verified registry."
4. Every factual claim MUST cite its source inside brackets, e.g. [Copernicus Sentinel-2 2024-10-12], [MCAP 2022 Page 74], or [Audit Matrix v2.4].
5. Respond in the user's requested language (${userLang === 'hi' ? 'Hindi' : userLang === 'mr' ? 'Marathi' : 'English'}).
6. Keep explanations warm, accessible, and scientifically accurate (e.g. remember NDVI measures plant greenness, not direct tree trunk counts).`,
        });

        const prompt = `User Question: "${message}"

Approved Ground Truth Climate Intelligence for ${city.name}:
${JSON.stringify(retrievalContext, null, 2)}

Provide an evidence-grounded response with explicit source citations.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({
          reply: responseText,
          citations: [
            { source: `${city.climateActionPlanName}`, type: 'Statutory Policy Document' },
            { source: 'Copernicus Sentinel-2 Level-2A', type: 'Satellite Multispectral BOA' },
            { source: 'Deterministic Audit Matrix v2.4', type: 'Verification Engine' },
          ],
          isAiGenerated: true,
        });
      } catch (geminiError) {
        console.warn('Gemini Assistant fallback triggered:', geminiError);
      }
    }

    // High-quality retrieval responses for common climate questions (Demo mode)
    const lower = message.toLowerCase();
    let reply = '';
    const citations: { source: string; type: string }[] = [];

    if (lower.includes('ward k-east') || lower.includes('k-east') || lower.includes('andheri') || (lower.includes('green') && lower.includes('discrepancy'))) {
      if (userLang === 'hi') {
        reply = `**वार्ड के-ईस्ट (अंधेरी पूर्व) हरित आवरण विसंगति [ऑडिट com-mum-exp-05]:**
- **नगर निगम का दावा:** बीएमसी ने दावा किया था कि उसने 50% लक्ष्य हासिल कर लिया है और 45,000 पौधे लगाए हैं।
- **उपग्रह और ड्रोन की खोज:** स्वतंत्र **कॉपरनिकस सेंटिनल-2 [अवलोकन 2024-10-10]** और आईआईटी बॉम्बे ड्रोन सर्वेक्षण में केवल **13.5% वास्तविक प्रगति** पाई गई।
- **तफावत का कारण:** लगाए गए 78% पौधे रखरखाव और पानी की कमी के कारण सूख गए।
- **अतिशयोक्ति:** आधिकारिक दावे और वास्तविकता के बीच **+36.5% का भारी अंतर** है, जिसे 'संभावित विसंगति' (POTENTIAL DISCREPANCY) के रूप में चिह्नित किया गया है।`;
      } else if (userLang === 'mr') {
        reply = `**के-पूर्व वॉर्ड (अंधेरी पूर्व) हरित आच्छादन तफावत [ऑडिट com-mum-exp-05]:**
- **महापालिकेचा दावा:** पालिकेने ५०% उद्दिष्ट पूर्ण केल्याचा आणि ४५,००० रोपे लावल्याचा अहवाल दिला होता.
- **उपग्रह व ड्रोन पाहणी:** स्वतंत्र **सेंटिनेल-२ उपग्रह [१० ऑक्टोबर २०२४]** आणि आयआयटी बॉम्बे ड्रोन सर्वेक्षणात केवळ **१३.५% प्रत्यक्ष प्रगती** आढळली.
- **तफावतीचे कारण:** लावलेली ७८% रोपे पाणी आणि देखभालीअभावी जळून गेली.
- **अतिशयोक्ती:** अधिकृत दावा आणि प्रत्यक्ष स्थिती यामध्ये **+३६.५% ची मोठी तफावत** आहे.`;
      } else {
        reply = `**Ward K-East (Andheri East) Green Canopy Discrepancy [Audit com-mum-exp-05]:**
- **Official City Claim [MCAP Page 74]:** Municipal reports claimed 50% progress achieved via planting 45,000 tree saplings in industrial buffer zones.
- **Independent Earth Observation:** Copernicus **Sentinel-2 Level-2A NDVI [Obs 2024-10-10]** and IIT Bombay drone surveys verified only **13.5% actual canopy progress**.
- **The Discrepancy:** A reporting overstatement of **+36.5 percentage points** was detected. Illustrative demonstration records indicate significant sapling loss occurred due to post-monsoon irrigation neglect and MIDC soil contamination.
- **Action Taken:** Flagged as **POTENTIAL DISCREPANCY** under the Scientific Integrity Matrix, triggering automated contractor payment holds.`;
      }
      citations.push({ source: 'Copernicus Sentinel-2 Level-2A NDVI Index', type: 'Satellite Observation' });
      citations.push({ source: 'IIT Bombay & NEERI Field Drone Photogrammetry', type: 'Independent Ground Survey' });
      citations.push({ source: 'BMC K-East Ward Plantation Log', type: 'Municipal Operational Record' });
    } else if (lower.includes('transport') && (lower.includes('emissions') || lower.includes('30%') || lower.includes('cut'))) {
      if (userLang === 'hi') {
        reply = `**परिवहन उत्सर्जन में 30% की कटौती [ऑडिट com-mum-exp-01]:**
- **योजना:** अब तक 30% कटौती का अंतरिम लक्ष्य था।
- **शहर का दावा:** शहर ने 14% की कमी का दावा किया।
- **सत्यापित प्रगति:** सेंटिनल-5P उपग्रह और सीपीसीबी वायु सेंसर केवल **6.5% कमी** की पुष्टि करते हैं।
- **स्थिति:** 23.5% के अंतर के कारण यह लक्ष्य **OFF TRACK** (पटरी से उतरा हुआ) है।`;
      } else if (userLang === 'mr') {
        reply = `**वाहतूक उत्सर्जनात ३०% कपात [ऑडिट com-mum-exp-01]:**
- **नियोजन:** आतापर्यंत ३०% कपातीचे उद्दिष्ट होते.
- **शहराचा दावा:** शहराने १४% कपात झाल्याचा दावा केला.
- **पडताळलेली प्रगती:** सेंटिनेल-५P उपग्रह आणि सीपीसीबी सेन्सर्स केवळ **६.५% कपातीची** पुष्टी करतात.
- **सद्यस्थिती:** २३.५% च्या अंतरामुळे हे उद्दिष्ट **OFF TRACK** श्रेणीत आहे.`;
      } else {
        reply = `**Cut Transport Emissions 30% by 2030 [Audit com-mum-exp-01]:**
- **Planned Target To Date [MCAP Page 42]:** 30.0% interim emissions reduction planned.
- **City-Reported Claim:** 14.0% reduction self-reported by transport planners.
- **Empirically Verified Progress:** **6.5% verified** (Average of Sentinel-5P TROPOMI NO2 satellite: 6.0% and CPCB ground sensors: 7.0%).
- **Implementation Shortfall:** Gap of **23.5 percentage points** places this commitment in the **OFF TRACK** status.
- **Recommended Remedy:** Introduce dedicated bus corridors and speed up depot transformer energisation via the What-If simulator.`;
      }
      citations.push({ source: 'Sentinel-5P TROPOMI Tropospheric NO2 Column', type: 'Satellite Observation' });
      citations.push({ source: 'CPCB & MPCB Continuous Ambient Telemetry Network', type: 'Ground Sensor Stream' });
      citations.push({ source: 'MCAP 2022 Strategy Document Page 42', type: 'Statutory Policy' });
    } else if (lower.includes('bus') || lower.includes('electrify') || lower.includes('best') || lower.includes('400')) {
      reply = `**Electrify 400 Public Transport Buses [Audit com-mum-exp-02]:**
- **Statutory Mandate [MCAP Page 112]:** BEST undertaking committed to induct 400 battery electric buses.
- **Planned To Date:** 60% (240 buses scheduled).
- **City Claimed:** 45% (180 buses claimed acquired).
- **Verified In Active Route Service:** **30% verified (120 active buses)** via BEST ITMS automated vehicle GPS tracking and Sentinel-2 depot charging footprint.
- **Bottleneck Identified:** 60 buses are sitting idle in Wadala & Majas depots awaiting 33kV substation energisation from DISCOMs.
- **Status:** **OFF TRACK** (30% gap vs plan), with an overstatement of +15.0 percentage points.`;
      citations.push({ source: 'BEST ITMS Automated Vehicle Location (AVL) GPS', type: 'Municipal Telemetry' });
      citations.push({ source: 'Sentinel-2 BOA Depot Solar Canopy Analysis', type: 'Satellite Observation' });
      citations.push({ source: 'BEST Undertaking Operational Log', type: 'Agency Record' });
    } else if (lower.includes('mumbai') && (lower.includes('promise') || lower.includes('commitments'))) {
      reply = `In the **Mumbai Climate Action Plan (MCAP 2022)**, the city made six core evaluated commitments:
1. **Cut Transport Emissions 30% [p. 42]:** Target 30% reduction &bull; Verified: 6.5% &bull; Status: OFF TRACK.
2. **Electrify 400 Buses [p. 112]:** BEST fleet electrification &bull; Verified: 30% (120 buses) &bull; Status: OFF TRACK.
3. **500 MW Rooftop Solar [p. 139]:** Commercial & municipal rooftops &bull; Verified: 39% &bull; Status: AT RISK.
4. **Clean Cooking Transition [p. 164]:** 100,000 households &bull; Verified: 47.5% &bull; Status: AT RISK.
5. **Green Canopy in Ward K-East [p. 74]:** +4% canopy gain &bull; Verified: 13.5% vs 50% claimed &bull; Status: POTENTIAL DISCREPANCY.
6. **Stormwater Drainage Upgrades [p. 98]:** 85 km arterial nullahs &bull; Verified: 36.5% &bull; Status: ON TRACK.`;
      citations.push({ source: 'Mumbai Climate Action Plan (MCAP 2022)', type: 'Policy Mandate' });
      citations.push({ source: 'Climate Tracker Prototype Plan (Excel Workbook)', type: 'Mathematical Registry' });
    } else if (lower.includes('ndvi') || lower.includes('explain ndvi') || lower.includes('satellite')) {
      reply = `**NDVI (Normalized Difference Vegetation Index)** is an Earth observation metric that measures live vegetation greenness.
- **The Formula:** (NIR - Red) / (NIR + Red), utilizing Sentinel-2 Band 8 (842nm Near-Infrared) and Band 4 (665nm Red).
- **How It Operates:** Healthy plant chlorophyll absorbs red light for photosynthesis and reflects near-infrared radiation.
- **Scientific Integrity Guardrail:** NDVI measures *areal chlorophyll reflectance*, NOT direct tree trunk counts. It cannot prove that newly planted saplings survived without multi-seasonal drone ground-truthing.`;
      citations.push({ source: 'Copernicus Sentinel-2 Radiometric Calibration Guide', type: 'Earth Observation Standard' });
      citations.push({ source: 'Scientific Integrity Protocol v2.4', type: 'Audit Matrix' });
    } else {
      reply = `Regarding **${city.name}**, our deterministic audit engine audits the **${city.climateActionPlanName}** using calibrated Copernicus Sentinel-2 Earth observation and CPCB sensor demonstration snapshots.
- **Overall Verified Score:** 60.7% across pilot commitments.
- **Average Overstatement:** Municipal reports run an average of +11.0 percentage points ahead of independent empirical data.
- **Integrity Rule:** Incomplete data is classified as INCONCLUSIVE, avoiding false accusations of failure.`;
      citations.push({ source: city.climateActionPlanName, type: 'Statutory Action Plan' });
      citations.push({ source: 'Deterministic Verification Matrix v2.4', type: 'Audit Engine' });
    }

    return NextResponse.json({
      reply,
      citations,
      isAiGenerated: false,
      modelUsed: 'Retrieval-Augmented Knowledge Engine (Demo Mode)',
    });
  } catch (error: any) {
    console.error('AI Assistant API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process assistant question: ' + error.message },
      { status: 500 }
    );
  }
}

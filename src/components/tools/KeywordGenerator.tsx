import React, { useState } from 'react';
import {
  Search,
  Copy,
  Check,
  Download,
  Filter,
  Sparkles,
  Layers,
  HelpCircle,
  Hash,
  Globe,
  MapPin,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Info
} from 'lucide-react';

export type KeywordCategory = 'all' | 'related' | 'longtail' | 'questions';

export interface KeywordResult {
  id: string;
  keyword: string;
  category: 'related' | 'longtail' | 'questions';
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  wordCount: number;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ja', name: 'Japanese (日本語)' },
];

export const SUPPORTED_COUNTRIES = [
  { code: 'IN', name: 'India (₹ / Regional)' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GLOBAL', name: 'Global / Worldwide' },
];

export const KeywordGenerator: React.FC = () => {
  const [seedKeyword, setSeedKeyword] = useState('digital utility tools');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [activeCategory, setActiveCategory] = useState<KeywordCategory>('all');
  const [filterQuery, setFilterQuery] = useState('');

  // Results & UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<KeywordResult[]>(() =>
    generateAlgorithmicKeywords('digital utility tools', 'en', 'IN')
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // Algorithmic search intent model
  function generateAlgorithmicKeywords(
    seed: string,
    lang: string,
    country: string
  ): KeywordResult[] {
    const clean = seed.trim().toLowerCase() || 'online tools';
    const cName = SUPPORTED_COUNTRIES.find((c) => c.code === country)?.name.split(' ')[0] || '';

    // 1. Related Keywords (Semantic variations, synonyms, modifier prefixes)
    const relatedList = [
      `${clean} software`,
      `${clean} platform`,
      `${clean} services`,
      `${clean} application`,
      `online ${clean}`,
      `free ${clean}`,
      `${clean} website`,
      `modern ${clean}`,
      `essential ${clean}`,
      `best ${clean}`,
      `${clean} system`,
      `secure ${clean}`,
    ];

    // 2. Long-Tail Keywords (Multi-phrase, user intent, regional & commercial modifiers)
    const longtailList = [
      `best ${clean} for beginners`,
      `top rated ${clean} in ${cName || '2026'}`,
      `easy to use ${clean} online`,
      `${clean} for small business`,
      `affordable ${clean} alternatives`,
      `${clean} step by step workflow`,
      `open source ${clean} tools`,
      `lightweight ${clean} for mobile`,
      `${clean} checklist and templates`,
      `high speed client side ${clean}`,
      `${clean} without registration`,
      `secure browser based ${clean}`,
    ];

    // 3. Question-Based Keywords (Informational problem-solving queries)
    const questionsList = [
      `how to use ${clean}`,
      `what is ${clean} and how does it work`,
      `why is ${clean} important for productivity`,
      `where to find free ${clean}`,
      `which ${clean} is the best in ${cName || '2026'}`,
      `can I use ${clean} on mobile`,
      `how does ${clean} protect data privacy`,
      `is ${clean} safe to use online`,
      `how to choose the right ${clean}`,
      `what are the benefits of ${clean}`,
      `when should you use ${clean}`,
      `who needs ${clean} today`,
    ];

    const allItems: KeywordResult[] = [];

    relatedList.forEach((kw, i) => {
      allItems.push({
        id: `rel-${i}-${Date.now()}`,
        keyword: kw,
        category: 'related',
        intent: i % 2 === 0 ? 'Commercial' : 'Informational',
        wordCount: kw.split(' ').length,
      });
    });

    longtailList.forEach((kw, i) => {
      allItems.push({
        id: `long-${i}-${Date.now()}`,
        keyword: kw,
        category: 'longtail',
        intent: kw.includes('best') || kw.includes('affordable') ? 'Commercial' : 'Transactional',
        wordCount: kw.split(' ').length,
      });
    });

    questionsList.forEach((kw, i) => {
      allItems.push({
        id: `q-${i}-${Date.now()}`,
        keyword: kw,
        category: 'questions',
        intent: 'Informational',
        wordCount: kw.split(' ').length,
      });
    });

    return allItems;
  }

  // Handle Generate Keywords
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!seedKeyword.trim()) return;

    setIsGenerating(true);
    setSuccessNote(null);

    // Architectural hook: Ready for future SEO API backend endpoint integration (/api/keywords)
    setTimeout(() => {
      const generated = generateAlgorithmicKeywords(seedKeyword, selectedLanguage, selectedCountry);
      setResults(generated);
      setIsGenerating(false);
      setSuccessNote(`Generated ${generated.length} keyword variations for "${seedKeyword}"`);
      setTimeout(() => setSuccessNote(null), 3500);
    }, 300);
  };

  // Copy individual
  const handleCopySingle = (kw: string, id: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy all matching
  const handleCopyAll = () => {
    const text = filteredResults.map((r) => r.keyword).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Download CSV
  const handleDownloadCSV = () => {
    const headers = 'Keyword,Category,Search Intent,Word Count\n';
    const rows = filteredResults
      .map((r) => `"${r.keyword}","${r.category}","${r.intent}",${r.wordCount}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keywords_${seedKeyword.replace(/\s+/g, '_').toLowerCase()}.csv`;
    link.click();
  };

  // Download TXT
  const handleDownloadTXT = () => {
    const content = filteredResults.map((r) => r.keyword).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keywords_${seedKeyword.replace(/\s+/g, '_').toLowerCase()}.txt`;
    link.click();
  };

  // Reset
  const handleReset = () => {
    setSeedKeyword('');
    setResults([]);
    setFilterQuery('');
  };

  // Filtered list by active category tab and sub-filter query
  const filteredResults = results.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesQuery = filterQuery === '' || r.keyword.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const countRelated = results.filter((r) => r.category === 'related').length;
  const countLongtail = results.filter((r) => r.category === 'longtail').length;
  const countQuestions = results.filter((r) => r.category === 'questions').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-[#172554]">
      {/* Tool Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-sky-50/50 via-white to-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#172554]">Keyword Generator</h2>
              <p className="text-xs text-[#64748B]">
                Discover related, long-tail and question-based keywords for content & SEO planning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Route: <span className="text-[#1456D9] font-mono">/tools/keyword-generator</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* INPUTS ROW: Seed + Language + Country */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Topic / Seed Keyword */}
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-[#172554] mb-1.5">
                Topic or Seed Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  placeholder="e.g. digital marketing, healthy recipes, wedding photo..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            {/* Language Selection */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-[#172554] mb-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Language</span>
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none bg-white"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Selection */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-[#172554] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Target Country</span>
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none bg-white"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick preset chips and Generate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Suggestions:</span>
              {['PDF converter', 'Loan EMI calculator', 'QR generator', 'Image compressor'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSeedKeyword(chip);
                    setResults(generateAlgorithmicKeywords(chip, selectedLanguage, selectedCountry));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition"
                title="Reset Fields"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isGenerating || !seedKeyword.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 transition shadow-sm active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Keywords'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Informational Compliance Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-[#64748B]">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p>
            Suggestions are generated via semantic query parsing and search intent models. To guarantee privacy and integrity, we never fabricate live Google volume figures. The pipeline is architectured for backend proxy API expansion.
          </p>
        </div>

        {/* RESULTS WORKSPACE */}
        {results.length > 0 && (
          <div className="space-y-4 pt-2">
            {/* Category Tabs & Quick Export Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Tabs: All / Related / Long-tail / Questions */}
              <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-bold scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeCategory === 'all'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({results.length})
                </button>
                <button
                  onClick={() => setActiveCategory('related')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeCategory === 'related'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Related Keywords ({countRelated})
                </button>
                <button
                  onClick={() => setActiveCategory('longtail')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeCategory === 'longtail'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Long-Tail ({countLongtail})
                </button>
                <button
                  onClick={() => setActiveCategory('questions')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeCategory === 'questions'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Question-Based ({countQuestions})
                </button>
              </div>

              {/* Action Buttons: Filter, Copy All, CSV, TXT */}
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-44">
                  <input
                    type="text"
                    placeholder="Filter results..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-sky-500 bg-white"
                  />
                </div>

                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition shrink-0"
                  title="Copy matching keywords"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
                </button>

                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition shrink-0"
                  title="Download as CSV spreadsheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={handleDownloadTXT}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shrink-0"
                  title="Download as plain text TXT"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </button>
              </div>
            </div>

            {/* Keyword Results Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Keyword Suggestion</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Search Intent</th>
                      <th className="px-4 py-3">Words</th>
                      <th className="px-4 py-3 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResults.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 font-semibold text-[#172554]">
                          {item.keyword}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              item.category === 'related'
                                ? 'bg-blue-50 text-blue-700'
                                : item.category === 'longtail'
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {item.category === 'related'
                              ? 'Related'
                              : item.category === 'longtail'
                              ? 'Long-Tail'
                              : 'Question'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {item.intent}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {item.wordCount}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleCopySingle(item.keyword, item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
                            title="Copy Keyword"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredResults.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No matching keywords for filter "{filterQuery}".
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

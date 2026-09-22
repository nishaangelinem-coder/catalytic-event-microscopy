import React, { useState, useMemo } from 'react';
import {
  MANUSCRIPT_META,
  MANUSCRIPT_SECTIONS,
  MANUSCRIPT_FIGURES,
  MANUSCRIPT_TABLES,
  ManuscriptFigureData,
} from '../data/manuscriptData';
import { ManuscriptFigureRenderer } from './ManuscriptFigureRenderer';
import { ManuscriptTableRenderer } from './ManuscriptTableRenderer';
import {
  BookOpen,
  Printer,
  Download,
  Search,
  Sliders,
  Maximize2,
  X,
  FileCode,
  FileText,
  ListOrdered,
  Type,
  ExternalLink,
  ChevronRight,
  Hash,
} from 'lucide-react';

export const ManuscriptView: React.FC = () => {
  // Reading and layout preferences
  const [layoutMode, setLayoutMode] = useState<'single' | 'two_column'>('single');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomedFigure, setZoomedFigure] = useState<ManuscriptFigureData | null>(null);
  const [activeNavGroup, setActiveNavGroup] = useState<'sections' | 'figures' | 'tables'>('sections');

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MANUSCRIPT_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MANUSCRIPT_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.content.some((p) => p.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Export as Markdown file
  const handleExportMarkdown = () => {
    let md = `# ${MANUSCRIPT_META.title}\n\n`;
    md += `**Journal**: ${MANUSCRIPT_META.journal} | **Article Type**: ${MANUSCRIPT_META.articleType}\n`;
    md += `**DOI**: ${MANUSCRIPT_META.doi}\n\n`;
    md += `### Authors\n${MANUSCRIPT_META.authors.map((a) => a.name).join(', ')}\n\n`;
    md += `### Abstract\n${MANUSCRIPT_META.abstract}\n\n`;
    md += `### Keywords\n${MANUSCRIPT_META.keywords.join(', ')}\n\n---\n\n`;

    MANUSCRIPT_SECTIONS.forEach((sec) => {
      md += `## ${sec.number}. ${sec.title}\n\n`;
      sec.content.forEach((p) => {
        md += `${p}\n\n`;
      });
    });

    md += `\n---\n\n## Tables\n\n`;
    MANUSCRIPT_TABLES.forEach((tbl) => {
      md += `### ${tbl.label}: ${tbl.title}\n\n`;
      md += `| ${tbl.headers.join(' | ')} |\n`;
      md += `| ${tbl.headers.map(() => '---').join(' | ')} |\n`;
      tbl.rows.forEach((r) => {
        md += `| ${r.join(' | ')} |\n`;
      });
      md += `\n${tbl.footnotes.map((fn, idx) => `[${idx + 1}] ${fn}`).join('\n')}\n\n`;
    });

    md += `\n---\n\n## Figures Summary\n\n`;
    MANUSCRIPT_FIGURES.forEach((fig) => {
      md += `### ${fig.label}: ${fig.title}\n${fig.caption}\n\n${fig.extendedCaption}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Catalytic_Event_Microscopy_Manuscript.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export as LaTeX file
  const handleExportLatex = () => {
    let tex = `\\documentclass[journal=nacano,manuscript=article]{achemso}\n`;
    tex += `\\usepackage{amsmath,amssymb,graphicx,booktabs,lineno}\n\n`;
    tex += `\\title{${MANUSCRIPT_META.title}}\n\n`;
    MANUSCRIPT_META.authors.forEach((a) => {
      tex += `\\author{${a.name}}\n`;
    });
    tex += `\n\\begin{document}\n\n\\begin{abstract}\n${MANUSCRIPT_META.abstract}\n\\end{abstract}\n\n`;

    MANUSCRIPT_SECTIONS.forEach((sec) => {
      tex += `\\section{${sec.title}}\n\n`;
      sec.content.forEach((p) => {
        tex += `${p}\n\n`;
      });
    });

    tex += `\\end{document}\n`;

    const blob = new Blob([tex], { type: 'application/x-latex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Catalytic_Event_Microscopy_Manuscript.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Trigger browser print dialog for PDF generation
  const handlePrint = () => {
    window.print();
  };

  // Font size classes
  const fontClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  const sizeClass =
    fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left Navigation Outline Drawer */}
      <aside className="lg:w-64 shrink-0 space-y-4">
        {/* Sticky Control Card */}
        <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Article Navigator</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              20 Figs • 11 Tabs
            </span>
          </div>

          {/* Search filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manuscript text..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Group Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setActiveNavGroup('sections')}
              className={`py-1 rounded text-center transition-colors ${
                activeNavGroup === 'sections' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
              }`}
            >
              Text ({MANUSCRIPT_SECTIONS.length})
            </button>
            <button
              onClick={() => setActiveNavGroup('figures')}
              className={`py-1 rounded text-center transition-colors ${
                activeNavGroup === 'figures' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
              }`}
            >
              Figs (20)
            </button>
            <button
              onClick={() => setActiveNavGroup('tables')}
              className={`py-1 rounded text-center transition-colors ${
                activeNavGroup === 'tables' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
              }`}
            >
              Tabs (11)
            </button>
          </div>

          {/* Nav List with smooth scroll */}
          <div className="max-h-72 overflow-y-auto space-y-1 text-xs pr-1">
            {activeNavGroup === 'sections' && (
              <>
                <a
                  href="#abstract-block"
                  className="block p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
                >
                  Abstract & Keywords
                </a>
                {MANUSCRIPT_SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#section-${sec.id}`}
                    className="block p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors text-[11px] truncate"
                  >
                    <span className="font-mono text-cyan-500 mr-1">{sec.number}</span>
                    {sec.title}
                  </a>
                ))}
              </>
            )}

            {activeNavGroup === 'figures' && (
              <>
                {MANUSCRIPT_FIGURES.map((fig) => (
                  <a
                    key={fig.id}
                    href={`#figure-${fig.id}`}
                    className="block p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors text-[11px] truncate"
                  >
                    <span className="font-mono text-cyan-400 font-bold mr-1">Fig. {fig.id}</span>
                    <span className="text-slate-500">{fig.title}</span>
                  </a>
                ))}
              </>
            )}

            {activeNavGroup === 'tables' && (
              <>
                {MANUSCRIPT_TABLES.map((tbl) => (
                  <a
                    key={tbl.id}
                    href={`#table-${tbl.id}`}
                    className="block p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-300 transition-colors text-[11px] truncate"
                  >
                    <span className="font-mono text-emerald-400 font-bold mr-1">Tab. {tbl.id}</span>
                    <span className="text-slate-500">{tbl.title}</span>
                  </a>
                ))}
              </>
            )}
          </div>

          {/* Format and Reader Adjustments */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Reading Controls
            </div>
            {/* Font family & Line numbers */}
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-[11px]"
              >
                <Type className="w-3 h-3" />
                <span>{fontFamily === 'serif' ? 'Serif Font' : 'Sans Font'}</span>
              </button>
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border ${
                  showLineNumbers
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'border-slate-800 text-slate-500'
                }`}
              >
                <ListOrdered className="w-3 h-3" />
                <span>Line Nos</span>
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Layout:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setLayoutMode('single')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    layoutMode === 'single' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  1-Col
                </button>
                <button
                  onClick={() => setLayoutMode('two_column')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    layoutMode === 'two_column' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  2-Col
                </button>
              </div>
            </div>

            {/* Export Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
              <button
                onClick={handlePrint}
                className="w-full py-1.5 px-2 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print / Save PDF</span>
              </button>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={handleExportMarkdown}
                  className="py-1 px-2 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                  title="Export Markdown (.md)"
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>.MD</span>
                </button>
                <button
                  onClick={handleExportLatex}
                  className="py-1 px-2 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                  title="Export LaTeX (.tex)"
                >
                  <FileCode className="w-3 h-3 text-purple-400" />
                  <span>.TEX</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Manuscript Body in Q1 Journal Formatting */}
      <article className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 text-slate-200 shadow-xl space-y-8 overflow-hidden max-w-5xl">
        {/* Journal Header Banner */}
        <div className="border-b-2 border-slate-700 pb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-400 text-sm">{MANUSCRIPT_META.journal}</span>
              <span>|</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {MANUSCRIPT_META.articleType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Received: {MANUSCRIPT_META.receivedDate}</span>
              <span>•</span>
              <span>Accepted: {MANUSCRIPT_META.acceptedDate}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-100 tracking-tight leading-tight">
            {MANUSCRIPT_META.title}
          </h1>

          {/* Authors List */}
          <div className="text-sm font-sans space-y-1">
            <p className="text-slate-300 leading-relaxed">
              {MANUSCRIPT_META.authors.map((author, idx) => (
                <span key={author.name}>
                  <strong className="font-semibold text-slate-100">{author.name}</strong>
                  <sup className="text-cyan-400 ml-0.5 font-mono">
                    {idx === 0 ? '1,*' : idx === 1 ? '2' : idx === 2 ? '1' : idx === 3 ? '3' : idx === 4 ? '4' : '2,*'}
                  </sup>
                  {idx < MANUSCRIPT_META.authors.length - 1 && ', '}
                </span>
              ))}
            </p>
            <div className="text-xs text-slate-400 pt-1 space-y-0.5">
              {MANUSCRIPT_META.affiliations.map((aff, i) => (
                <p key={i}>{aff}</p>
              ))}
              <p className="text-[11px] text-cyan-400 pt-1">
                *Corresponding authors: Elena V. Rostova (e.rostova@nano-inst.ch), Klaus K. Hansen (klaus.hansen@cen.dtu.dk)
              </p>
              <p className="text-[11px] text-slate-500 font-mono pt-0.5">
                DOI: <a href={`https://doi.org/${MANUSCRIPT_META.doi}`} target="_blank" rel="noreferrer" className="text-cyan-500 hover:underline">{MANUSCRIPT_META.doi}</a>
              </p>
            </div>
          </div>
        </div>

        {/* Abstract & Keywords Block */}
        <div id="abstract-block" className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Abstract
          </div>
          <p className="text-sm font-serif text-slate-300 leading-relaxed text-justify">
            {MANUSCRIPT_META.abstract}
          </p>
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500">Keywords:</span>
            {MANUSCRIPT_META.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Section 1: Introduction */}
        <section id="section-intro" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">1.</span> Introduction
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'intro')?.content.map((para, idx) => (
              <p key={idx} className="relative">
                {showLineNumbers && (
                  <span className="absolute -left-8 font-mono text-[9px] text-slate-600 select-none">
                    {idx * 15 + 1}
                  </span>
                )}
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Section 2.1: Results - Hardware Synchronization (Embeds Fig 1, Fig 2, Tab 1, Tab 2) */}
        <section id="section-results_1" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.1</span> Hardware-Synchronized Operando Nanoreactor & Multimodal TTL Architecture
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_1')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 1 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[0]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 1 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[0]} />
          {/* Embed Figure 2 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[1]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 2 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[1]} />
        </section>

        {/* Section 2.2: Results - Deconvolution & Fluidics (Embeds Fig 3, Fig 4, Tab 3, Tab 4) */}
        <section id="section-results_2" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.2</span> Impulse Response Deconvolution & Delayed Signal Alignment
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_2')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 3 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[2]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 3 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[2]} />
          {/* Embed Figure 4 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[3]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 4 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[3]} />
        </section>

        {/* Section 2.3: Results - Event-Aligned Averaging (Embeds Fig 5, Fig 6, Tab 5) */}
        <section id="section-results_3" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.3</span> Event-Aligned Averaging & Discovery of Transient Pt₁–Pt₂ Dimer Activation
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_3')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 5 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[4]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 5 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[4]} />
          {/* Embed Figure 6 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[5]} onOpenZoom={setZoomedFigure} />
        </section>

        {/* Section 2.4: Results - 3D Causal Probability Field (Embeds Fig 7, Tab 6) */}
        <section id="section-results_4" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.4</span> Construction of the 3D Causal Structure–Activity Probability Field
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_4')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 7 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[6]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 6 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[5]} />
        </section>

        {/* Section 2.5: Results - Beam-Aware Framework (Embeds Fig 8, Fig 9, Fig 10, Tab 7, Tab 8) */}
        <section id="section-results_5" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.5</span> Beam-Aware Measurement & Bayesian Trajectory Reconstruction
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_5')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 8 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[7]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 7 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[6]} />
          {/* Embed Figure 9 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[8]} onOpenZoom={setZoomedFigure} />
          {/* Embed Figure 10 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[9]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 8 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[7]} />
        </section>

        {/* Section 2.6: Results - Multi-Technique Cross-Validation (Embeds Fig 11, 12, 13, 14, Tab 9) */}
        <section id="section-results_6" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.6</span> Spatial Representativeness & Multi-Technique Operando Spectroscopy Cross-Validation
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_6')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 11 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[10]} onOpenZoom={setZoomedFigure} />
          {/* Embed Figure 12 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[11]} onOpenZoom={setZoomedFigure} />
          {/* Embed Figure 13 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[12]} onOpenZoom={setZoomedFigure} />
          {/* Embed Figure 14 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[13]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 9 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[8]} />
        </section>

        {/* Section 2.7: Results - Closed-Loop Adaptive Catalysts (Embeds Fig 15, Fig 16, Tab 10) */}
        <section id="section-results_7" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.7</span> Closed-Loop Adaptive Catalyst Stabilization & Anti-Sintering Feedback
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_7')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 15 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[14]} onOpenZoom={setZoomedFigure} />
          {/* Embed Figure 16 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[15]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 10 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[9]} />
        </section>

        {/* Section 2.8: Results - Generality Across Model Systems (Embeds Fig 17, Fig 18, Fig 19) */}
        <section id="section-results_8" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.8</span> Generality Across Model Catalyst Systems: Pt₁/TiO₂, Pt₁/N-C, and Dual-Atom Sites
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_8')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 17 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[16]} onOpenZoom={setZoomedFigure} />
          {/* Embed Figure 18 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[17]} onOpenZoom={setZoomedFigure} />
          {/* Embed Figure 19 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[18]} onOpenZoom={setZoomedFigure} />
        </section>

        {/* Section 2.9: Results - Microkinetic Modeling & DFT (Embeds Fig 20, Tab 11) */}
        <section id="section-results_9" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">2.9</span> Microkinetic Mechanism and Density Functional Theory Free Energy Profiles
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'results_9')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {/* Embed Figure 20 */}
          <ManuscriptFigureRenderer figure={MANUSCRIPT_FIGURES[19]} onOpenZoom={setZoomedFigure} />
          {/* Embed Table 11 */}
          <ManuscriptTableRenderer table={MANUSCRIPT_TABLES[10]} />
        </section>

        {/* Section 3: Discussion */}
        <section id="section-discussion" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">3.</span> Discussion
          </h2>
          <div className={`space-y-4 ${fontClass} ${sizeClass} leading-relaxed text-justify`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'discussion')?.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* Section 4: Methods */}
        <section id="section-methods" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">4.</span> Methods
          </h2>
          <div className={`space-y-4 ${fontClass} text-xs leading-relaxed text-justify text-slate-300`}>
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'methods')?.content.map((para, idx) => (
              <p key={idx}>
                <strong className="text-slate-100 font-sans">{para.split(':')[0]}:</strong>
                {para.substring(para.indexOf(':') + 1)}
              </p>
            ))}
          </div>
        </section>

        {/* Section 5: References */}
        <section id="section-references" className="space-y-3 pt-4 border-t border-slate-800 scroll-mt-24">
          <h2 className="text-xl font-bold font-serif text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="font-mono text-cyan-400 text-base">5.</span> References
          </h2>
          <div className="space-y-1.5 text-xs text-slate-400 font-sans">
            {MANUSCRIPT_SECTIONS.find((s) => s.id === 'references')?.content.map((ref, idx) => (
              <p key={idx} className="leading-snug">
                <span className="text-slate-300">{ref}</span>
              </p>
            ))}
          </div>
        </section>

        {/* Acknowledgements & Data Availability */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400 font-sans">
          <h4 className="font-bold text-slate-200">Data and Code Availability</h4>
          <p>
            All raw HAADF-STEM image stacks, 10-Hz time series descriptor files D(t), online mass spectrometry traces,
            and Bayesian trajectory decomposition scripts have been deposited in the Zenodo repository under accession code
            DOI: 10.5281/zenodo.10842911. Custom Python and TypeScript code for Wiener–Tikhonov deconvolution and
            Granger-causality analysis is openly available at GitHub (https://github.com/catalytic-event-microscopy/cem-core).
          </p>
        </div>
      </article>

      {/* Vector Zoom Modal */}
      {zoomedFigure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{zoomedFigure.label}</span>
                <h3 className="text-sm font-bold text-slate-100">{zoomedFigure.title}</h3>
              </div>
              <button
                onClick={() => setZoomedFigure(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Expanded Render */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <ManuscriptFigureRenderer figure={zoomedFigure} />
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-cyan-300 font-mono">Panel Annotations:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {zoomedFigure.panels.map((p) => (
                    <div key={p.label} className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-amber-300 font-mono mr-1">Panel {p.label}:</strong>
                      <span className="text-slate-200 font-semibold">{p.title}</span> —{' '}
                      <span className="text-slate-400">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

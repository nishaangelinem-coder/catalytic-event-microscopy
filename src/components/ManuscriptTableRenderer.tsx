import React, { useState } from 'react';
import { ManuscriptTableData } from '../data/manuscriptData';
import { Copy, Check, Table as TableIcon, FileText } from 'lucide-react';

interface ManuscriptTableRendererProps {
  table: ManuscriptTableData;
}

export const ManuscriptTableRenderer: React.FC<ManuscriptTableRendererProps> = ({ table }) => {
  const [copiedFormat, setCopiedFormat] = useState<'csv' | 'latex' | null>(null);

  const handleCopyCSV = () => {
    const csvContent = [
      table.headers.join(','),
      ...table.rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopiedFormat('csv');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyLatex = () => {
    const colAlign = table.headers.map(() => 'l').join(' ');
    const headerLine = table.headers.join(' & ') + ' \\\\ \\midrule';
    const bodyLines = table.rows.map((r) => r.join(' & ') + ' \\\\').join('\n');
    const latex = `\\begin{table}[htbp]
\\centering
\\caption{${table.title}}
\\label{tab:${table.id}}
\\begin{tabular}{${colAlign}}
\\toprule
${headerLine}
${bodyLines}
\\bottomrule
\\end{tabular}
\\end{table}`;
    navigator.clipboard.writeText(latex);
    setCopiedFormat('latex');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div
      id={`table-${table.id}`}
      className="my-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 flex flex-col gap-3 shadow-md scroll-mt-24"
    >
      {/* Table Header & Copy Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-emerald-400">
            {table.label.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCSV}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-950 border border-slate-800 transition-colors"
            title="Copy Table as CSV"
          >
            {copiedFormat === 'csv' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedFormat === 'csv' ? 'CSV Copied' : 'Copy CSV'}</span>
          </button>
          <button
            onClick={handleCopyLatex}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-950 border border-slate-800 transition-colors"
            title="Copy as LaTeX tabular"
          >
            {copiedFormat === 'latex' ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3" />}
            <span>{copiedFormat === 'latex' ? 'LaTeX Copied' : 'Copy LaTeX'}</span>
          </button>
        </div>
      </div>

      {/* Formal Table Caption */}
      <div className="text-xs font-serif text-slate-200 leading-snug">
        <strong className="font-sans font-bold text-slate-100">{table.label} | {table.title}.</strong>
      </div>

      {/* Table Container with Q1 Three-Line Border Styling */}
      <div className="overflow-x-auto w-full border-t-2 border-b-2 border-slate-400/80">
        <table className="w-full text-left text-xs font-mono border-collapse">
          {/* Top Rule & Header */}
          <thead>
            <tr className="border-b border-slate-600 bg-slate-950/40 text-slate-300 font-semibold text-[11px]">
              {table.headers.map((h, idx) => (
                <th key={idx} className="py-2.5 px-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
            {table.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={rIdx % 2 === 1 ? 'bg-slate-950/20' : 'bg-transparent hover:bg-slate-800/30'}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`py-2 px-3 whitespace-nowrap ${
                      cIdx === 0 ? 'font-semibold text-slate-200' : 'text-slate-300'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footnotes */}
      {table.footnotes && table.footnotes.length > 0 && (
        <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800/60 font-sans">
          {table.footnotes.map((fn, idx) => (
            <p key={idx}>
              <sup className="font-mono text-cyan-400 mr-1">[{idx + 1}]</sup>
              {fn}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

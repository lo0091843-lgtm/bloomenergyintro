import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Whitepaper } from '../types';

interface WhitepaperModalProps {
  whitepaper: Whitepaper | null;
  onClose: () => void;
  onOpenConfigurator?: () => void;
}

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({
  whitepaper,
  onClose,
  onOpenConfigurator,
}) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!whitepaper) return null;

  const handleDownload = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloaded(true);
          
          // Trigger actual text/pdf blob download for realistic UX
          const blobContent = `=====================================================
${whitepaper.title}
${whitepaper.subtitle}
Bloom Energy Engineering Technical Whitepaper (${whitepaper.year})
=====================================================

[ABSTRACT]
${whitepaper.abstract}

[KEY FINDINGS]
${whitepaper.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

[TABLE OF CONTENTS]
${whitepaper.tableOfContents.join('\n')}

=====================================================
(c) 2026 Bloom Energy Corporation. All rights reserved.
For inquiries, contact: solution-kr@bloomenergy.com
=====================================================`;
          
          const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = whitepaper.pdfFilename.replace('.pdf', '.txt');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          return 100;
        }
        return prev + 30;
      });
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001A33]/80 backdrop-blur-md transition-opacity">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002D56] text-white p-6 relative flex justify-between items-start border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8CC63F] uppercase tracking-wider mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#8CC63F]"></span>
              {whitepaper.badge || '기술 백서 리소스'} · {whitepaper.year}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {whitepaper.title}
            </h3>
            <p className="text-sm text-slate-300 mt-1 line-clamp-1">
              {whitepaper.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors ml-4 shrink-0"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-4 py-2.5 px-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1.5 font-sans">
              <FileText className="w-4 h-4 text-[#002D56]" />
              <strong>{whitepaper.pages}</strong> 페이지
            </span>
            <span>·</span>
            <span>용량 <strong>{whitepaper.fileSize}</strong></span>
            <span>·</span>
            <span>포맷 <strong>PDF (디지털 정식 판본)</strong></span>
            <span>·</span>
            <span className="text-[#002D56] font-semibold">공식 검증 완료</span>
          </div>

          {/* Abstract */}
          <div>
            <h4 className="text-sm font-bold text-[#002D56] uppercase tracking-wider mb-2">
              연구 요약 및 초록
            </h4>
            <p className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
              {whitepaper.abstract}
            </p>
          </div>

          {/* Key Findings */}
          <div>
            <h4 className="text-sm font-bold text-[#002D56] uppercase tracking-wider mb-3">
              핵심 연구 결과 및 엔지니어링 지표
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whitepaper.keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 bg-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 leading-normal">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table of Contents */}
          <div>
            <h4 className="text-sm font-bold text-[#002D56] uppercase tracking-wider mb-2">
              상세 목차
            </h4>
            <ul className="space-y-1.5 pl-2 text-xs text-slate-600 font-sans">
              {whitepaper.tableOfContents.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#8CC63F]" />
            <span>기업 및 학술 연구용 무료 배포 라이선스</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onOpenConfigurator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenConfigurator();
                }}
                className="px-4 py-2.5 text-xs font-semibold text-[#002D56] border border-slate-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>솔루션 설계 연계</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleDownload}
              disabled={downloadProgress !== null && downloadProgress < 100}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm ${
                isDownloaded
                  ? 'bg-[#8CC63F] text-[#002D56] hover:bg-[#7db435]'
                  : 'bg-[#002D56] text-white hover:bg-[#001A33]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>
                {downloadProgress !== null && downloadProgress < 100
                  ? `다운로드 중... (${downloadProgress}%)`
                  : isDownloaded
                  ? '다운로드 완료 (다시 받기)'
                  : '전체 백서 무료 다운로드'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

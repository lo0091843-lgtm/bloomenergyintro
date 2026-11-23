import React, { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react';
import { PageId } from '../types';
import { WHITEPAPERS } from '../data/bloomData';

interface WhitepapersPageProps {
  onNavigate: (page: PageId) => void;
  onOpenWhitepaper: (id: string) => void;
  selectedWhitepaperId?: string;
}

export const WhitepapersPage: React.FC<WhitepapersPageProps> = ({
  onNavigate,
  onOpenWhitepaper,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '전체 백서' },
    { id: 'sofc', label: 'SOFC 고효율 발전' },
    { id: 'soec', label: 'SOEC 그린 수소' },
    { id: 'datacenter', label: 'AI 데이터센터' },
    { id: 'esg', label: 'ESG 및 탄소중립' },
  ];

  const filteredPapers = WHITEPAPERS.filter((paper) => {
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    const matchesSearch = 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-[#002D56] transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>홈</span>
          </button>
          <span>/</span>
          <span className="text-[#002D56] font-semibold">기술 백서 자료실</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <span className="text-xs font-bold text-[#8CC63F] bg-[#002D56] py-1 px-3 rounded-full uppercase tracking-wider">
              공식 기술 백서 자료실 · 2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#002D56] mt-3 tracking-tight">
              블룸 에너지 엔지니어링 기술 백서 자료실
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              세계 최고 효율 고체산화물 연료전지 및 수전해 기술에 관한 학술적 분석 보고서와 
              산업군별 마이크로그리드 아키텍처 실증 데이터를 제공합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-200/60 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#002D56] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="백서 검색 (예: SOFC, 수소, 데이터센터)..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8CC63F]"
            />
          </div>
        </div>
      </div>

      {/* Whitepaper Cards Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">검색 조건에 맞는 기술 백서가 없습니다.</p>
            <p className="text-xs text-slate-500 mt-1">다른 검색어를 입력하시거나 카테고리 필터를 변경해 보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPapers.map((paper) => (
              <div 
                key={paper.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#8CC63F] hover:shadow-md transition-all duration-300 p-8 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header metadata */}
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-mono">
                    <span className="font-semibold text-[#8CC63F] uppercase tracking-wider bg-[#002D56] px-2.5 py-0.5 rounded-md font-sans">
                      {paper.badge || paper.category.toUpperCase()}
                    </span>
                    <span>{paper.year}년 발행 · {paper.pages}p · {paper.fileSize}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#002D56] tracking-tight mb-2 leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-1">
                    {paper.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    {paper.abstract}
                  </p>

                  {/* Key points preview */}
                  <div className="space-y-1.5 mb-6 text-xs text-slate-700">
                    <div className="font-semibold text-slate-900 mb-2">주요 연구 시사점:</div>
                    {paper.keyFindings.slice(0, 2).map((k, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8CC63F] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{k}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onOpenWhitepaper(paper.id)}
                    className="text-xs font-bold text-[#002D56] hover:text-[#8CC63F] flex items-center gap-1.5 cursor-pointer py-1"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>초록 및 목차 미리보기</span>
                  </button>

                  <button
                    onClick={() => onOpenWhitepaper(paper.id)}
                    className="px-4 py-2 bg-[#002D56] text-white hover:bg-[#8CC63F] hover:text-[#002D56] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF 다운로드</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notice Info Strip */}
        <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8CC63F] shrink-0" />
            <span>모든 기술 백서는 글로벌 엔지니어링 표준 및 실험실 실측 데이터 기반으로 작성되었습니다.</span>
          </div>
          <button
            onClick={() => onNavigate('solutions')}
            className="font-bold text-[#002D56] hover:text-[#8CC63F] transition-colors whitespace-nowrap cursor-pointer"
          >
            데이터센터 맞춤형 계산기 실행 →
          </button>
        </div>
      </div>
    </div>
  );
};

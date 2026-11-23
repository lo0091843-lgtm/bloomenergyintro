import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenConsultation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: '홈' },
    { id: 'technology', label: '기술 소개' },
    { id: 'solutions', label: '맞춤 솔루션' },
    { id: 'sustainability', label: '지속가능성' },
    { id: 'whitepapers', label: '기술 백서' },
    { id: 'company', label: '회사 소개' },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#002D56]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element) */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-2xl font-bold tracking-tighter text-white whitespace-nowrap shrink-0 flex items-center group cursor-pointer"
          aria-label="Bloom Energy 홈으로 이동"
        >
          BLOOM<span className="text-[#8CC63F] group-hover:scale-125 transition-transform inline-block">.</span>
        </button>

        {/* Zone 2: Navigation Links (single-line whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 relative text-sm cursor-pointer ${
                  isActive
                    ? 'text-[#8CC63F] font-semibold'
                    : 'text-slate-200 hover:text-[#8CC63F]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8CC63F] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#002D56] bg-[#8CC63F] rounded-lg hover:bg-white transition-colors duration-200 whitespace-nowrap shadow-sm cursor-pointer"
          >
            <span>상담 및 견적</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-[#8CC63F] p-1.5 rounded-md focus:outline-none cursor-pointer"
            aria-label="모바일 메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#001A33] border-b border-white/10 px-6 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-md font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#8CC63F]/15 text-[#8CC63F] font-semibold'
                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-2.5 bg-[#8CC63F] text-[#002D56] font-bold rounded-lg text-xs text-center flex items-center justify-center gap-1.5"
            >
              <span>맞춤형 상담 및 견적 신청</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

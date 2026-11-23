import React from 'react';
import { PageId } from '../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  return (
    <footer className="bg-[#001A33] text-slate-400 py-16 border-t border-white/10 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold tracking-tighter text-white flex items-center cursor-pointer"
            >
              BLOOM<span className="text-[#8CC63F]">.</span>
            </button>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              블룸 에너지는 독자적인 고체산화물(Solid Oxide) 기술을 통해 무중단 분산 전력 공급과 탄소 배출 없는 청정 그린 수소 시대를 선도합니다.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>한국 지사: 서울특별시 강남구 테헤란로 521 파르나스타워</p>
              <p>기술 문의: solution-kr@bloomenergy.com · 02-555-2026</p>
            </div>
          </div>

          {/* Quick Links: Platform */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              기술 소개
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('technology')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  SOFC 전기화학 발전 원리
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('technology')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  SOEC 고온 수전해 수소 생산
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('technology')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  블룸 에너지 서버 모듈 구조
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sustainability')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  무수(Waterless) 냉각 기술
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Solutions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              맞춤 솔루션
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  AI & 하이퍼스케일 데이터센터
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  반도체 & 첨단 제조(Fab)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  맞춤형 에너지 계산기 (Configurator)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('company')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  포춘 100 글로벌 도입 사례
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              자료 및 고객 지원
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('whitepapers')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  최신 기술 백서 라이브러리
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sustainability')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  ESG 지속가능성 리포트
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  엔지니어링 견적 제안 요청
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('company')}
                  className="hover:text-[#8CC63F] transition-colors cursor-pointer text-left"
                >
                  NASA 화성 프로젝트 연혁
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© 2026 Bloom Energy Corporation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">개인정보 처리방침</span>
            <span className="hover:text-slate-300 cursor-pointer">이용약관</span>
            <span className="hover:text-slate-300 cursor-pointer">글로벌 규격 인증 (ISO 9001 / CE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

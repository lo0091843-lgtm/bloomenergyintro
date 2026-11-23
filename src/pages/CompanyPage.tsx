import React from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Globe2, 
  Award, 
  Users, 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { PageId } from '../types';

interface CompanyPageProps {
  onNavigate: (page: PageId) => void;
  onOpenConsultation: () => void;
}

export const CompanyPage: React.FC<CompanyPageProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
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
          <span className="text-[#002D56] font-semibold">회사 소개</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <span className="text-xs font-bold text-[#8CC63F] bg-[#002D56] py-1 px-3 rounded-full uppercase tracking-wider">
              블룸 에너지 소개
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#002D56] mt-3 tracking-tight">
              화성 탐사에서 시작된 청정 에너지의 혁신
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              NASA의 화성 거주 산소 생산 프로젝트에서 탄생한 독보적인 고체산화물 기술로, 
              지구상의 모든 기업에게 독립적이고 지속 가능한 에너지를 공급합니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="px-4 py-2.5 bg-[#8CC63F] text-[#002D56] text-xs font-bold rounded-lg hover:bg-white border border-[#8CC63F] transition-colors cursor-pointer shadow-sm"
            >
              기업 협력 및 도입 문의
            </button>
          </div>
        </div>
      </div>

      {/* Story / Origin Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-[#001A33] text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8CC63F] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                <Rocket className="w-3.5 h-3.5" />
                <span>NASA 화성 탐사 프로젝트 기원</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                "화성에서 산소를 만들 수 있다면,<br />
                지구에서 가장 깨끗한 전기를 만들 수 있다."
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                블룸 에너지 창업자 KR Sridhar 박사는 NASA 아메스 연구센터에서 화성 대기의 이산화탄소를 분해해 산소와 연료를 만드는 연구를 지휘했습니다. 
                이 장치를 지구 환경에 맞게 역방향으로 작동시키면 화석연료 연소 없이 전기를 생산할 수 있다는 통찰에서 2001년 블룸 에너지가 탄생했습니다.
              </p>
              <div className="pt-2 flex items-center gap-6 text-xs text-slate-400 font-mono">
                <div>설립: <strong>2001년 (실리콘밸리)</strong></div>
                <div>본사: <strong>San Jose, California</strong></div>
                <div>상장: <strong>NYSE (BE)</strong></div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 rounded-2xl p-6 border border-white/10 text-center space-y-4">
              <div className="text-4xl sm:text-5xl font-black text-[#8CC63F] font-mono">1,000+</div>
              <div className="text-xs text-white font-semibold">글로벌 상용 사이트 구축 완료</div>
              <p className="text-[11px] text-slate-400 leading-normal">
                미국, 한국, 일본, 인도, 유럽 전역의 하이퍼스케일러 및 포춘 100 제조 라인에서 실증 운전 중
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footprint & Korean Partnership */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#002D56] bg-slate-100 py-1 px-3 rounded-full uppercase tracking-wider">
            글로벌 사업 현황 및 한국 파트너십
          </span>
          <h2 className="text-3xl font-bold text-[#002D56] mt-3">
            대한민국과 함께 만들어가는 수소 경제
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            블룸 에너지는 한국의 선도적 에너지 파트너들과 함께 아시아 최고 수준의 연료전지 생태계를 구축하고 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <Building2 className="w-8 h-8 text-[#002D56] mb-4" />
            <h3 className="text-lg font-bold text-[#002D56] mb-2">블룸에너지 코리아</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              국내 데이터센터, 병원, 산업 단지를 위한 맞춤형 엔지니어링 설계 및 24/7 실시간 원격 관제 서비스를 서울 본부에서 직접 제공합니다.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              위치: 서울시 강남구 테헤란로
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <Users className="w-8 h-8 text-[#8CC63F] mb-4" />
            <h3 className="text-lg font-bold text-[#002D56] mb-2">SK에코플랜트 전략적 합작</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              합작법인(블룸SK퓨얼셀)을 설립하여 경북 구미에 첨단 제조 공장을 완공하고, 고체산화물 연료전지 국산화와 부품 공급망을 육성하고 있습니다.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              구미 제조공장 연산 50MW+ 생산
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <Award className="w-8 h-8 text-[#00E5FF] mb-4" />
            <h3 className="text-lg font-bold text-[#002D56] mb-2">글로벌 최고 수준 품질 인증</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              한국가스안전공사(KGS) 설계단계검사 통과, UL 2200 안전 인증, ISO 9001 품질경영 인증을 획득하여 신뢰성을 공인받았습니다.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              KGS / UL / CE / ISO 인증 완비
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Summary Box */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#002D56]">블룸 에너지와 함께 미래 전력 인프라를 혁신하세요</h3>
            <p className="text-xs text-slate-600 mt-1">비즈니스 연속성과 탄소 중립을 위한 엔지니어링 컨설팅을 언제든지 환영합니다.</p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="px-6 py-3 bg-[#002D56] text-white font-bold rounded-xl text-xs hover:bg-[#001A33] transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>상담 및 기술 문의 접수</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8CC63F]" />
          </button>
        </div>
      </div>
    </div>
  );
};

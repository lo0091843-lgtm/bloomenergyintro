import React, { useState } from 'react';
import { 
  Leaf, 
  ArrowLeft, 
  Droplet, 
  Wind, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Sliders, 
  BarChart3,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { PageId } from '../types';

interface SustainabilityPageProps {
  onNavigate: (page: PageId) => void;
  onOpenWhitepaper: (id: string) => void;
  onOpenConsultation: () => void;
}

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({
  onNavigate,
  onOpenWhitepaper,
  onOpenConsultation,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);

  const roadmapMilestones = [
    {
      year: '2026 현행',
      title: '천연가스 및 바이오가스 기반 고효율 탈탄소',
      desc: '기존 석탄 복합화력 대비 즉각적인 CO₂ 50% 감축 및 NOx/SOx 유해 배출물 0% 실현. 바이오가스 직투입 시 탄소 네거티브 달성.',
      reduction: '50% 감축'
    },
    {
      year: '2028 계획',
      title: '수소 20~50% 혼소(Hydrogen Blending) 상용화',
      desc: '기존 도시가스 배관망에 그린/블루 수소를 최대 50% 혼소하여 하드웨어 부품 교체 없이 연료전지 운전.',
      reduction: '70% 감축'
    },
    {
      year: '2030 목표',
      title: '100% 그린 수소 완전 무탄소(Zero-Carbon) 발전',
      desc: '블룸 SOEC 수전해기와 연계하여 재생에너지 잉여 전력으로 생산된 그린 수소를 100% 연료로 사용하는 순환 생태계.',
      reduction: '100% 무탄소 (Net Zero)'
    }
  ];

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
          <span className="text-[#002D56] font-semibold">지속가능성</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <span className="text-xs font-bold text-[#8CC63F] bg-[#002D56] py-1 px-3 rounded-full uppercase tracking-wider">
              ESG 및 탄소중립 실현
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#002D56] mt-3 tracking-tight">
              지속 가능성을 향한 현실적인 탈탄소 로드맵
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              화석연료 연소에 의한 대기오염을 근본적으로 차단하고, 수자원 고갈 없이 깨끗한 에너지 전환을 달성하는 블룸 에너지의 환경적 약속입니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenWhitepaper('wp-esg-netzero-2026')}
              className="px-4 py-2.5 bg-[#002D56] text-white text-xs font-bold rounded-lg hover:bg-[#001A33] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-[#8CC63F]" />
              <span>ESG 탈탄소 백서</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillar Sustainability Stats */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Air Quality */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
              <Wind className="w-6 h-6 text-[#8CC63F]" />
            </div>
            <div className="text-xs font-bold text-[#002D56] uppercase tracking-wider mb-1">대기 환경 보호</div>
            <h3 className="text-2xl font-bold text-[#002D56] mb-3">대기 오염물질 0.00 ppm</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              연소가 전혀 발생하지 않는 전기화학 반응 방식으로 미세먼지(PM 2.5), 황산화물(SOx), 질소산화물(NOx) 배출을 원천적으로 차단합니다.
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-mono">
              대기배출시설 인허가 면제 및 규제 완화
            </div>
          </div>

          {/* Pillar 2: Zero Water Cooling */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-6">
              <Droplet className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <div className="text-xs font-bold text-[#002D56] uppercase tracking-wider mb-1">수자원 보호</div>
            <h3 className="text-2xl font-bold text-[#002D56] mb-3">냉각수 소모량 0 리터</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              화력발전소와 원자력은 1MWh 생산 시 수천 리터의 물을 증발시킵니다. 블룸 에너지는 공랭식 자립 순환으로 냉각수가 전혀 필요 없습니다.
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-mono">
              연간 수억 리터 산업용수 절감 효과
            </div>
          </div>

          {/* Pillar 3: Ultra Compact Footprint */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
              <Leaf className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-xs font-bold text-[#002D56] uppercase tracking-wider mb-1">토지 이용 효율</div>
            <h3 className="text-2xl font-bold text-[#002D56] mb-3">부지 면적 1/100 절약</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              동일 전력량 기준 태양광의 1%, 풍력의 0.1% 부지만으로 설치 가능하여 산림 훼손이나 자연 생태계 파괴 없이 도심 및 공장 부지에 직결됩니다.
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-mono">
              도심형 데이터센터 및 공장 옥상 설치 가능
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hydrogen Transition Roadmap */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-[#001A33] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#8CC63F] uppercase tracking-wider">
              탄소중립 3단계 전환 로드맵
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold mt-2">
              수소 시대를 여는 3단계 단계별 전환 로드맵
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              인프라가 갖춰지기 전에는 천연가스로 즉시 경제성을 확보하고, 수소 경제가 열리면 소프트웨어 제어만으로 100% 무탄소로 전환됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {roadmapMilestones.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMilestone(idx)}
                className={`p-6 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedMilestone === idx
                    ? 'bg-[#8CC63F] text-[#002D56] border-[#8CC63F] shadow-lg font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="text-xs uppercase tracking-wider font-mono opacity-80">{m.year}</div>
                <h4 className="text-base font-bold mt-1">{m.title}</h4>
                <div className={`mt-3 inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedMilestone === idx ? 'bg-[#002D56] text-[#8CC63F]' : 'bg-white/10 text-[#8CC63F]'
                }`}>
                  {m.reduction}
                </div>
              </button>
            ))}
          </div>

          {/* Active Milestone Explanation */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <strong className="text-white block mb-2 text-base">
              {roadmapMilestones[selectedMilestone].title}
            </strong>
            <p>{roadmapMilestones[selectedMilestone].desc}</p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#002D56]">귀사의 ESG 탄소 배출 감축 효과를 확인해 보세요</h3>
            <p className="text-xs text-slate-600 mt-1">블룸 솔루션 계산기에서 전력 용량별 연간 CO₂ 감축 톤수를 실시간으로 계산해 드립니다.</p>
          </div>
          <button
            onClick={() => onNavigate('solutions')}
            className="px-6 py-3 bg-[#002D56] text-white font-bold rounded-xl text-xs hover:bg-[#001A33] transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#8CC63F]" />
            <span>탄소 절감 시뮬레이터 실행</span>
          </button>
        </div>
      </div>
    </div>
  );
};

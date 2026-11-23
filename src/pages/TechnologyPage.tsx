import React, { useState } from 'react';
import { 
  Zap, 
  ArrowLeft, 
  Layers, 
  Flame, 
  ShieldCheck, 
  Download, 
  Sliders, 
  ArrowRight,
  Sparkles,
  Thermometer,
  Activity,
  Check
} from 'lucide-react';
import { PageId } from '../types';
import { TECH_SPECS } from '../data/bloomData';

interface TechnologyPageProps {
  onNavigate: (page: PageId) => void;
  onOpenWhitepaper: (id: string) => void;
  onOpenConsultation: () => void;
}

export const TechnologyPage: React.FC<TechnologyPageProps> = ({
  onNavigate,
  onOpenWhitepaper,
  onOpenConsultation,
}) => {
  // Interactive Exploded Stack Layer selector
  const [selectedLayer, setSelectedLayer] = useState<number>(1);

  const layers = [
    {
      id: 0,
      name: '연료극 (Anode)',
      material: 'Ni-YSZ 서멧 (Cermet)',
      function: '수소와 일산화탄소가 산소 이온과 결합하여 물과 전자를 방출',
      reaction: 'H₂ + O²⁻ → H₂O + 2e⁻  /  CO + O²⁻ → CO₂ + 2e⁻',
      temperature: '800°C',
      thickness: '500 μm (지지체)'
    },
    {
      id: 1,
      name: '고체산화물 전해질 (Solid Oxide Electrolyte)',
      material: 'YSZ (이트리아 안정화 지르코니아)',
      function: '전자 이동은 차단하고 산소 이온(O²⁻)만을 선택적으로 고속 통과시키는 초치밀 세라믹 박막',
      reaction: 'O²⁻ 이온 선택적 격자 전도 (Ionic Conduction)',
      temperature: '800°C',
      thickness: '10 μm (초박막 세라믹)'
    },
    {
      id: 2,
      name: '공기극 (Cathode)',
      material: 'LSM / LSCF 페로브스카이트 산화물',
      function: '대기 중의 산소 분자(O₂)를 환원시켜 2가 음이온 산소(O²⁻)로 변환',
      reaction: '½ O₂ + 2e⁻ → O²⁻',
      temperature: '800°C',
      thickness: '30 μm'
    },
    {
      id: 3,
      name: '인터커넥터 및 집전체 (Interconnect)',
      material: '특수 페라이트계 고온 스테인리스 합금',
      function: '개별 단전지들을 직렬 연결하고 수소와 공기가 섞이지 않도록 가스 유로(Channel) 형성',
      reaction: '단전지 직렬 전압 승압 (DC 48V ~ 800V 스택 모듈화)',
      temperature: '800°C 내산화성 코팅',
      thickness: '2.5 mm'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Top Breadcrumb & Page Kicker */}
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
          <span className="text-[#002D56] font-semibold">기술 소개</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <span className="text-xs font-bold text-[#8CC63F] bg-[#002D56] py-1 px-3 rounded-full uppercase tracking-wider">
              핵심 아키텍처 및 전기화학 원리
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#002D56] mt-3 tracking-tight">
              고체산화물(Solid Oxide) 기술 심층 분석
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              화석연료를 태우지 않고 화학 에너지를 전기로 직접 변환하는 원리와, 
              하나의 셀에서 시작하여 수십 메가와트(MW)로 확장되는 모듈식 아키텍처를 소개합니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenWhitepaper('wp-flagship-2026')}
              className="px-4 py-2.5 bg-[#002D56] text-white text-xs font-bold rounded-lg hover:bg-[#001A33] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-[#8CC63F]" />
              <span>기술 백서 PDF</span>
            </button>
            <button
              onClick={() => onNavigate('solutions')}
              className="px-4 py-2.5 bg-[#8CC63F] text-[#002D56] text-xs font-bold rounded-lg hover:bg-[#7db435] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sliders className="w-4 h-4" />
              <span>솔루션 설계 연계</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Exploded View / Stack Layer Explorer */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-[#001A33] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8CC63F] uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>단전지 스택 분해 탐색기</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                고체산화물 연료전지 단전지(Unit Cell) 레이어 구조
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              작동 온도: 800°C · 전해질 두께: ~10μm
            </div>
          </div>

          {/* Interactive Layer Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedLayer === layer.id
                    ? 'bg-[#8CC63F] text-[#002D56] border-[#8CC63F] shadow-lg font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">계층 0{layer.id + 1}</div>
                <div className="text-xs sm:text-sm font-semibold truncate mt-0.5">{layer.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          {/* Layer Detail Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            {/* Visual Diagram Layer Simulation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-2 p-6 bg-slate-900/60 rounded-xl border border-white/10 text-center">
              <div className={`w-full py-3 px-4 rounded-lg border text-xs font-mono transition-all ${
                selectedLayer === 0 ? 'bg-[#8CC63F] text-[#002D56] font-bold border-[#8CC63F] scale-105' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                [연료극 Anode] 연료 유입 (H₂, CH₄, Biogas)
              </div>
              <div className="h-4 w-1 tech-line-cyan"></div>
              <div className={`w-full py-4 px-4 rounded-lg border text-xs font-mono transition-all ${
                selectedLayer === 1 ? 'bg-[#00E5FF] text-[#002D56] font-bold border-[#00E5FF] scale-105 shadow-md shadow-[#00E5FF]/20' : 'bg-slate-800/80 text-slate-200 border-slate-700'
              }`}>
                [고체산화물 전해질 Electrolyte] O²⁻ 이온 이동 통로
              </div>
              <div className="h-4 w-1 tech-line-cyan"></div>
              <div className={`w-full py-3 px-4 rounded-lg border text-xs font-mono transition-all ${
                selectedLayer === 2 ? 'bg-[#8CC63F] text-[#002D56] font-bold border-[#8CC63F] scale-105' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                [공기극 Cathode] 산소 분자 환원 (Air Input)
              </div>
              <div className="h-4 w-1 tech-line"></div>
              <div className={`w-full py-2.5 px-4 rounded-lg border text-xs font-mono transition-all ${
                selectedLayer === 3 ? 'bg-amber-400 text-[#002D56] font-bold border-amber-400 scale-105' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                [인터커넥터 Interconnect] 스택 직렬 집전판
              </div>
            </div>

            {/* Layer Details Text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#8CC63F]/20 text-[#8CC63F] text-xs font-mono font-bold">
                  계층 0{layers[selectedLayer].id + 1}
                </span>
                <h3 className="text-2xl font-bold text-white">{layers[selectedLayer].name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-400 block text-[11px]">핵심 소재:</span>
                  <span className="text-white font-semibold">{layers[selectedLayer].material}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">설계 두께:</span>
                  <span className="text-white font-semibold">{layers[selectedLayer].thickness}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">운전 온도:</span>
                  <span className="text-[#8CC63F] font-semibold">{layers[selectedLayer].temperature}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">전기화학 반응식:</span>
                  <span className="text-[#00E5FF] font-semibold">{layers[selectedLayer].reaction}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {layers[selectedLayer].function}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-[#8CC63F]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>백금(Pt) 등 귀금속 촉매를 전혀 사용하지 않는 친환경 세라믹 기술</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Technology Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#002D56] bg-slate-100 py-1 px-3 rounded-full uppercase tracking-wider">
            발전 방식별 성능 비교
          </span>
          <h2 className="text-3xl font-bold text-[#002D56] mt-3">
            기존 발전 및 경쟁 기술과의 기술 스펙 비교
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            화석연료 연소 기반 터빈 및 저온 수소연료전지 대비 고체산화물 연료전지의 우위를 확인하세요.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#002D56] text-white">
                <th className="p-4 font-semibold">비교 항목</th>
                <th className="p-4 font-bold text-[#8CC63F] bg-[#001A33] border-x border-[#8CC63F]/30">
                  블룸 에너지 SOFC (추천)
                </th>
                <th className="p-4 font-semibold text-slate-300">가스터빈 (Gas Turbine)</th>
                <th className="p-4 font-semibold text-slate-300">저온 수소전지 (PEMFC)</th>
                <th className="p-4 font-semibold text-slate-300">디젤 비상 발전기</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {TECH_SPECS.map((spec, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800 bg-slate-50/50">
                    {spec.feature}
                  </td>
                  <td className="p-4 font-bold text-[#002D56] bg-emerald-50/40 border-x border-emerald-100">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#8CC63F] shrink-0" />
                      <span>{spec.bloomSOFC}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{spec.gasTurbine}</td>
                  <td className="p-4 text-slate-600">{spec.pemFC}</td>
                  <td className="p-4 text-slate-600">{spec.dieselGen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Modular Scale Architecture (스택 -> 모듈 -> 시스템) */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002D56]">
              모듈형 빌딩 블록(Building Block) 아키텍처
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              손바닥만 한 세라믹 셀이 스택이 되고, 모듈이 되어 100MW+ 규모의 데이터센터 전력망까지 단일 규격으로 무한 확장됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs font-bold text-[#8CC63F] mb-1">1단계</div>
              <h4 className="text-lg font-bold text-[#002D56] mb-2">세라믹 셀 (Cell)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                모래(Sand)에서 추출한 무독성 지르코니아 세라믹 기판에 잉크 형태의 촉매를 도포한 기본 단위
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                출력: 약 25W / cell
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs font-bold text-[#8CC63F] mb-1">2단계</div>
              <h4 className="text-lg font-bold text-[#002D56] mb-2">스택 (Cell Stack)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                셀들을 직렬 적층하여 집전체와 가스 유로를 밀봉한 고체산화물 발전 코어 팩
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                출력: 약 50kW / stack
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs font-bold text-[#8CC63F] mb-1">3단계</div>
              <h4 className="text-lg font-bold text-[#002D56] mb-2">에너지 서버 모듈</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                스택과 전력 변환기(인버터), 연료 전처리 시스템이 통합된 표준화 컨테이너
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                출력: 300kW ~ 500kW / unit
              </div>
            </div>

            <div className="bg-[#002D56] text-white p-6 rounded-2xl border border-[#8CC63F] shadow-sm text-center">
              <div className="text-xs font-bold text-[#8CC63F] mb-1">4단계 (전력망 연계)</div>
              <h4 className="text-lg font-bold text-white mb-2">마이크로그리드</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                단일 제어 소프트웨어로 연동되어 무정전 병렬 운전되는 메가와트(MW)급 발전소
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-[#8CC63F]">
                출력: 1MW ~ 100MW+ 확장
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action bar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="p-8 bg-[#002D56] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">귀사의 설비에 맞는 발전 용량을 산출해 보세요</h3>
            <p className="text-xs text-slate-300 mt-1">온라인 계산기로 부지 면적, 절감액 및 탄소 감축량을 1분 만에 확인하실 수 있습니다.</p>
          </div>
          <button
            onClick={() => onNavigate('solutions')}
            className="px-6 py-3 bg-[#8CC63F] text-[#002D56] font-bold rounded-xl text-xs hover:bg-white transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#002D56]" />
            <span>맞춤형 에너지 계산기 바로가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

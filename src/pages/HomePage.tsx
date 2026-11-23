import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Leaf, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Server, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  Sliders, 
  ChevronRight,
  Database,
  Cpu,
  HeartPulse,
  Truck
} from 'lucide-react';
import { PageId } from '../types';
import { INDUSTRY_SOLUTIONS } from '../data/bloomData';
import { BloomServer3DViewer } from '../components/three/BloomServer3DViewer';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenWhitepaper: (id: string) => void;
  onOpenConsultation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenWhitepaper,
  onOpenConsultation,
}) => {
  // Quick Tab state for Industry Case Studies (from Proposal Action Item)
  const [activeTabId, setActiveTabId] = useState('datacenter');
  
  // Interactive Live Counter state
  const [powerCounter, setPowerCounter] = useState(0);
  const [carbonCounter, setCarbonCounter] = useState(0);

  useEffect(() => {
    // Smooth animated counter increment on mount
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const powerTarget = 25480;
    const carbonTarget = 10420500;
    const powerInc = powerTarget / steps;
    const carbonInc = carbonTarget / steps;

    const timer = setInterval(() => {
      start++;
      setPowerCounter(Math.min(powerTarget, Math.floor(powerInc * start)));
      setCarbonCounter(Math.min(carbonTarget, Math.floor(carbonInc * start)));
      if (start >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const activeSolution = INDUSTRY_SOLUTIONS.find((s) => s.id === activeTabId) || INDUSTRY_SOLUTIONS[0];

  const getIndustryIcon = (id: string) => {
    switch (id) {
      case 'datacenter': return <Database className="w-5 h-5" />;
      case 'semiconductor': return <Cpu className="w-5 h-5" />;
      case 'hospital': return <HeartPulse className="w-5 h-5" />;
      case 'logistics': return <Truck className="w-5 h-5" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#001A33]">
        {/* Glow and particle background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#8CC63F]/15 blur-[120px] animate-float-slow"></div>
          <div className="absolute bottom-10 -right-20 w-[600px] h-[600px] rounded-full bg-[#00E5FF]/15 blur-[130px] animate-float-reverse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#002D56]/80 blur-[100px]"></div>
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.07]" 
            style={{ 
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
              backgroundSize: '48px 48px' 
            }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Hero Top Kicker */}
          <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full border border-[#8CC63F]/40 bg-[#002D56]/60 text-[#8CC63F] text-xs font-semibold tracking-wider mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#8CC63F]"></span>
            <span>미래를 대비하는 완벽한 전력 · 차세대 청정 에너지</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.15] mb-8 tracking-tight text-white">
            에너지의 한계를 넘다,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#8CC63F]">
              중단 없는 혁신의 시작
            </span>
          </h1>

          {/* Sub Copy */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
            전 세계 최고 수준의 효율을 자랑하는 고체산화물 연료전지(SOFC) 기술.<br className="hidden md:block" />
            귀사의 비즈니스에 완벽한 에너지 독립과 무탄소 청정 미래를 동시에 선사합니다.
          </p>

          {/* Dual CTAs (Clicking initiates actual page transitions) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('solutions')}
              className="w-full sm:w-auto px-8 py-4 bg-[#8CC63F] text-[#002D56] font-bold rounded-xl hover:bg-white hover:shadow-[0_0_25px_rgba(140,198,63,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer text-sm"
            >
              <Sliders className="w-4 h-4 text-[#002D56]" />
              <span>맞춤형 에너지 솔루션 설계하기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenWhitepaper('wp-flagship-2026')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 hover:border-[#8CC63F] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm backdrop-blur-sm"
            >
              <Download className="w-4 h-4 text-[#8CC63F]" />
              <span>최신 기술 백서 다운로드 (2026)</span>
            </button>
          </div>

          {/* Quick Metrics Bar below Hero */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <div className="text-slate-400 text-xs">전기 발전 효율 (단독)</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-1">60%+</div>
              <div className="text-[11px] text-[#8CC63F]">업계 최고 수준 (LHV)</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">상시 전력 가동률</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-1">99.999%</div>
              <div className="text-[11px] text-[#8CC63F]">무정전 마이크로그리드</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">냉각수 소모량</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-1">0 L</div>
              <div className="text-[11px] text-[#8CC63F]">무수(Waterless) 설계</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">유해물질(NOx/SOx)</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-1">0.00 ppm</div>
              <div className="text-[11px] text-[#8CC63F]">무연소 전기화학</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Technical Principles */}
      <section className="py-24 bg-white relative border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3.5 rounded-full border border-[#002D56]/15 text-[#002D56] text-xs font-bold tracking-wider mb-3 bg-slate-50">
              핵심 기술 원리
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#002D56] tracking-tight">
              연소 없는 혁신, 전기화학 반응의 원리
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              블룸 에너지의 고체산화물 기술은 연료를 태우는(Combustion) 과거의 방식이 아닙니다.<br className="hidden sm:block" />
              연료와 산소가 화학적으로 직접 결합하여 전기를 생산하는 가장 진보된 발전 시스템입니다.
            </p>
          </div>

          {/* Side-by-Side Technical Principles & Interactive 16:9 3D Exploded Cutaway */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            {/* Left Column: Technical Principles (3-Step Electrochemical Process) */}
            <div className="lg:col-span-5 relative bg-[#F8F9FA] rounded-3xl p-6 sm:p-7 border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#002D56 1.5px, transparent 1.5px)',
                  backgroundSize: '32px 32px',
                }}
              ></div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-[11px] font-bold text-[#8CC63F] uppercase tracking-wider">
                      전기화학 발전 메커니즘
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#002D56] mt-0.5">
                      서버 내부 작동 3단계
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">800°C 무연소</span>
                </div>

                {/* Compact 3-Step Flow beside the 16:9 3D Cutaway */}
                <div className="space-y-3">
                  {/* Step 1: Fuel Input */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#8CC63F] transition-all flex items-start gap-3.5">
                    <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 text-[#002D56]">
                      <Flame className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#8CC63F] uppercase tracking-wider">
                        1단계: 연료 공급
                      </div>
                      <h4 className="text-sm font-bold text-[#002D56] mt-0.5">유연한 연료 공급 및 내부 개질</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        천연가스·바이오가스·수소가 하단 매니폴드를 거쳐 세라믹 스택 음극으로 유입됩니다.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Reaction Core */}
                  <div className="bg-[#002D56] text-white p-4 rounded-2xl border-2 border-[#00E5FF]/60 shadow-md flex items-start gap-3.5">
                    <div className="w-10 h-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-[#00E5FF]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider">
                        2단계 (세라믹 스택 반응)
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">산소 이온(O²⁻) 투과 및 DC 전력 생산</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                        발광 시안 입자는 800°C 세라믹 층을 투과하는 산소 이온(O²⁻)을, 앰버 골드 라인은 외부 회로의 청정 DC 전력 흐름을 시각화합니다.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Clean Output */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#8CC63F] transition-all flex items-start gap-3.5">
                    <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 text-[#8CC63F]">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#8CC63F] uppercase tracking-wider">
                        3단계: 청정 배출
                      </div>
                      <h4 className="text-sm font-bold text-[#002D56] mt-0.5">상단 루버 배기구 무공해 배출</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        NOx/SOx·초미세먼지 없이 순수 수증기와 회수 가능한 고온 열만 상단 루버로 배출됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hardware Design & Action Footer */}
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  분해 뷰 슬라이더로 내부 스택과 회로를 직접 확인하세요.
                </div>
                <button
                  onClick={() => onNavigate('technology')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#002D56] text-white rounded-lg text-xs font-bold hover:bg-[#001A33] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span>기술 상세</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8CC63F]" />
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 16:9 3D Exploded Cutaway Viewer */}
            <div className="lg:col-span-7 flex flex-col">
              <BloomServer3DViewer className="w-full" />
            </div>
          </div>

          {/* Dual Detailed Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002D56] uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4 text-[#8CC63F]" />
                <span>SOFC (발전 플랫폼)</span>
              </div>
              <h3 className="text-xl font-bold text-[#002D56] mb-3">
                최고 수준의 발전 효율 (단독 60%+, 열병합 90%)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                블룸 에너지 발전 시스템은 화학 에너지를 터빈의 기계적 회전 과정 없이 직접 전기로 변환합니다. 기존 화력발전소 대비 높은 전기 효율과 함께, 송배전 손실이 없는 온사이트 전력망을 완성합니다.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                  <span>송배전 손실 제로 (공장 및 데이터센터 내 직결)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                  <span>회전 마모 부품 최소화로 20년 이상의 시스템 수명</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002D56] uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4 text-[#00E5FF]" />
                <span>SOEC (수소 생산 플랫폼)</span>
              </div>
              <h3 className="text-xl font-bold text-[#002D56] mb-3">
                가역적 수소 생산 기술 (전력 소모 45% 절감)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                블룸의 고체산화물 플랫폼은 역방향 가역 반응을 지원합니다. 고온 수증기와 신재생 잉여 전력을 주입하면, 물을 분해하여 그린 수소를 고효율로 생산하는 SOEC 시스템으로 전환됩니다.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                  <span>기존 저온 수전해(PEM/ALK) 대비 최대 45% 전력 절감</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                  <span>원자력 및 산업 폐열과 결합 시 LCOH 극대화</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Core Innovation (3대 혁신 가치) */}
      <section className="py-24 bg-[#F8F9FA] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#002D56]">
              블룸 에너지의 3대 혁신 가치
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              어떤 환경에서도 타협하지 않는 압도적인 비즈니스 연속성과 경제성
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="glass-card-light rounded-2xl p-8 bg-white border border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-[#002D56]/5 text-[#8CC63F] flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#8CC63F]" />
              </div>
              <h3 className="text-xl font-bold text-[#002D56] mb-1">Always-On</h3>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">무중단 전력 공급</div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                99.999% 이상의 압도적인 가동률. 기상 이변이나 외부 전력망 셧다운에도 흔들림 없는 독립 마이크로그리드로 미션 크리티컬 업무를 보호합니다.
              </p>
              <button
                onClick={() => onNavigate('solutions')}
                className="text-xs font-bold text-[#002D56] hover:text-[#8CC63F] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>마이크로그리드 구성 사례 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="glass-card-light rounded-2xl p-8 bg-white border border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-[#002D56]/5 text-[#8CC63F] flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-[#8CC63F]" />
              </div>
              <h3 className="text-xl font-bold text-[#002D56] mb-1">Zero Emission Path</h3>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">탄소 중립 실현</div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                화석연료 연소 과정이 없는 전기화학 반응을 통해 획기적인 CO2 절감은 물론, 유해 가스(NOx, SOx, 미세먼지)를 전혀 배출하지 않습니다.
              </p>
              <button
                onClick={() => onNavigate('sustainability')}
                className="text-xs font-bold text-[#002D56] hover:text-[#8CC63F] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>ESG 탄소중립 리포트 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="glass-card-light rounded-2xl p-8 bg-white border border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-[#002D56]/5 text-[#8CC63F] flex items-center justify-center mb-6">
                <Flame className="w-8 h-8 text-[#8CC63F]" />
              </div>
              <h3 className="text-xl font-bold text-[#002D56] mb-1">Fuel Flexibility</h3>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">자유로운 연료 전환</div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                천연가스부터 바이오가스, 그리고 미래의 100% 순수 수소까지 하드웨어 전면 교체 없이 소프트웨어 및 튜닝으로 전환 가능한 지속 가능한 자산입니다.
              </p>
              <button
                onClick={() => onNavigate('technology')}
                className="text-xs font-bold text-[#002D56] hover:text-[#8CC63F] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>수소 연료 호환성 검증서 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION (From Proposal Action Item): Quick Tab - '산업별 맞춤 사례 보기' */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8CC63F] bg-[#002D56] py-1 px-3 rounded-full">
                산업별 주요 적용 사례
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#002D56] mt-3">
                산업별 맞춤 솔루션 및 적용 사례
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                기획안 피드백을 반영하여 주요 산업군별 도입 효과와 전력 공급 모델을 바로 확인하실 수 있습니다.
              </p>
            </div>

            {/* Quick Segmented Tabs */}
            <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-xl overflow-x-auto shrink-0 border border-slate-200">
              {INDUSTRY_SOLUTIONS.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setActiveTabId(industry.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTabId === industry.id
                      ? 'bg-[#002D56] text-[#8CC63F] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {getIndustryIcon(industry.id)}
                  <span>{industry.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-[#002D56] text-[#8CC63F]">
                    {getIndustryIcon(activeSolution.id)}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-[#002D56]">{activeSolution.name}</h3>
                    <div className="text-xs text-slate-500 font-mono">{activeSolution.englishName}</div>
                  </div>
                </div>

                <p className="text-base text-slate-800 font-medium leading-relaxed">
                  "{activeSolution.tagline}"
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeSolution.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeSolution.keyBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onNavigate('solutions')}
                    className="px-6 py-3 bg-[#002D56] text-white text-xs font-bold rounded-xl hover:bg-[#001A33] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>이 분야 맞춤형 에너지 계산기 실행</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8CC63F]" />
                  </button>

                  <button
                    onClick={onOpenConsultation}
                    className="px-5 py-3 border border-slate-300 bg-white text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    전담 엔지니어 도입 상담
                  </button>
                </div>
              </div>

              {/* Stat & Proof Panel */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {activeSolution.statLabel}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-[#002D56] mt-1 tracking-tight">
                    {activeSolution.statNumber}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">권장 설치 용량:</span>
                    <span className="font-bold text-[#002D56]">{activeSolution.recommendedCapacity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">지원 연료:</span>
                    <span className="font-bold text-[#002D56]">{activeSolution.fuelType}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-slate-500 block mb-1">실증 레퍼런스:</span>
                    <span className="font-semibold text-slate-800 bg-slate-50 p-2 rounded-lg block border border-slate-100">
                      {activeSolution.clientExample}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Proven Trust & Data (신뢰성 증명 & 실시간 롤링 카운터) */}
      <section className="py-24 bg-[#001A33] text-white border-t border-b border-[#002D56]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-xs font-bold text-[#8CC63F] uppercase tracking-wider mb-2 block">
                검증된 신뢰성과 글로벌 리더십
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
                숫자로 증명된<br />
                글로벌 에너지 리더십
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                전 세계 1GW 이상의 누적 설치 실적과 주요 글로벌 기업들이 이미 블룸 에너지와 함께 무중단 탄소 중립을 실현하고 있습니다.
              </p>
            </div>

            {/* Rolling Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border-l-4 border-[#8CC63F] rounded-r-2xl backdrop-blur-sm">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  누적 생산 전력량 (TWh)
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white flex items-baseline font-mono tabular-nums">
                  <span>{powerCounter.toLocaleString()}</span>
                  <span className="text-[#8CC63F] text-2xl ml-1">+</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">전 세계 1,000+ 프로젝트 집계</div>
              </div>

              <div className="p-6 bg-white/5 border-l-4 border-[#8CC63F] rounded-r-2xl backdrop-blur-sm">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  절감된 탄소 배출량 (Metric Tons)
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white flex items-baseline font-mono tabular-nums">
                  <span>{carbonCounter.toLocaleString()}</span>
                  <span className="text-[#8CC63F] text-2xl ml-1">+</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">석탄 전력망 대비 순 감축량</div>
              </div>
            </div>
          </div>

          {/* Trusted by Global Fortune 100 Companies */}
          <div>
            <p className="text-center text-xs text-slate-400 font-semibold tracking-widest uppercase mb-8">
              포춘 100대 글로벌 기업 및 하이퍼스케일러의 선택
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-70 hover:opacity-100 transition-opacity">
              <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 font-bold text-sm tracking-tight">
                <Database className="w-5 h-5 text-[#8CC63F]" /> EQUINIX DATA
              </div>
              <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 font-bold text-sm tracking-tight">
                <Cpu className="w-5 h-5 text-[#8CC63F]" /> INTEL FAB
              </div>
              <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 font-bold text-sm tracking-tight">
                <Server className="w-5 h-5 text-[#8CC63F]" /> SK ECOPLANT
              </div>
              <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 font-bold text-sm tracking-tight">
                <HeartPulse className="w-5 h-5 text-[#8CC63F]" /> KAISER PERMANENTE
              </div>
              <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 font-bold text-sm tracking-tight">
                <ShieldCheck className="w-5 h-5 text-[#8CC63F]" /> FEDEX FREIGHT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: The Next Frontier: Hydrogen */}
      <section className="py-24 bg-white text-[#002D56]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-16">
            <div className="md:w-1/2 space-y-6">
              <span className="inline-block py-1 px-3.5 rounded-full border border-[#002D56]/20 text-[#002D56] text-xs font-bold tracking-wider bg-slate-50">
                수소 경제 · 차세대 SOEC 기술
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
                가장 깨끗한 수소를<br />
                가장 경제적으로 생산하다.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                블룸 에너지의 차세대 고체산화물 수전해(SOEC) 기술은 고온 스팀의 잠열을 활용하여 
                기존 상용 수전해 방식 대비 전력 소모를 <strong>최대 45%</strong> 절감합니다. 
                그린 수소 1kg 생산 비용을 획기적으로 낮추어 현실적인 수소 경제를 앞당깁니다.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenWhitepaper('wp-soec-hydrogen-2026')}
                  className="px-6 py-3.5 bg-[#002D56] text-white rounded-xl text-xs font-bold hover:bg-[#001A33] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#8CC63F]" />
                  <span>수전해(SOEC) 기술 백서 다운로드</span>
                </button>

                <button
                  onClick={() => onNavigate('technology')}
                  className="px-6 py-3.5 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>수소 생산 원리 상세 보기</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8CC63F]" />
                </button>
              </div>
            </div>

            {/* Dynamic Comparison Chart */}
            <div className="md:w-1/2 w-full">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-bold text-[#002D56] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#8CC63F]" />
                    수소 1kg 생산 당 소요 전력량 비교 (kWh / kg H2)
                  </h4>
                </div>

                <div className="flex justify-between items-end h-56 gap-3 mb-4 pt-6 border-b border-slate-200">
                  {/* Legacy ALK */}
                  <div className="flex-1 bg-slate-300 rounded-t-lg h-[95%] flex flex-col justify-between items-center p-2 text-center">
                    <span className="text-[11px] font-bold text-slate-700 font-mono">55 kWh</span>
                    <span className="text-[10px] text-slate-600 font-medium">기준(100%)</span>
                  </div>

                  {/* Legacy PEM */}
                  <div className="flex-1 bg-slate-400 rounded-t-lg h-[85%] flex flex-col justify-between items-center p-2 text-center text-white">
                    <span className="text-[11px] font-bold font-mono">50 kWh</span>
                    <span className="text-[10px] font-medium">91%</span>
                  </div>

                  {/* Standard SOEC */}
                  <div className="flex-1 bg-[#002D56]/60 rounded-t-lg h-[65%] flex flex-col justify-between items-center p-2 text-center text-white">
                    <span className="text-[11px] font-bold font-mono">42 kWh</span>
                    <span className="text-[10px] font-medium">76%</span>
                  </div>

                  {/* Bloom SOEC (Hero Bar) */}
                  <div className="flex-1 bg-[#8CC63F] rounded-t-lg h-[45%] flex flex-col justify-between items-center p-2 text-center text-[#002D56] shadow-lg shadow-[#8CC63F]/30 ring-2 ring-[#8CC63F]">
                    <span className="text-[12px] font-black font-mono">37.5 kWh</span>
                    <span className="text-[10px] font-bold bg-[#002D56] text-[#8CC63F] px-1.5 py-0.5 rounded">
                      45% 절감!
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-bold text-slate-500 px-1">
                  <span className="flex-1 text-center">알칼라인(ALK)</span>
                  <span className="flex-1 text-center">양극재(PEM)</span>
                  <span className="flex-1 text-center">일반 SOEC</span>
                  <span className="flex-1 text-center text-[#002D56] font-bold">블룸 SOEC</span>
                </div>

                <p className="text-center text-[11px] text-slate-400 mt-5">
                  * 상용 100°C 스팀 열원 연계 기준 시뮬레이션 및 국가 인증 시험 데이터
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Bottom Call to Action */}
      <section className="py-20 bg-[#002D56] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            지금 바로 귀사의 맞춤형 분산 전력을 설계하세요
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            원하는 발전 용량과 설치 부지만 입력하면 즉시 예상 발전량, 탄소 절감 효과 및 초기 투자 회수 기간을 시뮬레이션할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('solutions')}
              className="px-8 py-4 bg-[#8CC63F] text-[#002D56] font-bold rounded-xl hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg text-sm"
            >
              <Sliders className="w-4 h-4 text-[#002D56]" />
              <span>온라인 솔루션 계산기 실행하기</span>
            </button>
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors duration-200 cursor-pointer text-sm"
            >
              기술 엔지니어 상담 신청
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

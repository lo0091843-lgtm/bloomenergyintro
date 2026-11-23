import React, { useState } from 'react';
import { 
  Sliders, 
  ArrowLeft, 
  Zap, 
  Leaf, 
  ShieldCheck, 
  Send, 
  FileText, 
  CheckCircle2, 
  Database, 
  Cpu, 
  HeartPulse, 
  Truck, 
  Building2,
  TrendingDown,
  Clock,
  Sparkles
} from 'lucide-react';
import { PageId } from '../types';
import { INDUSTRY_SOLUTIONS } from '../data/bloomData';

interface SolutionsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenConsultationWithParams: (industry: string, capacity: number) => void;
  onOpenWhitepaper: (id: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  onNavigate,
  onOpenConsultationWithParams,
  onOpenWhitepaper,
}) => {
  // Configurator state
  const [selectedIndustry, setSelectedIndustry] = useState<string>('AI & 하이퍼스케일 데이터센터');
  const [powerCapacity, setPowerCapacity] = useState<number>(10); // in MW
  const [fuelType, setFuelType] = useState<'natural_gas' | 'blend_20' | 'pure_h2' | 'biogas'>('natural_gas');
  const [enableHeatRecovery, setEnableHeatRecovery] = useState<boolean>(true);
  const [gridMode, setGridMode] = useState<'mission_critical' | 'island_mode' | 'standard'>('mission_critical');

  // Real-time calculations
  const annualMWh = Math.round(powerCapacity * 8760 * 0.95); // 95% capacity factor
  
  // Carbon savings calculation based on fuel and capacity
  let carbonReductionFactor = 0.45; // baseline natural gas SOFC vs coal grid
  if (fuelType === 'blend_20') carbonReductionFactor = 0.58;
  if (fuelType === 'biogas') carbonReductionFactor = 0.90;
  if (fuelType === 'pure_h2') carbonReductionFactor = 1.0;

  const co2SavingsTons = Math.round(annualMWh * 0.45 * carbonReductionFactor);
  
  // Land footprint savings (1MW SOFC occupies ~120m² vs ~15,000m² solar)
  const footprintSavedM2 = Math.round(powerCapacity * 14800);

  // Financial estimated savings
  const estimatedSavingsPercent = enableHeatRecovery ? 35 : 24;

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
          <span className="text-[#002D56] font-semibold">맞춤 솔루션 및 설계기</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <span className="text-xs font-bold text-[#8CC63F] bg-[#002D56] py-1 px-3 rounded-full uppercase tracking-wider">
              맞춤형 에너지 솔루션 시뮬레이터
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#002D56] mt-3 tracking-tight">
              맞춤형 에너지 솔루션 설계기
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              산업군과 필요 전력 용량, 연료 환경을 설정하면 즉시 연간 발전량, 탄소 절감 효과 및 부지 절감 면적을 시뮬레이션할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenWhitepaper('wp-datacenter-ai-2026')}
              className="px-4 py-2.5 bg-slate-100 text-[#002D56] text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#002D56]" />
              <span>데이터센터 설계 백서</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Configurator Applet */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-[#F8F9FA] rounded-3xl border border-slate-300 p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Controls Column (Form parameters) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Industry */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <label className="block text-xs font-bold text-[#002D56] uppercase tracking-wider mb-3">
                  01. 대상 산업 분야 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { name: 'AI & 하이퍼스케일 데이터센터', icon: <Database className="w-4 h-4" /> },
                    { name: '첨단 반도체 & Fab', icon: <Cpu className="w-4 h-4" /> },
                    { name: '종합병원 & 바이오', icon: <HeartPulse className="w-4 h-4" /> },
                    { name: '스마트 물류 & 항만', icon: <Truck className="w-4 h-4" /> },
                    { name: '상업 빌딩 & 스마트 캠퍼스', icon: <Building2 className="w-4 h-4" /> }
                  ].map((ind) => (
                    <button
                      key={ind.name}
                      onClick={() => setSelectedIndustry(ind.name)}
                      className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between gap-2 cursor-pointer ${
                        selectedIndustry === ind.name
                          ? 'bg-[#002D56] text-white border-[#002D56] shadow-sm font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={selectedIndustry === ind.name ? 'text-[#8CC63F]' : 'text-slate-500'}>
                        {ind.icon}
                      </div>
                      <span className="leading-tight">{ind.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Capacity Slider */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#002D56] uppercase tracking-wider">
                    02. 필요 전력 용량 (Capacity)
                  </label>
                  <div className="text-xl font-bold font-mono text-[#002D56] bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                    {powerCapacity} <span className="text-xs font-normal text-slate-500">MW</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={powerCapacity}
                  onChange={(e) => setPowerCapacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8CC63F] my-4"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0.5 MW (소형)</span>
                  <span>10 MW (표준 팹/데이터센터)</span>
                  <span>25 MW</span>
                  <span>50 MW (대형 클러스터)</span>
                </div>
              </div>

              {/* Step 3: Fuel Type */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <label className="block text-xs font-bold text-[#002D56] uppercase tracking-wider mb-3">
                  03. 주공급 연료 및 탈탄소 옵션
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'natural_gas', label: '도시가스 (NG)', desc: '즉시 가동 경제성' },
                    { id: 'blend_20', label: '수소 20% 혼소', desc: '단계적 탄소 저감' },
                    { id: 'pure_h2', label: '100% 그린 수소', desc: '완전 무탄소 발전' },
                    { id: 'biogas', label: '바이오가스', desc: '순환 자원 직도입' }
                  ].map((fuel) => (
                    <button
                      key={fuel.id}
                      onClick={() => setFuelType(fuel.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        fuelType === fuel.id
                          ? 'bg-[#002D56] text-white border-[#002D56] font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold">{fuel.label}</div>
                      <div className={`text-[10px] mt-0.5 ${fuelType === fuel.id ? 'text-[#8CC63F]' : 'text-slate-500'}`}>
                        {fuel.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Reliability & Heat Recovery Options */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#002D56] uppercase tracking-wider mb-2">
                    04. 마이크로그리드 신뢰도 토폴로지
                  </label>
                  <select
                    value={gridMode}
                    onChange={(e) => setGridMode(e.target.value as any)}
                    className="w-full text-xs p-2.5 border rounded-xl border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8CC63F]"
                  >
                    <option value="mission_critical">N+1 이중화 무정전 모드 (99.999%)</option>
                    <option value="island_mode">전력망 독립 아일랜드 운전 모드</option>
                    <option value="standard">계통 병렬 일반 피크 쉐이빙 모드</option>
                  </select>
                </div>

                <div className="flex flex-col justify-between">
                  <label className="block text-xs font-bold text-[#002D56] uppercase tracking-wider mb-2">
                    05. 열병합(CHP) 폐열 회수 연동
                  </label>
                  <button
                    onClick={() => setEnableHeatRecovery(!enableHeatRecovery)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                      enableHeatRecovery
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <span>온수/스팀 열회수 (총효율 90%)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${enableHeatRecovery ? 'bg-[#8CC63F] text-[#002D56]' : 'bg-slate-300 text-slate-700'}`}>
                      {enableHeatRecovery ? '활성화됨 (ON)' : '비활성 (OFF)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Live Simulation Output Column */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#001A33] text-white p-8 rounded-3xl border border-slate-800 shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8CC63F]" />
                    <span className="text-xs font-bold text-[#8CC63F] uppercase tracking-wider">
                      실시간 시뮬레이션 결과 리포트
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">2026 최신 모델</span>
                </div>

                {/* Primary Metric: Annual Generation */}
                <div className="mb-6">
                  <div className="text-xs text-slate-400 font-medium mb-1">연간 예상 무중단 발전량</div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums tracking-tight">
                    {annualMWh.toLocaleString()} <span className="text-lg font-bold text-[#8CC63F]">MWh / year</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    연간 8,760시간 기준 가동률 99.999% 적용
                  </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-[#8CC63F]" />
                      <span>연간 CO₂ 감축량</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                      {co2SavingsTons.toLocaleString()} <span className="text-xs font-normal text-[#8CC63F]">톤</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">소나무 약 {Math.round(co2SavingsTons * 150).toLocaleString()}그루 효과</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>예상 에너지 비용 절감</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                      {estimatedSavingsPercent}% <span className="text-xs font-normal text-[#00E5FF]">절감</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">기존 피크요금 + 송전망 대비</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>설치 및 가동 소요 기간</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                      6 ~ 12 <span className="text-xs font-normal text-amber-400">개월</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">기존 전력망(4~7년) 대비 70% 단축</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8CC63F]" />
                      <span>부지 절감 면적</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                      {footprintSavedM2.toLocaleString()} <span className="text-xs font-normal text-[#8CC63F]">m²</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">태양광 대비 1/100 풋프린트</div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1.5 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">선택 산업:</span>
                    <span className="font-semibold text-white">{selectedIndustry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">발전 시스템:</span>
                    <span className="font-semibold text-[#8CC63F]">Bloom Energy Server {powerCapacity}MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">열병합 효율:</span>
                    <span className="font-semibold text-white">{enableHeatRecovery ? '최대 90% (스팀 연동)' : '60%+ (전기 전용)'}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button to Request Engineering Proposal */}
              <button
                onClick={() => onOpenConsultationWithParams(selectedIndustry, powerCapacity)}
                className="w-full py-4 bg-[#8CC63F] text-[#002D56] font-bold rounded-xl hover:bg-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg text-sm"
              >
                <Send className="w-4 h-4 text-[#002D56]" />
                <span>이 사양으로 전문 엔지니어링 제안서 신청</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Deep Dive */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#002D56] bg-slate-100 py-1 px-3 rounded-full uppercase tracking-wider">
            실제 산업 현장 구축 사례
          </span>
          <h2 className="text-3xl font-bold text-[#002D56] mt-3">
            실제 산업 현장 구축 레퍼런스
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            전 세계 1GW 이상의 현장에서 검증된 블룸 에너지의 상시 가동 레퍼런스를 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INDUSTRY_SOLUTIONS.map((item) => (
            <div key={item.id} className="p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#002D56]">{item.name}</h3>
                    <div className="text-xs text-slate-500 font-mono">{item.englishName}</div>
                  </div>
                  <span className="text-2xl font-black text-[#002D56] font-mono">{item.statNumber}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-700">
                  {item.keyBenefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">추천: {item.recommendedCapacity}</span>
                <button
                  onClick={() => {
                    setSelectedIndustry(item.name);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="font-bold text-[#002D56] hover:text-[#8CC63F] flex items-center gap-1 cursor-pointer"
                >
                  <span>계산기 적용하기</span>
                  <Sliders className="w-3.5 h-3.5 text-[#8CC63F]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

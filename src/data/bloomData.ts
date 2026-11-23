import { Whitepaper, IndustrySolution } from '../types';

export const WHITEPAPERS: Whitepaper[] = [
  {
    id: 'wp-flagship-2026',
    title: '차세대 고체산화물 연료전지(SOFC) 고효율 발전 아키텍처',
    subtitle: '연소 없는 전기화학 반응 기반 60%+ 초기 발전 효율 및 열병합 90% 달성 메커니즘',
    category: 'sofc',
    year: 2026,
    pages: 36,
    fileSize: '4.8 MB',
    badge: '2026 플래그십 기술 백서',
    abstract: '본 백서는 블룸 에너지의 독자적인 평판형 세라믹 고체산화물 전해질 기반 SOFC 시스템의 구조적 특성과 상용 발전소 대비 최대 60% 이상의 단독 전기 효율을 기록한 열역학적 분석 결과를 다룹니다. 기존 연소 터빈 발전의 카르노 사이클 한계를 극복하고 열병합 발전(CHP) 시 총 효율을 최대 90%까지 극대화하는 엔지니어링 설계를 상세히 제시합니다.',
    keyFindings: [
      '단일 전해질 레이어당 800°C 최적 작동 온도를 통한 활성화 손실 최소화',
      '송배전 전력망 손실(평균 5~7%)을 배제한 온사이트(On-site) 발전 효율 우위 입증',
      '기계적 회전 부품을 전면 배제하여 유지보수 주기 5배 연장 및 고장률 92% 감소',
      'SOx, NOx, 초미세먼지 배출량 실측치 0.00 ppm 달성'
    ],
    tableOfContents: [
      '1. 개요: 고체산화물 연료전지(SOFC)의 물리화학적 원리',
      '2. 전기화학 셀 스택(Stack)과 모듈식 서포트 아키텍처',
      '3. 열역학적 효율 분석 및 기존 가스터빈/복합화력과의 비교',
      '4. 산업용 분산 전원 및 마이크로그리드 연동 실증 데이터',
      '5. 결론 및 2030 상용 발전 기술 로드맵'
    ],
    pdfFilename: 'Bloom_Energy_SOFC_Technical_Whitepaper_2026.pdf'
  },
  {
    id: 'wp-soec-hydrogen-2026',
    title: '고체산화물 수전해(SOEC)를 통한 초고효율 그린 수소 생산 경제성 분석',
    subtitle: 'PEM 및 알칼라인(ALK) 대비 전력 소비 45% 절감 및 산업 폐열 연계 모델',
    category: 'soec',
    year: 2026,
    pages: 42,
    fileSize: '5.4 MB',
    badge: '차세대 수소 백서',
    abstract: '블룸 에너지의 고체산화물 플랫폼은 역방향 가역 반응을 통해 고효율 수전해기(SOEC)로 구동됩니다. 고온 수증기 전기분해를 통해 물을 분해할 때 요구되는 전기 에너지를 획기적으로 낮추어, 기존 상용 ALK 및 PEM 방식 대비 최대 45% 적은 전력(37.5 kWh/kg H2)으로 그린 수소를 생산하는 기술적 실증 데이터와 LCOH(균등화 수소 원가) 분석을 제공합니다.',
    keyFindings: [
      '기존 저온 수전해 대비 수증기 잠열 활용으로 전력 소모량 37.5 kWh/kg H2 달성',
      '원자력 및 제철/화학 공정 폐열 연동 시 LCOH $2.0/kg 이하 조기 달성 가능',
      '전력망 재생에너지 잉여 전력 변동성에 즉각 대응하는 램프업(Ramp-up) 동특성',
      '귀금속(백금/이리듐) 배제 친환경 세라믹 촉매 소재 적용으로 제조 단가 혁신'
    ],
    tableOfContents: [
      '1. 그린 수소 생산의 경제적 병목과 고온 수전해의 솔루션',
      '2. 블룸 전해질 스택의 가역적(Reversible) 열화학 반응 메커니즘',
      '3. 원자력 및 제철 공정 폐열(Waste Heat) 연계 시스템 모델링',
      '4. 글로벌 수소 생산 설비(GW급) 스케일업 경제성 분석(LCOH)',
      '5. 상용 실증 프로젝트 결과 및 인증 리포트'
    ],
    pdfFilename: 'Bloom_SOEC_Hydrogen_Production_Whitepaper_2026.pdf'
  },
  {
    id: 'wp-datacenter-ai-2026',
    title: 'AI 데이터센터를 위한 상시 가동(Always-On) 마이크로그리드 구축 전략',
    subtitle: '전력망 증설 지연 극복, 99.999% 가동률 확보 및 탄소 배출 규제 대응 방안',
    category: 'datacenter',
    year: 2026,
    pages: 28,
    fileSize: '3.9 MB',
    badge: 'AI 데이터센터 특화',
    abstract: '초거대 AI 모델 학습 및 추론으로 급증하는 데이터센터의 전력 수요는 기존 전력망(Grid) 인프라의 증설 지연(통상 4~7년 소요)으로 인해 심각한 병목에 직면해 있습니다. 블룸 에너지 서버는 현장 즉시 설치(6~12개월 이내)가 가능하며, 정전 없는 N+1 / N+2 마이크로그리드를 구성하여 무정전 AI 컴퓨팅 인프라를 보장합니다.',
    keyFindings: [
      '전력망 연계 지연 없이 9~12개월 내 최대 50MW+ 신속 현장 구축',
      '99.999% 무정전 전력 공급으로 연간 수백만 달러 규모의 데이터 유실 리스크 차단',
      '소음, 진동, 냉각수 소비가 없는 컴팩트 풋프린트로 도심형 데이터센터 적합',
      '초기 천연가스 운용 후 수소 100%로 무탄소 자동 전환 가능한 미래 보장성'
    ],
    tableOfContents: [
      '1. 전력망 보목 현상과 AI 클러스터의 전력 밀도 위기',
      '2. 분산형 SOFC 기반 온사이트 마이크로그리드 토폴로지',
      '3. 순간 전력 피크 및 과도 응답 제어 아키텍처',
      '4. 글로벌 하이퍼스케일러 데이터센터 실증 구축 사례',
      '5. 총소유비용(TCO) 및 지속가능성 KPI 달성 평가'
    ],
    pdfFilename: 'Bloom_AI_Datacenter_Microgrid_Architecture_2026.pdf'
  },
  {
    id: 'wp-esg-netzero-2026',
    title: '산업 부문 탄소중립 실현을 위한 탈탄소화 경로 가이드',
    subtitle: '연료 유연성(Fuel Flexibility)을 통한 단계적 탄소 배출 감축과 온수/스팀 회수',
    category: 'esg',
    year: 2025,
    pages: 32,
    fileSize: '4.1 MB',
    badge: 'ESG 탄소중립',
    abstract: 'Scope 1 및 Scope 2 배출량을 획기적으로 줄여야 하는 글로벌 제조 기업들을 위해, 바이오가스, 폐기물 에너지화(Waste-to-Energy), 블루/그린 수소로의 무결점 전환 로드맵을 제시합니다. 유해 대기오염물질(NOx, SOx, 미세먼지) 제로를 통한 규제 완화 및 지역사회 상생 효과를 분석합니다.',
    keyFindings: [
      '석탄 및 기존 화석 발전 전력망 대비 CO2 배출량 50% 즉시 감축',
      '냉각탑이 불필요하여 수억 리터의 산업용수 보존 효과 증명',
      '바이오가스 직투입 시 탄소 네거티브(Carbon-Negative) 전력 생산 구현',
      '글로벌 RE100 및 지속가능발전목표(SDG) 7, 9, 13 연계 평가'
    ],
    tableOfContents: [
      '1. 글로벌 탄소 국경세 및 산업별 배출권 규제 동향',
      '2. 연소(Combustion) 없는 전기화학 발전의 친환경 우위',
      '3. 바이오가스 및 도시가스 혼소 기반 단계적 탈탄소 로드맵',
      '4. 수자원 고갈 지역에서의 무수(Waterless) 냉각 효과',
      '5. 기업 ESG 평가 등급 상향 사례'
    ],
    pdfFilename: 'Bloom_Corporate_Decarbonization_Roadmap.pdf'
  }
];

export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    id: 'datacenter',
    name: 'AI & 하이퍼스케일 데이터센터',
    englishName: '초고밀도 컴퓨팅 전력망 인프라',
    tagline: '정전 제로, 99.999% 무중단 분산 전력으로 AI 혁신을 가속화합니다.',
    description: '기존 전력망의 공급 지연 없이 수십 메가와트(MW) 규모의 고밀도 전력을 부지 내에서 즉시 가동합니다. 기상이변이나 계통 붕괴 시에도 독립 마이크로그리드로 완벽한 비즈니스 연속성을 보장합니다.',
    keyBenefits: [
      '99.999% 가동률 (Tier IV 이상 수준의 전력 신뢰도)',
      '냉각수 소비 제로로 수자원 및 쿨링 비용 획기적 절감',
      '6~12개월 이내 초고속 설치로 AI 클러스터 조기 상용화',
      '수소 인프라 완비 시 100% 무탄소 무중단 전력 전환'
    ],
    statNumber: '99.999%',
    statLabel: '전력 연속 가동률 보장',
    clientExample: '글로벌 톱 하이퍼스케일러 및 코로케이션 80MW+ 설치 운용 중',
    recommendedCapacity: '10MW ~ 100MW+',
    fuelType: '천연가스 / 바이오가스 / 수소 혼소'
  },
  {
    id: 'semiconductor',
    name: '첨단 반도체 & 첨단 제조(Fab)',
    englishName: '초정밀 제조 공정 및 클린룸 보호',
    tagline: '순간 전압 강하(Sag)조차 허용되지 않는 첨단 제조 라인의 수호자.',
    description: '초미세 공정의 반도체 공장은 0.1초의 전압 강하만으로도 수백억 원의 웨이퍼 손실이 발생합니다. 블룸 에너지는 전력 품질(Power Quality) 왜곡이 없는 순수 전력을 지속 공급합니다.',
    keyBenefits: [
      '송전선로 낙뢰나 전력망 순간 전압 강하(Sag) 완전 차단',
      '전력 주파수 및 전압 왜곡 없는 초고순도 교류 전력 변환',
      '공정 고온 폐열을 스팀/온수로 회수하여 공장 열원 활용',
      '환경 영향 평가 통과가 용이한 유해 배출가스 0% 실현'
    ],
    statNumber: '0.00 ppm',
    statLabel: '황산화물(SOx) 및 미세먼지 배출량',
    clientExample: '국내외 유수 반도체 파운드리 및 첨단 패키징 라인 도입',
    recommendedCapacity: '5MW ~ 50MW',
    fuelType: '천연가스 / 배관망 수소'
  },
  {
    id: 'hospital',
    name: '종합병원 & 바이오 연구소',
    englishName: '무정전 생명 안전 및 헬스케어 인프라',
    tagline: '생명을 지키는 1초의 멈춤도 없는 무공해 청정 에너지.',
    description: '수술실, 중환자실, 저온 바이오 저장고 등 전력 중단이 인명과 직결되는 환경에서 디젤 비상발전기의 매연과 소음 없이 청정하고 조용한 상시 기저 부하를 제공합니다.',
    keyBenefits: [
      '디젤 발전기 특유의 발암물질 미세먼지 및 진동/소음 전무',
      '자연재해로 인한 외부 전력망 블랙아웃 시 자동 자립 운전',
      '병원 난방 및 멸균 세척용 고온 온수 온사이트 공급',
      '도심 병원 옥상이나 협소한 지하 공간에도 모듈형 배치 가능'
    ],
    statNumber: '1/100',
    statLabel: '태양광 대비 소요 면적 (Footprint)',
    clientExample: '미국 캘리포니아 및 국내 대형 대학병원 마이크로그리드 구축',
    recommendedCapacity: '1MW ~ 10MW',
    fuelType: '천연가스 / 바이오가스'
  },
  {
    id: 'logistics',
    name: '친환경 스마트 물류 & 항만',
    englishName: '친환경 전동화 물류 및 스마트 항만',
    tagline: '전동화 트럭 및 자동화 물류 로봇의 대규모 충전 인프라 지원.',
    description: '수백 대의 전기 화물차(EV Fleet)와 자동화 로봇이 동시 충전될 때 발생하는 전력 피크를 전력망 증설 없이 온사이트 연료전지로 안정적으로 흡수합니다.',
    keyBenefits: [
      'EV 화물트럭 초급속 충전소의 피크 부하 분산 완충',
      '냉동/냉장 물류센터(Cold Chain)의 항온 유지 완벽 보장',
      '항만 선박 육상전원공급(AMP) 연동을 통한 항만 대기질 개선',
      '부지 내 음식물/유기성 폐기물 바이오가스를 연료로 직도입'
    ],
    statNumber: '40%+',
    statLabel: '피크 전력요금 및 충전 계통 증설비 절감',
    clientExample: '글로벌 유통사 메가 풀필먼트 센터 및 스마트 항만',
    recommendedCapacity: '2MW ~ 20MW',
    fuelType: '바이오가스 / 천연가스 / 그린수소'
  }
];

export const TECH_SPECS = [
  {
    feature: '발전 원리',
    bloomSOFC: '고체산화물 전기화학 반응 (직접 DC 발전)',
    gasTurbine: '화석연료 연소 및 고속 터빈 기계 회전',
    pemFC: '저온 수소 전기화학 반응 (순수 수소 전용)',
    dieselGen: '내연기관 압축 점화 연소'
  },
  {
    feature: '전기 발전 효율 (LHV)',
    bloomSOFC: '55% ~ 65%+ (단독 전기 효율 세계 최고)',
    gasTurbine: '30% ~ 42% (규모에 따라 급감)',
    pemFC: '40% ~ 50%',
    dieselGen: '32% ~ 38%'
  },
  {
    feature: '열병합(CHP) 총 효율',
    bloomSOFC: '최대 90% (고온 배출열 고부가가치 활용)',
    gasTurbine: '65% ~ 75%',
    pemFC: '60% ~ 70% (저온 온수 한정)',
    dieselGen: '60% ~ 70%'
  },
  {
    feature: '배출 가스 (NOx, SOx)',
    bloomSOFC: '0.00 ppm (미세먼지/유해가스 제로)',
    gasTurbine: '10 ~ 25 ppm (탈질설비 필수)',
    pemFC: '0.00 ppm (수소 전용 시)',
    dieselGen: '수백 ppm (심각한 대기오염)'
  },
  {
    feature: '사용 가능 연료',
    bloomSOFC: '천연가스, 바이오가스, 수소 혼소, 100% 수소',
    gasTurbine: '천연가스, 중유 (수소 전환 시 터빈 교체)',
    pemFC: '고순도 수소(99.97%+)만 가능',
    dieselGen: '경유(디젤) 전용'
  },
  {
    feature: '냉각수 소비량',
    bloomSOFC: '0 L/MWh (무수 공랭식 작동)',
    gasTurbine: '수천 L/MWh (냉각탑 운영 필요)',
    pemFC: '냉각수 순환 필수',
    dieselGen: '냉각수 및 오일 필수'
  }
];

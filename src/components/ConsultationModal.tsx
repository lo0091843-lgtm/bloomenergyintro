import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Zap, Send } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCapacity?: number;
  initialIndustry?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialCapacity = 5,
  initialIndustry = 'AI & 하이퍼스케일 데이터센터',
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: initialIndustry,
    capacity: initialCapacity.toString(),
    timeline: '6개월 이내',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) errs.companyName = '회사명을 입력해 주세요.';
    if (!formData.contactName.trim()) errs.contactName = '담당자 성함을 입력해 주세요.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = '올바른 업무용 이메일 주소를 입력해 주세요.';
    }
    if (!formData.phone.trim()) errs.phone = '연락처를 입력해 주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001A33]/80 backdrop-blur-md transition-opacity">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002D56] text-white p-6 relative flex justify-between items-center border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8CC63F] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>맞춤형 에너지 엔지니어링 상담</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              전문 기술 컨설팅 및 견적 제안 요청
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-[#8CC63F] flex items-center justify-center border-2 border-[#8CC63F]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-[#002D56]">
                상담 신청이 정상 접수되었습니다
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                블룸 에너지 코리아의 전문 솔루션 아키텍트 팀이 영업일 기준 24시간 이내에 기재해주신 
                <strong className="text-slate-900"> {formData.email}</strong>로 1:1 기술 분석서와 도입 타당성 검토 일정을 안내해 드리겠습니다.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1 text-slate-600 font-mono">
                <div>접수 번호: <strong>BE-2026-KR-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
                <div>희망 용량: <strong>{formData.capacity} MW</strong> ({formData.industry})</div>
                <div>도입 목표 시기: <strong>{formData.timeline}</strong></div>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-6 px-6 py-2.5 bg-[#002D56] text-white rounded-lg text-xs font-bold hover:bg-[#001A33] transition-colors"
              >
                확인 및 닫기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600 text-xs mb-4">
                귀사의 비즈니스 환경에 최적화된 발전 용량, 부지 레이아웃, 탄소 감축 시나리오 및 경제성(TCO) 분석 보고서를 무료로 제공해 드립니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    회사 / 기관명 *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="예: (주)한국데이터솔루션"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CC63F] border-slate-300"
                  />
                  {errors.companyName && <span className="text-rose-500 text-[11px]">{errors.companyName}</span>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    담당자 성함 및 직책 *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="예: 홍길동 팀장"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CC63F] border-slate-300"
                  />
                  {errors.contactName && <span className="text-rose-500 text-[11px]">{errors.contactName}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    업무용 이메일 *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hong@company.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CC63F] border-slate-300"
                  />
                  {errors.email && <span className="text-rose-500 text-[11px]">{errors.email}</span>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CC63F] border-slate-300"
                  />
                  {errors.phone && <span className="text-rose-500 text-[11px]">{errors.phone}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    산업 분야
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CC63F] border-slate-300 bg-white"
                  >
                    <option value="AI & 하이퍼스케일 데이터센터">AI & 하이퍼스케일 데이터센터</option>
                    <option value="첨단 반도체 & 첨단 제조(Fab)">첨단 반도체 & 첨단 제조(Fab)</option>
                    <option value="종합병원 & 바이오 연구소">종합병원 & 바이오 연구소</option>
                    <option value="스마트 물류 & 항만 인프라">스마트 물류 & 항만 인프라</option>
                    <option value="상업용 대형 빌딩 & 캠퍼스">상업용 대형 빌딩 & 캠퍼스</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    예상 필요 전력 용량 (MW)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CC63F] border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  추가 문의 사항 및 구축 현장 특이사항 (선택)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="예: 데이터센터 부지 옥상 설치 타당성 검토 요청, 기존 전력망 인입 지연 대응 등"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CC63F] border-slate-300"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#8CC63F] shrink-0" />
                <span>입력하신 정보는 기술 컨설팅 목적으로만 안전하게 보호 및 처리됩니다.</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#002D56] text-[#8CC63F] hover:bg-[#001A33] hover:text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>맞춤형 기술 솔루션 상담 신청하기</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

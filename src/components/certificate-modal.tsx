import { useEffect } from "react";
import { Award, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CertificatePrintItem {
  certNo: string;
  userName: string;
  userEmail: string;
  corpName: string;
  department: string;
  courseTitle: string;
  durationMin: number;
  progress: number;
  completedAt: string;
}

export function CertificateBatchModal({
  open,
  onClose,
  items,
  title = "수료증 일괄 출력 미리보기",
}: {
  open: boolean;
  onClose: () => void;
  items: CertificatePrintItem[];
  title?: string;
}) {
  useEffect(() => {
    if (!open || items.length === 0) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("printing-cert");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("printing-cert");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, items.length, onClose]);

  if (!open || items.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="cert-print-overlay fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cert-print-shell flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
        <div className="flex flex-col gap-3 border-b bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 print:hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <Award className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <h3 className="text-base font-bold break-keep">{title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed break-keep text-muted-foreground">
                  총 {items.length}건의 공식 수료증 · 인쇄 또는 PDF로 저장할 수 있습니다.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 min-h-11 min-w-11 shrink-0 sm:hidden"
              onClick={onClose}
              aria-label="닫기"
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} className="min-h-11 w-full gap-2 font-semibold sm:w-auto">
              <Printer className="size-4 shrink-0" />
              {items.length}건 인쇄 / PDF 저장
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden size-10 shrink-0 sm:inline-flex"
              onClick={onClose}
              aria-label="닫기"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="cert-print-scroll flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 sm:p-6">
          {items.map((item, idx) => (
            <div
              key={`${item.certNo}-${idx}`}
              className="cert-print-sheet mx-auto max-w-2xl rounded-xl border-2 border-primary/40 bg-white p-5 text-slate-900 shadow-md sm:p-8 print:border-slate-400 print:shadow-none"
            >
              <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-mono font-semibold">제 {item.certNo} 호</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <img
                    src={`${import.meta.env.BASE_URL}cea-logo.png`}
                    alt="CEA 로고"
                    className="size-6 shrink-0 rounded-full object-contain"
                    width={24}
                    height={24}
                  />
                  www.cea.co.kr · CEA (주식회사 씨이에이)
                </span>
              </div>

              <div className="my-6 text-center sm:my-8">
                <p className="text-[11px] font-bold tracking-[0.22em] text-blue-800 sm:text-xs">CERTIFICATE OF COMPLETION</p>
                <h4 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">교 육 수 료 증</h4>
              </div>

              <dl className="mx-auto max-w-lg space-y-3 rounded-lg bg-slate-50 p-4 text-sm sm:p-5">
                <div className="grid grid-cols-1 gap-1 border-b border-slate-200/80 pb-2.5 sm:grid-cols-3 sm:gap-2">
                  <dt className="text-xs font-semibold text-slate-500 sm:text-sm">소속 법인 · 부서</dt>
                  <dd className="font-bold break-keep text-slate-900 sm:col-span-2">
                    {item.corpName} ({item.department})
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 border-b border-slate-200/80 pb-2.5 sm:grid-cols-3 sm:gap-2">
                  <dt className="text-xs font-semibold text-slate-500 sm:text-sm">성 명 (아이디)</dt>
                  <dd className="font-bold break-words text-slate-900 sm:col-span-2">
                    {item.userName} <span className="font-normal break-all text-slate-500">({item.userEmail})</span>
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 border-b border-slate-200/80 pb-2.5 sm:grid-cols-3 sm:gap-2">
                  <dt className="text-xs font-semibold text-slate-500 sm:text-sm">이수 교육과정</dt>
                  <dd className="font-bold break-keep text-blue-900 sm:col-span-2">{item.courseTitle}</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-2">
                  <dt className="text-xs font-semibold text-slate-500 sm:text-sm">인정 시간 · 진도율</dt>
                  <dd className="font-semibold break-keep text-slate-800 sm:col-span-2">
                    {item.durationMin}분 과정 · 학습 진도율 {item.progress}% (수료일: {item.completedAt})
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-center text-sm leading-[1.75] break-keep text-slate-700 sm:mt-7">
                위 사람은 주식회사 씨이에이(CEA)가 제공하는 기업 ESG 전문 교육과정을
                <br className="hidden sm:inline" /> 성실히 이수하였기에 이 증서를 수여합니다.
              </p>

              <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-0.5 text-xs text-slate-500">
                  <p>발급일자: {item.completedAt}</p>
                  <p>검증기관: 주식회사 씨이에이 (CEA ESG Academy)</p>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">주식회사 씨이에이 대표이사</span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-red-600/80 text-[11px] leading-tight font-extrabold text-red-600">
                    CEA
                    <br />
                    직인
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

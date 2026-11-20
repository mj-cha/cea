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
  if (!open || items.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b bg-card px-6 py-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <Award className="size-5 text-primary" />
            <div>
              <h3 className="text-base font-bold">{title}</h3>
              <p className="text-xs text-muted-foreground">
                총 {items.length}건의 공식 수료증이 선택되었습니다 · 인쇄 또는 PDF로 일괄 저장할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} className="gap-2 font-semibold">
              <Printer className="size-4" />
              {items.length}건 일괄 인쇄 / PDF 저장
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-6">
          {items.map((item, idx) => (
            <div
              key={`${item.certNo}-${idx}`}
              className="mx-auto max-w-2xl rounded-xl border-2 border-primary/40 bg-white p-8 text-slate-900 shadow-md print:break-after-page print:border-slate-400 print:shadow-none"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs text-slate-500">
                <span className="font-mono font-semibold">제 {item.certNo} 호</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <img
                    src={`${import.meta.env.BASE_URL}cea-logo.png`}
                    alt="CEA 로고"
                    className="size-6 rounded-full object-contain"
                    width={24}
                    height={24}
                  />
                  www.cea.co.kr · CEA (주식회사 씨이에이)
                </span>
              </div>

              <div className="my-8 text-center">
                <p className="text-xs font-bold tracking-[0.25em] text-blue-800">CERTIFICATE OF COMPLETION</p>
                <h4 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">교 육 수 료 증</h4>
              </div>

              <dl className="mx-auto max-w-lg space-y-3 rounded-lg bg-slate-50 p-5 text-sm">
                <div className="grid grid-cols-3 border-b border-slate-200/80 pb-2">
                  <dt className="font-semibold text-slate-500">소속 법인 · 부서</dt>
                  <dd className="col-span-2 font-bold text-slate-900">
                    {item.corpName} ({item.department})
                  </dd>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200/80 pb-2">
                  <dt className="font-semibold text-slate-500">성 명 (아이디)</dt>
                  <dd className="col-span-2 font-bold text-slate-900">
                    {item.userName} <span className="font-normal text-slate-500">({item.userEmail})</span>
                  </dd>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200/80 pb-2">
                  <dt className="font-semibold text-slate-500">이수 교육과정</dt>
                  <dd className="col-span-2 font-bold text-blue-900">{item.courseTitle}</dd>
                </div>
                <div className="grid grid-cols-3">
                  <dt className="font-semibold text-slate-500">인정 시간 · 진도율</dt>
                  <dd className="col-span-2 font-semibold text-slate-800">
                    {item.durationMin}분 과정 · 학습 진도율 {item.progress}% (수료일: {item.completedAt})
                  </dd>
                </div>
              </dl>

              <p className="mt-7 text-center text-sm leading-relaxed text-slate-700">
                위 사람은 주식회사 씨이에이(CEA)가 제공하는 기업 ESG 전문 교육과정을
                <br />
                성실히 이수하였기에 이 증서를 수여합니다.
              </p>

              <div className="mt-8 flex items-end justify-between border-t border-slate-200 pt-5">
                <div className="text-xs text-slate-500">
                  <p>발급일자: {item.completedAt}</p>
                  <p>검증기관: 주식회사 씨이에이 (CEA ESG Academy)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold tracking-tight text-slate-900">주식회사 씨이에이 대표이사</span>
                  <span className="grid size-11 place-items-center rounded-full border-2 border-red-600/80 text-[11px] leading-tight font-extrabold text-red-600">
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

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";
import { getSupabaseConfig, insertConsultToSupabase } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

/** 접수 메일 주소. 환경변수가 없으면 기본 대표 상담 주소로 연결한다. */
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "contact@cea.co.kr";

const interests = [...services.map((s) => s.title), "온라인 교육", "기업 단체 교육"];

export function Contact() {
  const { contactInterest } = useService();
  const [picked, setPicked] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sent" | "copied" | "db_saved">("idle");
  const [lastSummary, setLastSummary] = useState("");

  useEffect(() => {
    if (contactInterest && !picked.includes(contactInterest)) {
      setPicked((prev) => [...prev, contactInterest]);
    }
  }, [contactInterest, picked]);

  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const company = String(f.get("company") ?? "").trim();
    const managerName = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();

    const body = [
      `회사명: ${company}`,
      `담당자: ${managerName}`,
      `연락처: ${email}`,
      `관심 분야: ${picked.join(", ") || "-"}`,
      "",
      message,
    ].join("\n");
    setLastSummary(body);

    if (getSupabaseConfig().isConnected) {
      const res = await insertConsultToSupabase({
        company,
        managerName,
        email,
        interests: picked,
        message,
      });
      if (res.ok) {
        setState("db_saved");
        return;
      }
    }

    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[CEA 상담 신청] ${company}`)}&body=${encodeURIComponent(body)}`;
    setState("sent");
  };

  const copySummary = async () => {
    if (!lastSummary) return;
    try {
      await navigator.clipboard.writeText(lastSummary);
      setState("copied");
    } catch {
      // 클립보드 권한 실패 시 무시
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t py-20 md:py-28">
      <div className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative container grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="mb-4 text-[13px] font-semibold text-primary">상담 신청</p>
          <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] md:text-[44px]">
            지금 필요한 ESG 대응,
            <br />
            함께 정리해 드릴게요
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            회사 상황과 기한을 알려 주시면 전문 컨설턴트가 확인 후 연락드립니다. 첫 상담에서는 대응 범위와 우선순위를 먼저 정해요.
          </p>
          <ul className="mt-8 space-y-3 text-[15px]">
            {["교육 · 컨설팅 중 맞는 방식 추천", "발간 · 공시 · 평가 일정 역산", "범위 확정 후 견적 안내"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="size-4 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="rounded-2xl border bg-card p-6 md:p-8" aria-label="상담 신청서">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="company">회사명</Label>
              <Input id="company" name="company" required autoComplete="organization" placeholder="예) 주식회사 OO" className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">담당자</Label>
              <Input id="name" name="name" required autoComplete="name" placeholder="이름 · 직함" className="h-11" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="name@company.com" className="h-11" />
            </div>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2.5 text-[13px] font-semibold text-foreground/90">관심 분야 (여러 개 선택)</legend>
              <div className="flex flex-wrap gap-2">
                {interests.map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={picked.includes(v)}
                    onClick={() => toggle(v)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-[background-color,color,border-color,scale] duration-150 active:scale-[0.97]",
                      picked.includes(v)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="message">문의 내용</Label>
              <Textarea id="message" name="message" placeholder="현재 상황, 원하는 시기, 궁금한 점을 적어 주세요." className="min-h-[120px]" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-muted-foreground">입력하신 정보는 상담 회신 목적으로만 사용합니다.</p>
            <Button type="submit" className="h-12 gap-2 px-6 text-[15px] font-semibold">
              상담 신청하기
              <ArrowRight />
            </Button>
          </div>
          {state !== "idle" && (
            <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              <span>
                {state === "db_saved"
                  ? "Supabase 실서버 DB(cea_consult_requests)에 상담 신청이 즉시 접수되었습니다. 담당 컨설턴트가 확인 후 연락드릴게요."
                  : state === "copied"
                    ? `신청 내용이 복사되었습니다. ${CONTACT_EMAIL} 로 보내 주시면 확인 후 연락드릴게요.`
                    : `메일 앱(${CONTACT_EMAIL})에서 내용을 확인하고 보내 주세요. 메일 앱이 열리지 않으면 오른쪽 복사 버튼을 눌러 주세요.`}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={copySummary} className="h-8 gap-1.5 text-xs font-bold">
                <Copy className="size-3.5" />
                신청 내용 복사
              </Button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

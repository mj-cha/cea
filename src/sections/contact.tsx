import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

/** 접수 메일 주소. 비어 있으면 폼은 '접수 창구 준비 중'으로 안내한다. */
export const CONTACT_EMAIL = "";

const interests = [...services.map((s) => s.title), "온라인 교육", "기업 단체 교육"];

export function Contact() {
  const [picked, setPicked] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sent" | "unavailable">("idle");
  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!CONTACT_EMAIL) {
      setState("unavailable");
      return;
    }
    const body = [
      `회사명: ${f.get("company")}`,
      `담당자: ${f.get("name")}`,
      `연락처: ${f.get("email")}`,
      `관심 분야: ${picked.join(", ") || "-"}`,
      "",
      String(f.get("message") ?? ""),
    ].join("\n");
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[CEA 상담 신청] ${f.get("company")}`)}&body=${encodeURIComponent(body)}`;
    setState("sent");
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
            <p
              role="status"
              className={cn(
                "mt-5 animate-fade-up rounded-lg px-4 py-3 text-sm",
                state === "sent" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {state === "sent"
                ? "메일 앱에서 내용을 확인하고 보내 주세요. 확인 후 연락드릴게요."
                : "온라인 접수 창구를 준비하고 있어요. 잠시 후 다시 시도해 주세요."}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

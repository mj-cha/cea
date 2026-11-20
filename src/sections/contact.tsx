import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";
import { getSupabaseConfig, insertConsultToSupabase } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";
import { KAKAO_CHANNEL_URL } from "@/sections/faq";

/** 접수 메일 주소 */
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "contact@cea.co.kr";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
  "nate.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
]);

export function isPersonalEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return PERSONAL_EMAIL_DOMAINS.has(domain);
}

const interests = [...services.map((s) => s.title), "온라인 교육 단독 수강", "기업 단체·환급과정 문의"];

export function Contact() {
  const { contactInterest } = useService();
  const [picked, setPicked] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sent" | "copied" | "db_saved">("idle");
  const [emailErr, setEmailErr] = useState("");
  const [kakaoInfo, setKakaoInfo] = useState(false);
  const [lastSummary, setLastSummary] = useState("");

  useEffect(() => {
    if (contactInterest && !picked.includes(contactInterest)) {
      setPicked((prev) => [...prev, contactInterest]);
    }
  }, [contactInterest, picked]);

  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailErr("");
    const f = new FormData(e.currentTarget);
    const company = String(f.get("company") ?? "").trim();
    const managerName = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();

    if (isPersonalEmail(email)) {
      setEmailErr("개인 무료 메일(네이버·지메일·카카오 등)은 접수되지 않습니다. 소속 기업·기관의 업무용 이메일 주소를 입력해 주세요.");
      return;
    }

    const body = [
      `회사명: ${company}`,
      `담당자: ${managerName}`,
      `업무용 이메일: ${email}`,
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

  const openKakao = () => {
    if (KAKAO_CHANNEL_URL) {
      window.open(KAKAO_CHANNEL_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setKakaoInfo((v) => !v);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-14 md:py-22">
      <div className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative container grid gap-12 break-keep lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="mb-3 text-[13px] font-semibold text-primary">도입 상담 · 견적 문의</p>
          <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] md:text-[42px]">
            지금 필요한 ESG 대응,{" "}
            <br />
            함께 정리해 드릴게요
          </h2>
          <p className="mt-5 max-w-md leading-[1.7] text-muted-foreground">
            회사 상황과 목표 기한을 남겨 주시면 전문 컨설턴트가 확인 후 연락드립니다.
            <br />첫 상담에서는 과업 범위, 정부지원·환급 가능 여부, 일정을 먼저 짚어 드립니다.
          </p>
          <ul className="mt-7 space-y-3 text-[15px]">
            {[
              "단독 교육 · 컨설팅(필수 교육 포함) 맞춤 설계",
              "보고서 발간(연례·최초·영문·디지털) 및 KSSB 공시 일정 역산",
              "고용보험 환급과정 및 공공 바우처 연계 검토",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button
              type="button"
              onClick={openKakao}
              className="min-h-11 gap-2 bg-[#FEE500] px-5 text-sm font-extrabold text-[#191919] hover:bg-[#FDD800]"
            >
              <MessageCircle className="size-4" />
              카카오톡으로 빠른 문의하기
            </Button>
            {kakaoInfo && !KAKAO_CHANNEL_URL && (
              <p role="status" className="mt-2.5 rounded-lg border bg-card p-3 text-xs leading-relaxed text-muted-foreground">
                카카오톡 공식 상담 채널 주소(`VITE_KAKAO_CHANNEL_URL`) 연동 준비 중입니다. 우측 상담 신청서를 작성해 주시면 업무용 메일로 신속히 회신드립니다.
              </p>
            )}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border bg-card p-6 md:p-8" aria-label="상담 신청서">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="company">회사 · 기관명 *</Label>
              <Input id="company" name="company" required autoComplete="organization" placeholder="예) 주식회사 씨이에이" className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">담당자 성함 · 직함 *</Label>
              <Input id="name" name="name" required autoComplete="name" placeholder="예) OOO 매니저" className="h-11" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="email">업무용 이메일 (기업 · 기관 메일만 가능) *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                onChange={() => emailErr && setEmailErr("")}
                placeholder="예) esg@company.co.kr (개인 포털 메일 제외)"
                className="h-11"
              />
              {emailErr && (
                <p role="alert" className="text-xs font-bold text-destructive">
                  {emailErr}
                </p>
              )}
            </div>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2.5 text-[13px] font-semibold text-foreground/90">관심 분야 (복수 선택 가능)</legend>
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
              <Textarea
                id="message"
                name="message"
                placeholder="현재 준비 단계(최초·연례 발간, KSSB 공시, 교육 인원, 희망 시기 등)를 적어 주세요."
                className="min-h-[120px]"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-muted-foreground">입력하신 기업 정보는 상담 회신 목적으로만 사용합니다.</p>
            <Button type="submit" className="h-12 gap-2 px-6 text-[15px] font-semibold">
              상담 신청하기
              <ArrowRight />
            </Button>
          </div>
          {state !== "idle" && (
            <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              <span>
                {state === "db_saved"
                  ? "상담 신청이 정상 접수되었습니다. 담당 컨설턴트가 확인 후 업무용 이메일로 연락드릴게요."
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

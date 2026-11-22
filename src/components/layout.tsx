import { useEffect, useState, type ReactNode } from "react";
import { LogIn, LogOut, Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLms } from "@/lib/lms-store";
import { cn } from "@/lib/utils";

export type AppViewMode =
  | "home"
  | "services"
  | "publications"
  | "education"
  | "process"
  | "faq"
  | "contact"
  | "lms"
  | "apply"
  | "admin"
  | "studio";

/** 로고: 공식 CEA 심볼(public/cea-logo.png) */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <a href="#top" onClick={onClick} className={cn("flex shrink-0 items-center gap-2", className)} aria-label="CEA 홈">
      <img
        src={`${import.meta.env.BASE_URL}cea-logo.png`}
        alt="CEA 심볼 로고"
        className="size-8 rounded-full border border-border/60 bg-white p-0.5 object-contain shadow-xs"
        width={32}
        height={32}
      />
      <div className="flex flex-col leading-tight">
        <span className="text-[12.5px] font-extrabold tracking-[-0.02em] whitespace-nowrap text-foreground sm:text-[14px]">
          Corporate Ecosystem Advisory
        </span>
      </div>
    </a>
  );
}

export const nav: { href: string; mode: AppViewMode; label: string }[] = [
  { href: "#top", mode: "home", label: "홈" },
  { href: "#services", mode: "services", label: "ESG 컨설팅" },
  { href: "#publications", mode: "publications", label: "지원사업 · 정책" },
  { href: "#education", mode: "education", label: "온라인 교육" },
  { href: "#process", mode: "process", label: "진행 방식" },
  { href: "#faq", mode: "faq", label: "자주 묻는 질문" },
];

export function Header({
  currentMode = "home",
  onNavigate,
}: {
  currentMode?: AppViewMode;
  onNavigate?: (hash: string) => void;
}) {
  const { loggedInUser, isAdminLoggedIn, setLoginModalOpen, logout, themeMode, setThemeMode } = useLms();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 계정 표시 이름 단축 (관리자는 '관리자', 일반 회원은 직함 제외한 짧은 이름만 표시 후 폭 제한)
  const shortUserLabel = isAdminLoggedIn
    ? "관리자"
    : (loggedInUser?.name ?? "").replace(/\s*(대표|총괄|수석연구원|연구원|매니저).*$/, "").trim() || "회원";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md transition-colors duration-200",
        scrolled && "border-border shadow-xs",
      )}
    >
      <div className="container flex h-15 items-center gap-3 lg:gap-5">
        <Logo onClick={() => onNavigate?.("#top")} />

        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="주요 메뉴">
          {nav.map((n) => {
            const isActive = currentMode === n.mode;
            return (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(n.href);
                  }
                }}
                className={cn(
                  "relative shrink-0 rounded-md px-2 py-1.5 text-[13px] font-semibold whitespace-nowrap text-muted-foreground transition-colors duration-150 hover:text-foreground lg:px-2.5 lg:text-[14px]",
                  isActive && "font-bold text-foreground",
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute inset-x-2 -bottom-[13px] h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-200",
                    isActive && "scale-x-100",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setThemeMode(themeMode === "white" ? "navy" : "white")}
            className="size-11 min-h-11 min-w-11 shrink-0 sm:size-8 sm:min-h-8 sm:min-w-8"
            aria-label={themeMode === "white" ? "진한 남색 배경으로 전환" : "화이트 배경으로 전환"}
            title={themeMode === "white" ? "진한 남색 배경으로 전환" : "화이트 배경으로 전환"}
          >
            {themeMode === "white" ? (
              <Moon className="size-3.5 text-primary" />
            ) : (
              <Sun className="size-3.5 text-sky-300" />
            )}
          </Button>

          <Button
            asChild
            variant={currentMode === "lms" || currentMode === "apply" ? "default" : "outline"}
            size="sm"
            className="hidden h-8 shrink-0 px-2.5 text-xs font-bold whitespace-nowrap sm:inline-flex"
          >
            <a href="#lms">나의 강의실</a>
          </Button>

          {isAdminLoggedIn && (
            <Button
              asChild
              variant={currentMode === "admin" ? "default" : "outline"}
              size="sm"
              className="hidden h-8 shrink-0 gap-1 px-2.5 text-xs font-bold whitespace-nowrap sm:inline-flex"
            >
              <a href="#admin">
                <ShieldCheck className="size-3.5 shrink-0" />
                관리자 콘솔
              </a>
            </Button>
          )}

          {loggedInUser ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              title="클릭 시 로그아웃"
              className="hidden h-8 max-w-[96px] shrink-0 gap-1 px-2.5 text-xs font-bold whitespace-nowrap sm:inline-flex"
            >
              <span className="max-w-[58px] truncate">{shortUserLabel}</span>
              <LogOut className="size-3.5 shrink-0" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLoginModalOpen(true)}
              className="hidden h-8 shrink-0 gap-1 px-2.5 text-xs font-bold whitespace-nowrap sm:inline-flex"
            >
              <LogIn className="size-3.5 shrink-0" />
              로그인
            </Button>
          )}

          <Button
            asChild
            size="sm"
            className="hidden h-8 shrink-0 px-2.5 text-xs font-semibold whitespace-nowrap sm:inline-flex"
          >
            <a href="#contact">상담 신청</a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-11 min-h-11 min-w-11 shrink-0 md:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-up border-t bg-background md:hidden">
          <nav className="container flex flex-col py-3" aria-label="모바일 메뉴">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={cn(
                  "min-h-11 py-2.5 text-base font-semibold",
                  currentMode === n.mode && "font-extrabold text-primary",
                )}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <a href="#lms" className="min-h-11 py-2.5 text-sm font-bold text-primary" onClick={() => setOpen(false)}>
              나의 온라인 강의실
            </a>
            {isAdminLoggedIn && (
              <a href="#admin" className="min-h-11 py-2.5 text-sm font-bold text-primary" onClick={() => setOpen(false)}>
                관리자 콘솔
              </a>
            )}
            <div className="mt-2 flex gap-2">
              {loggedInUser ? (
                <Button variant="secondary" className="min-h-11 max-w-full flex-1 truncate font-bold" onClick={logout}>
                  {shortUserLabel} 로그아웃
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="min-h-11 flex-1 font-bold"
                  onClick={() => {
                    setOpen(false);
                    setLoginModalOpen(true);
                  }}
                >
                  로그인
                </Button>
              )}
              <Button asChild className="min-h-11 flex-1 font-semibold">
                <a href="#contact" onClick={() => setOpen(false)}>
                  상담 신청
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/** 질문-답 2단 블록 */
export function QA({
  id,
  eyebrow,
  q,
  a,
  children,
}: {
  id?: string;
  eyebrow?: string;
  q: ReactNode;
  a?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="container border-t py-16 first:border-t-0 md:py-24">
      <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div>
          {eyebrow && <p className="mb-3 text-[13px] font-semibold text-primary">{eyebrow}</p>}
          <h2 className="text-[26px] leading-[1.35] font-bold tracking-[-0.02em] break-keep md:sticky md:top-24 md:text-[34px]">{q}</h2>
        </div>
        <div className="break-keep">
          <div className="mb-6 h-1 w-14 rounded-full bg-primary" />
          {a && <p className="mb-7 text-[17px] leading-[1.7] font-bold md:text-xl">{a}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function Footer({ onNavigate }: { onNavigate?: (hash: string) => void }) {
  return (
    <footer className="border-t bg-muted/10">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Logo onClick={() => onNavigate?.("#top")} />
          <p className="text-sm leading-[1.7] break-keep text-muted-foreground">
            ESG 실무 교육과 전문 컨설팅을 함께 제공합니다.
            <br />
            배운 내용을 우리 회사 보고서와 공시, 평가 대응으로 바로 옮기도록 돕습니다.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground md:items-end md:text-right">
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="하단 메뉴">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(n.href);
                  }
                }}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <a href="#contact" className="font-semibold whitespace-nowrap text-primary hover:underline">
              상담 신청
            </a>
          </nav>
          <p className="text-xs leading-relaxed break-keep">
            주식회사 씨이에이(CEA) · 공식 홈페이지 www.cea.co.kr
            <br />© {new Date().getFullYear()} Corporate Ecosystem Advisory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

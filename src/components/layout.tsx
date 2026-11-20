import { useEffect, useState, type ReactNode } from "react";
import { LogIn, LogOut, Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLms } from "@/lib/lms-store";
import { cn } from "@/lib/utils";

/** 로고: 구글 드라이브 공식 CEA 심볼(public/cea-logo.png) 및 영문 사명 반영 */
export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-2.5", className)} aria-label="CEA 홈">
      <img
        src={`${import.meta.env.BASE_URL}cea-logo.png`}
        alt="CEA 심볼 로고"
        className="size-9 rounded-full border border-border/60 bg-white p-0.5 object-contain shadow-xs"
        width={36}
        height={36}
      />
      <div className="flex flex-col leading-none">
        <span className="text-[19px] font-extrabold tracking-[-0.02em]">CEA</span>
        <span className="hidden text-[10px] font-medium tracking-tight text-muted-foreground sm:inline">
          Corporate Ecosystem Advisory
        </span>
      </div>
    </a>
  );
}

export const nav = [
  { href: "#services", label: "ESG 컨설팅" },
  { href: "#publications", label: "지속가능성 발간물" },
  { href: "#education", label: "온라인 교육" },
  { href: "#process", label: "진행 방식" },
  { href: "#faq", label: "자주 묻는 질문" },
];

export function Header() {
  const { loggedInUser, isAdminLoggedIn, setLoginModalOpen, logout, themeMode, setThemeMode } = useLms();
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md transition-colors duration-200",
        scrolled && "border-border shadow-xs",
      )}
    >
      <div className="container flex h-16 items-center gap-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={cn(
                "relative rounded-md px-3 py-2 text-[15px] font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground",
                active === n.href && "text-foreground",
              )}
            >
              {n.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-[13px] h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-200",
                  active === n.href && "scale-x-100",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* 화이트 ↔ 진한 남색 배경 테마 전환 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setThemeMode(themeMode === "white" ? "navy" : "white")}
            className="h-9 gap-1.5 px-2.5 text-xs font-bold"
            title="화이트 / 진한 남색 배경 전환"
          >
            {themeMode === "white" ? (
              <>
                <Moon className="size-3.5 text-primary" />
                <span className="hidden xl:inline">진한 남색 배경</span>
              </>
            ) : (
              <>
                <Sun className="size-3.5 text-sky-300" />
                <span className="hidden xl:inline">화이트 배경</span>
              </>
            )}
          </Button>

          <Button asChild variant="outline" size="sm" className="hidden h-9 px-3 text-xs font-bold sm:inline-flex">
            <a href="#lms">나의 강의실</a>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden h-9 px-3 text-xs font-bold lg:inline-flex">
            <a href="#apply">기업 아이디 등록폼</a>
          </Button>

          {/* 관리자 로그인 시에만 관리자 콘솔 버튼 노출 */}
          {isAdminLoggedIn && (
            <Button asChild size="sm" className="hidden h-9 gap-1 px-3 text-xs font-bold sm:inline-flex">
              <a href="#admin">
                <ShieldCheck className="size-3.5" />
                관리자 콘솔
              </a>
            </Button>
          )}

          {loggedInUser ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              className="hidden h-9 gap-1.5 px-3 text-xs font-bold sm:inline-flex"
            >
              <span>
                {loggedInUser.name} ({isAdminLoggedIn ? "관리자" : loggedInUser.role})
              </span>
              <LogOut className="size-3.5" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLoginModalOpen(true)}
              className="hidden h-9 gap-1.5 px-3 text-xs font-bold sm:inline-flex"
            >
              <LogIn className="size-3.5" />
              로그인
            </Button>
          )}

          <Button asChild className="hidden h-9 px-3.5 text-xs font-semibold sm:inline-flex">
            <a href="#contact">상담 신청</a>
          </Button>

          <Button
            variant="ghost"
            size="icon-lg"
            className="md:hidden"
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
              <a key={n.href} href={n.href} className="py-3 text-base font-semibold" onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
            <a href="#lms" className="py-2.5 text-sm font-bold text-primary" onClick={() => setOpen(false)}>
              나의 온라인 강의실
            </a>
            <a href="#apply" className="py-2.5 text-sm font-bold text-primary" onClick={() => setOpen(false)}>
              기업 전용 아이디 등록 폼
            </a>
            {isAdminLoggedIn && (
              <a href="#admin" className="py-2.5 text-sm font-bold text-primary" onClick={() => setOpen(false)}>
                관리자 콘솔 (14대 메뉴)
              </a>
            )}
            <div className="mt-2 flex gap-2">
              {loggedInUser ? (
                <Button variant="secondary" className="h-10 flex-1 font-bold" onClick={logout}>
                  {loggedInUser.name} 로그아웃
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="h-10 flex-1 font-bold"
                  onClick={() => {
                    setOpen(false);
                    setLoginModalOpen(true);
                  }}
                >
                  로그인 (관리자 · 수강생)
                </Button>
              )}
              <Button asChild className="h-10 flex-1 font-semibold">
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

/** heyjames 스타일의 질문-답 2단 블록 */
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
    <section id={id} className="container border-t py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div>
          {eyebrow && <p className="mb-4 text-[13px] font-semibold text-primary">{eyebrow}</p>}
          <h2 className="text-[28px] leading-[1.3] font-bold tracking-[-0.02em] md:sticky md:top-28 md:text-[34px]">{q}</h2>
        </div>
        <div>
          <div className="mb-6 h-1 w-14 rounded-full bg-primary" />
          {a && <p className="mb-8 text-lg leading-relaxed font-bold md:text-xl">{a}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            ESG 실무 교육과 전문 컨설팅을 함께 제공합니다. 배운 것을 우리 회사 보고서와 공시, 평가 대응으로 바로 옮기도록 돕습니다.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground md:items-end">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="하단 메뉴">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-foreground">
                {n.label}
              </a>
            ))}
          </nav>
          <p className="text-xs">© {new Date().getFullYear()} 주식회사 씨이에이(CEA) · www.cea.co.kr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

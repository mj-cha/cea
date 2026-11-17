import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 로고: 구글 드라이브 공식 CEA 심볼(public/cea-logo.png) 및 영문 사명 반영 */
export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-2.5", className)} aria-label="CEA 홈">
      <img
        src="/cea-logo.png"
        alt="CEA 심볼 로고"
        className="size-9 rounded-full bg-white/95 p-0.5 object-contain shadow-xs"
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
  { href: "#education", label: "온라인 교육" },
  { href: "#process", label: "진행 방식" },
  { href: "#faq", label: "자주 묻는 질문" },
];

export function Header() {
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
        "sticky top-0 z-50 border-b border-transparent transition-colors duration-200",
        scrolled && "border-border bg-background/85 backdrop-blur-md",
      )}
    >
      <div className="container flex h-16 items-center gap-8">
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
          <Button asChild variant="outline" size="sm" className="hidden h-9 px-3 text-xs font-bold sm:inline-flex">
            <a href="#lms">나의 강의실</a>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden h-9 px-3 text-xs font-bold lg:inline-flex">
            <a href="#apply">기업 아이디 등록폼</a>
          </Button>
          <Button asChild variant="secondary" size="sm" className="hidden h-9 px-3 text-xs font-bold sm:inline-flex">
            <a href="#admin">관리자 콘솔</a>
          </Button>
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
            <a href="#admin" className="py-2.5 text-sm font-bold" onClick={() => setOpen(false)}>
              관리자 콘솔 (14대 메뉴)
            </a>
            <Button asChild className="mt-2 h-11 font-semibold">
              <a href="#contact" onClick={() => setOpen(false)}>
                상담 신청
              </a>
            </Button>
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
          <p className="text-xs">© {new Date().getFullYear()} 주식회사 씨이에이(CEA). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

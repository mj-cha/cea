import { useEffect, useState } from "react";
import { Footer, Header } from "@/components/layout";
import { AdminLoginGate, LoginModal } from "@/components/login-modal";
import { LmsProvider, useLms } from "@/lib/lms-store";
import { ServiceProvider } from "@/lib/service-context";
import { useStudioChildBridge } from "@/lib/studio-bridge";
import { AdminConsole } from "@/sections/admin-console";
import { Contact, Faq, Fit, Process, WhyNow } from "@/sections/content";
import { Education } from "@/sections/education";
import { Hero } from "@/sections/hero";
import { LmsPortal } from "@/sections/lms-portal";
import { Publications } from "@/sections/publications";
import { Services } from "@/sections/services";
import { StudioShell } from "@/sections/studio-shell";

type ViewMode = "home" | "lms" | "apply" | "admin" | "studio";

function parseHashMode(hash: string): ViewMode {
  if (hash.startsWith("#__studio")) return "studio";
  if (hash.startsWith("#admin")) return "admin";
  if (hash.startsWith("#apply")) return "apply";
  if (hash.startsWith("#lms")) return "lms";
  return "home";
}

function AppShell() {
  useStudioChildBridge();
  const { isAdminLoggedIn, loggedInUser, setLoginModalOpen } = useLms();
  const [mode, setMode] = useState<ViewMode>(() => parseHashMode(window.location.hash));
  const isEmbed = new URLSearchParams(window.location.search).get("studio_embed") === "1";

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHashMode(window.location.hash);
      setMode(next);
      if (next !== "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const goHash = (h: string) => {
    window.location.hash = h;
    setMode(parseHashMode(h));
  };

  if (mode === "studio" && !isEmbed) {
    return <StudioShell onExit={() => goHash("#top")} />;
  }

  const navItems: [ViewMode, string, string][] = [
    ["home", "#top", "① 브랜드 홈페이지"],
    ["lms", "#lms", "② 온라인 강의실 (진도율·수료증)"],
    ["apply", "#apply", "③ 기업 전용 아이디 등록폼 (자동오픈)"],
  ];
  if (isAdminLoggedIn) {
    navItems.push(["admin", "#admin", "④ 관리자 콘솔 (14대 메뉴 · 수료증 일괄출력)"]);
    navItems.push(["studio", "#__studio", "⑤ 스튜디오 뷰어"]);
  }

  return (
    <>
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        본문 바로가기
      </a>
      <Header />

      {/* 상단 모드 전환 바 */}
      {!isEmbed && (
        <div className="border-b bg-muted/50 py-2 print:hidden">
          <div className="container flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-muted-foreground">
              주식회사 씨이에이(CEA) · <strong className="text-foreground">www.cea.co.kr</strong>
              {loggedInUser
                ? ` · 접속중: ${loggedInUser.name} (${loggedInUser.corpName} ${loggedInUser.department})`
                : " · 관리자 로그인 시 관리자 콘솔이 활성화됩니다"}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {navItems.map(([m, h, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => goHash(h)}
                  className={`rounded-full px-3 py-1 font-bold transition-colors ${
                    mode === m
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
              {!isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-bold text-primary transition-colors hover:bg-primary/20"
                >
                  관리자 로그인 (차명진 대표)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main>
        {mode === "admin" ? (
          isAdminLoggedIn ? (
            <AdminConsole onGoLms={() => goHash("#lms")} />
          ) : (
            <AdminLoginGate />
          )
        ) : mode === "lms" || mode === "apply" ? (
          <LmsPortal
            initialTab={mode === "apply" ? "apply" : "classroom"}
            onGoAdmin={() => (isAdminLoggedIn ? goHash("#admin") : setLoginModalOpen(true))}
          />
        ) : (
          <>
            <Hero />
            <WhyNow />
            <Services />
            <Publications />
            <Education />
            <LmsPortal
              initialTab="classroom"
              onGoAdmin={() => (isAdminLoggedIn ? goHash("#admin") : setLoginModalOpen(true))}
            />
            <Process />
            <Fit />
            <Faq />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <LoginModal />
    </>
  );
}

export function App() {
  return (
    <LmsProvider>
      <ServiceProvider>
        <AppShell />
      </ServiceProvider>
    </LmsProvider>
  );
}

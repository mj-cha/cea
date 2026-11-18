import { useEffect, useState } from "react";
import { Footer, Header } from "@/components/layout";
import { LmsProvider } from "@/lib/lms-store";
import { ServiceProvider } from "@/lib/service-context";
import { useStudioChildBridge } from "@/lib/studio-bridge";
import { AdminConsole } from "@/sections/admin-console";
import { Contact, Faq, Fit, Process, WhyNow } from "@/sections/content";
import { Education } from "@/sections/education";
import { Hero } from "@/sections/hero";
import { LmsPortal } from "@/sections/lms-portal";
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

export function App() {
  useStudioChildBridge();
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

  return (
    <LmsProvider>
      <ServiceProvider>
        <a
          href="#services"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          본문 바로가기
        </a>
        <Header />

        {/* 상단 모드 전환 바 (홈페이지 · 강의실 · 기업전용 폼 · 14대 관리자 콘솔 · 스튜디오 뷰어) */}
        {!isEmbed && (
        <div className="border-b bg-muted/30 py-2 print:hidden">
          <div className="container flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-muted-foreground">
              CEA 통합 플랫폼 (`www.cea.co.kr`) 화면 전환:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  ["home", "#top", "① 브랜드 홈페이지"],
                  ["lms", "#lms", "② 온라인 강의실 (진도율·수료증)"],
                  ["apply", "#apply", "③ 기업 전용 아이디 등록폼 (자동오픈)"],
                  ["admin", "#admin", "④ 관리자 콘솔 (14대 메뉴 · 수료증 일괄출력)"],
                  ["studio", "#__studio", "⑤ 스튜디오 뷰어 (전체 화면 검수)"],
                ] as const
              ).map(([m, h, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => goHash(h)}
                  className={`rounded-full px-3 py-1 font-bold transition-colors ${
                    mode === m
                      ? "bg-primary text-primary-foreground"
                      : "border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        )}

        <main>
          {mode === "admin" ? (
            <AdminConsole onGoLms={() => goHash("#lms")} />
          ) : mode === "lms" || mode === "apply" ? (
            <LmsPortal
              initialTab={mode === "apply" ? "apply" : "classroom"}
              onGoAdmin={() => goHash("#admin")}
            />
          ) : (
            <>
              <Hero />
              <WhyNow />
              <Services />
              <Education />
              <LmsPortal initialTab="classroom" onGoAdmin={() => goHash("#admin")} />
              <Process />
              <Fit />
              <Faq />
              <Contact />
            </>
          )}
        </main>
        <Footer />
      </ServiceProvider>
    </LmsProvider>
  );
}

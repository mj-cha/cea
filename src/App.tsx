import { useEffect, useState } from "react";
import { Footer, Header, type AppViewMode } from "@/components/layout";
import { LoginGate, LoginModal } from "@/components/login-modal";
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

function parseHashMode(hash: string): AppViewMode {
  const clean = hash.split("?")[0] || "#top";
  if (clean.startsWith("#__studio")) return "studio";
  if (clean.startsWith("#admin")) return "admin";
  if (clean.startsWith("#apply")) return "apply";
  if (clean.startsWith("#lms")) return "lms";
  if (clean.startsWith("#services")) return "services";
  if (clean.startsWith("#publications")) return "publications";
  if (clean.startsWith("#education")) return "education";
  if (clean.startsWith("#process") || clean.startsWith("#fit")) return "process";
  if (clean.startsWith("#faq")) return "faq";
  if (clean.startsWith("#contact")) return "contact";
  return "home";
}

function AppShell() {
  useStudioChildBridge();
  const { isAdminLoggedIn, loggedInUser, setLoginModalOpen } = useLms();
  const [mode, setMode] = useState<AppViewMode>(() => parseHashMode(window.location.hash));
  const isEmbed = new URLSearchParams(window.location.search).get("studio_embed") === "1";

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash;
      const next = parseHashMode(h);
      setMode(next);
      if (h === "#why-now" || h === "#fit") {
        requestAnimationFrame(() => {
          document.querySelector(h)?.scrollIntoView({ behavior: "smooth" });
        });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const goHash = (h: string) => {
    if (window.location.hash === h) {
      setMode(parseHashMode(h));
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    window.location.hash = h;
  };

  if (mode === "studio" && !isEmbed) {
    return <StudioShell onExit={() => goHash("#top")} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        본문 바로가기
      </a>
      <Header currentMode={mode} onNavigate={goHash} />

      <main id="main-content" className="flex-1">
        {mode === "admin" ? (
          isAdminLoggedIn ? (
            <AdminConsole onGoLms={() => goHash("#lms")} />
          ) : (
            <LoginGate title="관리자 전용 화면입니다" desc="관리자 계정으로 로그인하면 운영 콘솔이 열립니다." />
          )
        ) : mode === "lms" && !loggedInUser ? (
          <LoginGate
            title="로그인이 필요합니다"
            desc="나의 강의실은 수강 계정으로 로그인한 뒤 이용할 수 있습니다."
          />
        ) : mode === "lms" || mode === "apply" ? (
          <LmsPortal
            initialTab={mode === "apply" ? "apply" : "classroom"}
            onGoAdmin={() => (isAdminLoggedIn ? goHash("#admin") : setLoginModalOpen(true))}
          />
        ) : mode === "services" ? (
          <Services />
        ) : mode === "publications" ? (
          <Publications />
        ) : mode === "education" ? (
          <Education />
        ) : mode === "process" ? (
          <>
            <Process />
            <Fit />
          </>
        ) : mode === "faq" ? (
          <Faq />
        ) : mode === "contact" ? (
          <Contact />
        ) : (
          <>
            <Hero />
            <WhyNow />
          </>
        )}
      </main>
      <Footer onNavigate={goHash} />
      <LoginModal />
    </div>
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

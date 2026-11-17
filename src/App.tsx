import { Footer, Header } from "@/components/layout";
import { ServiceProvider } from "@/lib/service-context";
import { Hero } from "@/sections/hero";
import { Services } from "@/sections/services";
import { Education } from "@/sections/education";
import { Contact, Faq, Fit, Process, WhyNow } from "@/sections/content";

export function App() {
  return (
    <ServiceProvider>
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        본문 바로가기
      </a>
      <Header />
      <main>
        <Hero />
        <WhyNow />
        <Services />
        <Education />
        <Process />
        <Fit />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </ServiceProvider>
  );
}

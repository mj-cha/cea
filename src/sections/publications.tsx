import { useRef, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, Lock, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PUBLIC_PUB_CATEGORIES,
  publicNotices,
  type PublicPubCategory,
  type SupportStatus,
} from "@/data/publications-public";
import { services } from "@/data/services";
import { useLms } from "@/lib/lms-store";
import { useService } from "@/lib/service-context";
import { cn } from "@/lib/utils";
import { PublicationsAdminBoard } from "@/sections/publications-admin-board";

const STATUS_TONE: Record<SupportStatus, string> = {
  접수중: "bg-emerald-600 text-white",
  상시접수: "bg-primary text-primary-foreground",
  공고예정: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30",
  연구발간: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30",
  정책브리핑: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30",
};

type ArchivePeriod = "all" | "2026-h2" | "2026-h1" | "2025";

function matchPeriod(date: string, p: ArchivePeriod) {
  if (p === "all") return true;
  if (p === "2025") return date.startsWith("2025");
  if (p === "2026-h1") return date >= "2026-01" && date <= "2026-06";
  return date >= "2026-07";
}

export function Publications() {
  const { isAdminLoggedIn } = useLms();
  const { select, requestConsult } = useService();

  const [boardView, setBoardView] = useState<"public" | "admin">("public");
  const [pubCat, setPubCat] = useState<PublicPubCategory>("전체");
  const [period, setPeriod] = useState<ArchivePeriod>("all");
  const [query, setQuery] = useState("");
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>(publicNotices[0].id);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const handleSelectNotice = (id: string) => {
    setSelectedNoticeId(id);
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const showAdminBoard = isAdminLoggedIn && boardView === "admin";

  const q = query.trim().toLowerCase();
  const filteredPublic = publicNotices.filter((item) => {
    if (pubCat !== "전체" && item.category !== pubCat) return false;
    if (!matchPeriod(item.date, period)) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.agency.toLowerCase().includes(q) ||
      item.topicTag.toLowerCase().includes(q) ||
      item.fitReason.toLowerCase().includes(q)
    );
  });

  const activeNotice = filteredPublic.find((n) => n.id === selectedNoticeId) ?? filteredPublic[0] ?? publicNotices[0];
  const noticeService = services.find((s) => s.id === activeNotice.relatedServiceId);

  return (
    <section id="publications" className="bg-muted/20 py-14 md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2.5 text-[13px] font-bold text-primary">공공 지원사업 · 정책 리서치 아카이브 (최근 1년)</p>
            <h2 className="text-[30px] leading-tight font-extrabold tracking-[-0.03em] break-keep md:text-[40px]">
              ESG 정부지원사업 공고 &amp; 공공기관 발간물 모아보기
            </h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed break-keep text-muted-foreground">
              한국환경산업기술원(KEITI)·에너지경제연구원(KEEI)·한국환경공단·중소벤처기업부·고용노동부 등 주요 공공기관의 ESG 국고보조·바우처 공고와 연구 브리핑을 정기 업데이트하여 최근 1년 아카이브로 제공합니다.
            </p>
          </div>

          {isAdminLoggedIn && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-xl border bg-card p-1">
              <button
                type="button"
                onClick={() => setBoardView("public")}
                className={cn(
                  "min-h-10 rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors",
                  boardView === "public" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                고객사 공개 (공공 지원사업)
              </button>
              <button
                type="button"
                onClick={() => setBoardView("admin")}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors",
                  boardView === "admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Lock className="size-3.5" />
                관리자 전용 (내부 레퍼런스)
              </button>
            </div>
          )}
        </div>

        {showAdminBoard ? (
          <PublicationsAdminBoard />
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
              <Tabs value={pubCat} onValueChange={(v) => setPubCat(v as PublicPubCategory)}>
                <TabsList aria-label="공공 자료 분류 필터" className="flex h-auto! flex-wrap gap-1 p-1">
                  {PUBLIC_PUB_CATEGORIES.map((c) => (
                    <TabsTrigger key={c} value={c} className="min-h-11 px-3.5 py-2 text-xs font-bold whitespace-nowrap sm:text-sm">
                      {c}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <select
                  aria-label="최근 1년 아카이브 시기 선택"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as ArchivePeriod)}
                  className="h-11 w-full rounded-lg border bg-background px-3 text-xs font-bold sm:w-auto"
                >
                  <option value="all">최근 1년 전체 (2025.12 ~ 2026.11)</option>
                  <option value="2026-h2">2026년 하반기 (07 ~ 11월)</option>
                  <option value="2026-h1">2026년 상반기 (01 ~ 06월)</option>
                  <option value="2025">2025년 연말 아카이브</option>
                </select>
                <div className="relative w-full min-w-0 flex-1 sm:min-w-[210px] sm:w-64">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="기관명·지원사업·키워드 검색"
                    aria-label="지원사업 및 정책 자료 검색"
                    className="h-11 pl-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5.5fr)_minmax(0,6.5fr)]">
              <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3.5">
                  <span className="text-xs font-extrabold text-foreground">모아보기 목록 ({filteredPublic.length}건)</span>
                  <span className="text-[11px] font-semibold text-muted-foreground">최근 1년 정기 아카이브</span>
                </div>

                {filteredPublic.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">검색 조건에 맞는 공고·자료가 없습니다.</p>
                ) : (
                  <ul className="max-h-[360px] divide-y overflow-y-auto lg:max-h-[680px]" role="listbox" aria-label="공공 지원사업 및 발간물 목록">
                    {filteredPublic.map((item) => {
                      const isSelected = item.id === activeNotice.id;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleSelectNotice(item.id)}
                            className={cn(
                              "flex min-h-11 w-full flex-col gap-1.5 px-4 py-4 text-left transition-colors",
                              isSelected ? "border-l-4 border-l-primary bg-primary/10" : "hover:bg-muted/50",
                            )}
                          >
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", STATUS_TONE[item.status])}>
                                {item.status}
                              </span>
                              <span className="text-xs font-bold text-primary">{item.agency}</span>
                              <span className="ml-auto font-mono text-[11px] text-muted-foreground">{item.date}</span>
                            </div>
                            <p className={cn("text-[14.5px] leading-[1.5] break-keep", isSelected ? "font-extrabold" : "font-semibold")}>
                              {item.title}
                            </p>
                            <p className="line-clamp-1 text-xs text-muted-foreground">{item.targetScale}</p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div ref={detailRef} className="scroll-mt-24">
              <Card className="overflow-hidden border-primary/30 py-0 shadow-md">
                <CardHeader className="border-b bg-card px-5 py-5 sm:px-6">
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-extrabold", STATUS_TONE[activeNotice.status])}>
                        {activeNotice.status}
                      </span>
                      <Badge variant="outline" className="font-bold text-primary">{activeNotice.agency}</Badge>
                      <Badge variant="secondary" className="text-xs">{activeNotice.topicTag}</Badge>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{activeNotice.date} · {activeNotice.periodText}</span>
                  </div>
                  <CardTitle className="text-xl leading-[1.4] font-extrabold break-keep md:text-2xl">
                    {activeNotice.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-[13px] leading-relaxed font-semibold text-foreground/80">
                    대상 · 지원 규모: {activeNotice.targetScale}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 p-5 sm:p-6">
                  <div className="rounded-xl border border-primary/30 bg-primary/8 p-4 sm:p-5">
                    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-primary">
                      <Sparkles className="size-3.5" />
                      기업 활용 포인트 (왜 확인해야 하나요?)
                    </p>
                    <p className="text-[14.5px] leading-[1.75] font-semibold break-keep text-foreground">
                      {activeNotice.fitReason}
                    </p>
                  </div>

                  <div className="space-y-4 text-[15px] leading-[1.8] break-keep text-foreground/90">
                    {activeNotice.summary.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  <div className="rounded-xl border bg-muted/40 p-4 sm:p-5">
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold text-primary">
                      <BookOpen className="size-4" />
                      핵심 요건 · 실무 체크포인트
                    </p>
                    <ul className="space-y-2.5">
                      {activeNotice.keyPoints.map((kp) => (
                        <li key={kp} className="flex items-start gap-2.5 text-[14px] leading-[1.72] font-medium break-keep">
                          <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {noticeService && (
                      <Button asChild variant="outline" size="sm" onClick={() => select(noticeService.id)} className="min-h-11 gap-1.5 px-3.5 font-bold">
                        <a href="#services">
                          연계 자문: {noticeService.title}
                          <ArrowRight className="size-3.5" />
                        </a>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      onClick={() => requestConsult(noticeService?.title ?? "기업 단체·환급과정 문의")}
                      className="min-h-11 px-3.5 font-bold"
                    >
                      <a href="#contact">지원사업 연계 상담 신청</a>
                    </Button>
                  </div>

                  <Button asChild size="sm" className="min-h-11 gap-1.5 px-3.5 font-bold">
                    <a href={activeNotice.externalUrl} target="_blank" rel="noreferrer">
                      주관 기관 바로가기
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

import { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, FileText, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PUB_CATEGORIES, publications, type PubCategory } from "@/data/publications";
import { services } from "@/data/services";
import { useService } from "@/lib/service-context";
import { cn } from "@/lib/utils";

export function Publications() {
  const { select, requestConsult } = useService();
  const [category, setCategory] = useState<PubCategory>("전체");
  const filtered = category === "전체" ? publications : publications.filter((p) => p.category === category);
  const [selectedId, setSelectedId] = useState<string>(publications[0].id);

  const activeItem = filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? publications[0];
  const relatedService = services.find((s) => s.id === activeItem.relatedServiceId);

  const handleCategoryChange = (next: string) => {
    const cat = next as PubCategory;
    setCategory(cat);
    const list = cat === "전체" ? publications : publications.filter((p) => p.category === cat);
    if (list.length > 0 && !list.some((p) => p.id === selectedId)) {
      setSelectedId(list[0].id);
    }
  };

  return (
    <section id="publications" className="border-t bg-muted/20 py-20 md:py-28">
      <div className="container">
        <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-16">
          <div>
            <p className="mb-3 text-[13px] font-bold tracking-wider text-primary uppercase">
              Sustainability Publications &amp; Insights
            </p>
            <h2 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] md:text-[42px]">
              글로벌 · 4대 회계법인 · 로펌
              <br />
              지속가능성 발간물 &amp; 브리핑
            </h2>
          </div>
          <p className="text-[16px] leading-relaxed text-muted-foreground">
            삼일PwC Sustainability Platform을 비롯해 삼정KPMG·딜로이트·EY한영 등 4대 회계법인, 주요 대형 법무법인, 임팩트온 전문 기사 및 유튜브 영상 브리핑을 한곳에 모았습니다. <strong>우측 리스트에서 제목을 클릭하시면 좌측 카드에 상세 브리핑과 영상이 표시됩니다.</strong>
          </p>
        </div>

        {/* 상단 출처 카테고리 필터 */}
        <Tabs value={category} onValueChange={handleCategoryChange} className="mb-8">
          <TabsList aria-label="발간물 출처별 필터" className="flex h-auto! flex-wrap gap-1 p-1">
            {PUB_CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c} className="px-4 py-2 text-xs font-bold sm:text-sm">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* 2분할 게시판 레이아웃: 좌측 상세 카드 (7fr) / 우측 제목 리스트업 (5fr) */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* 좌측: 선택된 발간물/영상 상세 카드 */}
          <Card className="overflow-hidden border-primary/30 py-0 shadow-md">
            <CardHeader className="border-b bg-card px-6 py-5">
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground font-bold">{activeItem.source}</Badge>
                  <Badge variant="outline" className="font-semibold text-primary">
                    {activeItem.topicTag}
                  </Badge>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  No.{activeItem.no} · {activeItem.date}
                </span>
              </div>
              <CardTitle className="text-xl leading-snug font-extrabold md:text-2xl">
                {activeItem.title}
              </CardTitle>
              <CardDescription className="mt-1 text-xs font-medium">
                출처 · 작성: {activeItem.authorOrDept}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              {/* 유튜브 영상 게시물일 경우 임베드 플레이어 즉시 렌더링 */}
              {activeItem.youtubeEmbedUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-xl border bg-slate-950 shadow-inner">
                  <iframe
                    key={activeItem.youtubeEmbedUrl}
                    src={activeItem.youtubeEmbedUrl}
                    title={activeItem.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* 핵심 요약 브리핑 */}
              <div className="space-y-3 text-[15px] leading-relaxed text-foreground/90">
                {activeItem.summary.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* 실무 시사점 (Key Takeaways) */}
              <div className="rounded-xl border bg-muted/40 p-4">
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-extrabold tracking-wide text-primary uppercase">
                  <BookOpen className="size-4" />
                  핵심 실무 시사점 (Key Takeaways)
                </p>
                <ul className="space-y-2">
                  {activeItem.keyTakeaways.map((kt) => (
                    <li key={kt} className="flex items-start gap-2 text-xs leading-relaxed font-medium sm:text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{kt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-6 py-4">
              <div className="flex flex-wrap items-center gap-2">
                {relatedService && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    onClick={() => select(relatedService.id)}
                    className="gap-1.5 font-bold"
                  >
                    <a href="#services">
                      연계 컨설팅: {relatedService.title} 보기
                      <ArrowRight className="size-3.5" />
                    </a>
                  </Button>
                )}
                {relatedService && (
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    onClick={() => requestConsult(relatedService.title)}
                    className="font-bold"
                  >
                    <a href="#contact">이 주제로 상담 신청</a>
                  </Button>
                )}
              </div>

              <Button asChild size="sm" className="gap-1.5 font-bold">
                <a href={activeItem.externalUrl} target="_blank" rel="noreferrer">
                  원문 리포트 · 출처 바로가기
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* 우측: 제목 리스트업 게시판 (클릭 시 좌측 카드 내용 즉시 전환) */}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3.5">
              <span className="text-xs font-extrabold tracking-tight text-foreground">
                발간물 · 기사 · 영상 리스트 ({filtered.length}건)
              </span>
              <span className="text-[11px] font-semibold text-primary">
                제목을 클릭하면 좌측 카드가 바뀝니다
              </span>
            </div>

            <ul className="divide-y" role="listbox" aria-label="지속가능성 발간물 제목 목록">
              {filtered.map((item) => {
                const isSelected = item.id === activeItem.id;
                const isVideo = Boolean(item.youtubeEmbedUrl);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
                        isSelected
                          ? "border-l-4 border-l-primary bg-primary/10"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <span className="mt-0.5 font-mono text-xs font-bold text-muted-foreground">
                        {item.no}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant={isSelected ? "default" : "outline"}
                            className="px-2 py-0 text-[10px] font-bold"
                          >
                            {item.source}
                          </Badge>
                          <span className="text-[11px] font-semibold text-primary">
                            {item.topicTag}
                          </span>
                          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                            {item.date}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "line-clamp-2 text-[13px] leading-snug",
                            isSelected ? "font-extrabold text-foreground" : "font-semibold text-foreground/85",
                          )}
                        >
                          {item.title}
                        </p>
                      </div>
                      <span className="mt-1 shrink-0 text-primary">
                        {isVideo ? <PlayCircle className="size-4" /> : <FileText className="size-4 opacity-70" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

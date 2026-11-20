import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PUB_CATEGORIES, publications, type PubCategory } from "@/data/publications";
import { cn } from "@/lib/utils";

/** 관리자 로그인 시에만 접근 가능한 내부 레퍼런스 아카이브 */
export function PublicationsAdminBoard() {
  const [adminCat, setAdminCat] = useState<PubCategory>("전체");
  const [selectedAdminId, setSelectedAdminId] = useState<string>(publications[0].id);

  const filteredAdmin = adminCat === "전체" ? publications : publications.filter((p) => p.category === adminCat);
  const activeAdmin = filteredAdmin.find((p) => p.id === selectedAdminId) ?? filteredAdmin[0] ?? publications[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs font-semibold">
        <span>관리자 전용 내부 참고용 아카이브입니다. 일반 고객 화면에는 표시되지 않습니다.</span>
        <Tabs value={adminCat} onValueChange={(v) => setAdminCat(v as PubCategory)}>
          <TabsList className="flex h-auto! flex-wrap gap-1 p-1">
            {PUB_CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c} className="px-3 py-1 text-xs font-bold">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Card className="overflow-hidden py-0">
          <CardHeader className="border-b px-6 py-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Badge>{activeAdmin.source}</Badge>
              <span className="font-mono text-xs text-muted-foreground">{activeAdmin.date}</span>
            </div>
            <CardTitle className="text-lg font-extrabold break-keep">{activeAdmin.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 text-sm leading-relaxed break-keep">
            {activeAdmin.summary.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </CardContent>
        </Card>
        <div className="overflow-hidden rounded-2xl border bg-card">
          <ul className="divide-y">
            {filteredAdmin.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => setSelectedAdminId(it.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-xs",
                    it.id === activeAdmin.id ? "bg-primary/10 font-bold" : "hover:bg-muted/50",
                  )}
                >
                  <span className="mr-2 text-primary">[{it.source}]</span>
                  {it.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

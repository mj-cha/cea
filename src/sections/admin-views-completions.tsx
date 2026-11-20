import { useState } from "react";
import { Award, CheckSquare, CreditCard, MessageSquare, Printer } from "lucide-react";
import { CertificateBatchModal, type CertificatePrintItem } from "@/components/certificate-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLms } from "@/lib/lms-store";
import type { AdminMenuId } from "@/lib/lms-types";

export function AdminViewsCompletions({ menu }: { menu: AdminMenuId }) {
  const { courseMedia, corps, users, payments, qnas, answerQnA, logBatchCertificatePrint } = useLms();
  const [selectedCorpCode, setSelectedCorpCode] = useState<string>("all");
  const [uncheckedKeys, setUncheckedKeys] = useState<string[]>([]);
  const [certModalItems, setCertModalItems] = useState<CertificatePrintItem[]>([]);
  const [qnaDrafts, setQnaDrafts] = useState<Record<string, string>>({});

  /* 12. 기업별 교육 이수 내역 (★ 핵심: 수료증 일괄 출력) */
  if (menu === "corp-completions") {
    const completionRows: (CertificatePrintItem & { rowKey: string; isCompleted: boolean })[] = [];
    for (const u of users) {
      if (selectedCorpCode !== "all" && u.corpCode !== selectedCorpCode) continue;
      for (const cid of u.enrolledCourseIds) {
        const cm = courseMedia.find((m) => m.courseId === cid);
        const pct = u.progress[cid] ?? 0;
        const pass = cm?.passRate ?? 80;
        const isCompleted = pct >= pass;
        completionRows.push({
          rowKey: `${u.id}::${cid}`,
          isCompleted,
          certNo: u.certNumbers[cid] ?? `CEA-2026-${u.id.slice(-3)}`,
          userName: u.name,
          userEmail: u.email,
          corpName: u.corpName,
          department: u.department,
          courseTitle: cm?.title ?? cid,
          durationMin: cm?.durationMin ?? 90,
          progress: pct,
          completedAt: u.completedAt[cid] ?? "학습중",
        });
      }
    }

    const completedRows = completionRows.filter((r) => r.isCompleted);
    const selectedCertItems = completedRows.filter((r) => !uncheckedKeys.includes(r.rowKey));

    const toggleRow = (key: string) => {
      setUncheckedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    };

    const handleBatchPrint = () => {
      if (selectedCertItems.length === 0) return;
      const targetCorpName =
        selectedCorpCode === "all"
          ? "전체 기업"
          : (corps.find((c) => c.code === selectedCorpCode)?.name ?? selectedCorpCode);
      logBatchCertificatePrint(targetCorpName, selectedCertItems.length);
      setCertModalItems(selectedCertItems);
    };

    return (
      <div className="space-y-6">
        <Card className="border-primary/40 py-5">
          <CardHeader className="px-6 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge className="mb-1.5 bg-primary/15 text-primary">★ 핵심 관리 기능</Badge>
                <CardTitle className="flex items-center gap-2 text-xl font-extrabold">
                  <Award className="size-5 text-primary" />
                  기업별 교육 이수 내역 & 수료증 일괄 출력
                </CardTitle>
                <CardDescription>
                  기업을 선택해 임직원별 학습 진도율을 확인하고, 수료 완료자의 공식 수료증을 한 번에 일괄 인쇄(PDF 저장)합니다.
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="이수 내역 조회 기업 선택"
                  value={selectedCorpCode}
                  onChange={(e) => {
                    setSelectedCorpCode(e.target.value);
                    setUncheckedKeys([]);
                  }}
                  className="h-10 rounded-md border bg-background px-3 text-sm font-bold"
                >
                  <option value="all">전체 기업 보기 ({corps.length}개 법인)</option>
                  {corps.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Button onClick={handleBatchPrint} disabled={selectedCertItems.length === 0} className="h-10 gap-2 font-bold">
                  <Printer className="size-4" />
                  선택 수료증 일괄 출력 ({selectedCertItems.length}건)
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                조회된 수강 내역 총 <strong>{completionRows.length}건</strong> (수료 완료{" "}
                <strong className="text-primary">{completedRows.length}건</strong> / 미수료{" "}
                {completionRows.length - completedRows.length}건)
              </span>
              <button
                type="button"
                onClick={() => setUncheckedKeys([])}
                className="flex items-center gap-1 font-semibold text-foreground underline underline-offset-4"
              >
                <CheckSquare className="size-3.5 text-primary" />
                수료 완료자 전체 선택
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2.5">출력선택</th>
                    <th className="py-2.5">소속 법인 · 부서</th>
                    <th className="py-2.5">성명 (아이디)</th>
                    <th className="py-2.5">과정명</th>
                    <th className="py-2.5">학습률</th>
                    <th className="py-2.5">수료 상태 · 증서번호</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {completionRows.map((row) => {
                    const checked = row.isCompleted && !uncheckedKeys.includes(row.rowKey);
                    return (
                      <tr key={row.rowKey} className={row.isCompleted ? "" : "opacity-60"}>
                        <td className="py-3">
                          <input
                            type="checkbox"
                            aria-label={`${row.userName} ${row.courseTitle} 수료증 선택`}
                            disabled={!row.isCompleted}
                            checked={checked}
                            onChange={() => toggleRow(row.rowKey)}
                            className="size-4 accent-blue-600"
                          />
                        </td>
                        <td className="py-3 text-xs">
                          <strong>{row.corpName}</strong> ({row.department})
                        </td>
                        <td className="py-3 font-bold">
                          {row.userName} <span className="text-xs font-normal text-muted-foreground">({row.userEmail})</span>
                        </td>
                        <td className="py-3 text-xs font-semibold">{row.courseTitle}</td>
                        <td className="py-3 font-bold text-primary">{row.progress}%</td>
                        <td className="py-3 text-xs">
                          {row.isCompleted ? (
                            <Badge className="bg-primary/15 text-primary">수료완료 ({row.certNo})</Badge>
                          ) : (
                            <Badge variant="outline">미수료 (기준 80% 미만)</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <CertificateBatchModal
          open={certModalItems.length > 0}
          onClose={() => setCertModalItems([])}
          items={certModalItems}
          title="기업별 교육 수료증 일괄 출력"
        />
      </div>
    );
  }

  /* 13. Q&A 이력 */
  if (menu === "qna-history") {
    return (
      <Card className="py-5">
        <CardHeader className="px-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
            <MessageSquare className="size-5 text-primary" />
            Q&A 이력 (강의 질문 및 기업 실무 문의 답변 관리)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          {qnas.map((q) => (
            <div key={q.id} className="space-y-2.5 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={q.status === "답변완료" ? "default" : "outline"}>{q.status}</Badge>
                  <span className="text-xs font-bold text-primary">{q.courseTitle}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {q.corpName} · {q.authorName} ({q.createdAt})
                </span>
              </div>
              <p className="text-sm font-bold">Q. {q.question}</p>
              {q.answer ? (
                <p className="rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-foreground">
                  <strong>A.</strong> {q.answer}
                </p>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Input
                    value={qnaDrafts[q.id] ?? ""}
                    onChange={(e) => setQnaDrafts((p) => ({ ...p, [q.id]: e.target.value }))}
                    placeholder="수석 컨설턴트 답변을 입력해 주세요..."
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      answerQnA(q.id, qnaDrafts[q.id] ?? "");
                      setQnaDrafts((p) => ({ ...p, [q.id]: "" }));
                    }}
                  >
                    답변 등록
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  /* 14. 결제 내역과 누적 매출 */
  const completedSum = payments.filter((p) => p.status === "결제완료").reduce((s, p) => s + p.amount, 0);
  const pendingSum = payments.filter((p) => p.status === "발행대기").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="py-4">
          <CardHeader className="px-5 pb-1">
            <CardDescription className="text-xs font-semibold">누적 확정 매출 (결제완료)</CardDescription>
            <CardTitle className="text-2xl font-extrabold text-primary">{completedSum.toLocaleString()}원</CardTitle>
          </CardHeader>
        </Card>
        <Card className="py-4">
          <CardHeader className="px-5 pb-1">
            <CardDescription className="text-xs font-semibold">세금계산서 정산 대기</CardDescription>
            <CardTitle className="text-2xl font-extrabold">{pendingSum.toLocaleString()}원</CardTitle>
          </CardHeader>
        </Card>
        <Card className="py-4">
          <CardHeader className="px-5 pb-1">
            <CardDescription className="text-xs font-semibold">총 계약 결제 건수</CardDescription>
            <CardTitle className="text-2xl font-extrabold">{payments.length}건</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="py-5">
        <CardHeader className="px-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
            <CreditCard className="size-5 text-primary" />
            결제 내역과 누적 매출 (B2B 일괄 결제 · 세금계산서 · 법인카드)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs text-muted-foreground">
                <tr>
                  <th className="py-2.5">결제일</th>
                  <th className="py-2.5">계약 법인</th>
                  <th className="py-2.5">결제 항목</th>
                  <th className="py-2.5">결제 수단 · 증빙번호</th>
                  <th className="py-2.5">결제 금액</th>
                  <th className="py-2.5">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 text-xs">{p.paidAt}</td>
                    <td className="py-3 font-bold">{p.corpName}</td>
                    <td className="py-3 text-xs">{p.itemTitle}</td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {p.method} ({p.invoiceNo})
                    </td>
                    <td className="py-3 font-extrabold">{p.amount.toLocaleString()}원</td>
                    <td className="py-3">
                      <Badge variant={p.status === "결제완료" ? "default" : "outline"}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

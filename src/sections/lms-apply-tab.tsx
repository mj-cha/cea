import { useState, type FormEvent } from "react";
import { CheckCircle2, Sparkles, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms-store";

export function LmsApplyTab({
  selectedCorpCode,
  onChangeCorpCode,
  onGoClassroom,
}: {
  selectedCorpCode: string;
  onChangeCorpCode: (code: string) => void;
  onGoClassroom: () => void;
}) {
  const { courseMedia, corps, applyByCorpForm } = useLms();
  const [applyEmail, setApplyEmail] = useState("");
  const [applyName, setApplyName] = useState("");
  const [applyDept, setApplyDept] = useState("");
  const [applyResult, setApplyResult] = useState<{ ok: boolean; message: string } | null>(null);

  const selectedCorp = corps.find((c) => c.code === selectedCorpCode) ?? corps[0];

  const handleApplySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!applyEmail.trim()) return;
    const res = applyByCorpForm({
      corpCode: selectedCorpCode,
      email: applyEmail,
      name: applyName,
      department: applyDept,
    });
    setApplyResult({ ok: res.ok, message: res.message });
    if (res.ok) {
      setApplyEmail("");
      setApplyName("");
      setApplyDept("");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4">
        <Badge className="bg-primary/15 text-primary">기업 전용 링크 (Typeform 스타일 · 비용 0원)</Badge>
        <h2 className="text-2xl font-extrabold tracking-tight">
          기업 담당자에게 전달하는
          <br />
          전용 수강 신청 링크
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          일괄 결제를 마친 기업에 아래 전용 링크를 전달하면, 임직원들이 본인의 가입 아이디(이메일)를 입력하는 즉시 해당 기업의 계약 과정들이 자동으로 열립니다.
        </p>

        <div className="space-y-2 rounded-xl border bg-card p-4">
          <Label htmlFor="corp-select" className="text-xs font-bold text-muted-foreground">
            테스트할 기업 전용 링크 선택
          </Label>
          <select
            id="corp-select"
            value={selectedCorpCode}
            onChange={(e) => {
              onChangeCorpCode(e.target.value);
              setApplyResult(null);
            }}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm font-bold"
          >
            {corps.map((c) => (
              <option key={c.id} value={c.code}>
                {c.name} — 자동 오픈 강의 {c.allowedCourseIds.length}개 ({c.planName})
              </option>
            ))}
          </select>
          <div className="mt-2 rounded-lg bg-muted p-2.5 font-mono text-xs text-foreground">
            https://www.cea.co.kr/#apply?corp={selectedCorp?.code}
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl border bg-muted/20 p-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 font-bold text-foreground">
            <Video className="size-4 text-primary" />
            이 링크로 아이디 제출 시 즉시 열리는 강의 ({selectedCorp?.allowedCourseIds.length}개):
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {selectedCorp?.allowedCourseIds.map((cid) => {
              const cm = courseMedia.find((m) => m.courseId === cid);
              return <li key={cid}>{cm?.title ?? cid}</li>;
            })}
          </ul>
        </div>
      </div>

      <Card className="border-primary/40 shadow-lg">
        <CardHeader className="border-b bg-primary/5 px-6 py-5">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              CORP CODE: {selectedCorp?.code.toUpperCase()}
            </Badge>
            <span className="text-xs font-semibold text-primary">● Supabase 실시간 자동 오픈</span>
          </div>
          <CardTitle className="mt-2 text-xl font-extrabold">
            [{selectedCorp?.name}] 임직원 전용 ESG 교육 수강 신청
          </CardTitle>
          <CardDescription>
            회원가입하신 아이디(이메일)를 입력해 주세요. 제출 즉시 해당 기업의 교육 과정이 자동으로 열립니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="apply-email">1. 가입하신 아이디 (회사 이메일) *</Label>
              <Input
                id="apply-email"
                type="email"
                required
                value={applyEmail}
                onChange={(e) => setApplyEmail(e.target.value)}
                placeholder={`예) gildong.hong@${selectedCorp?.code.replace("-", "")}.co.kr`}
                className="h-11"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="apply-name">2. 성명 *</Label>
                <Input
                  id="apply-name"
                  required
                  value={applyName}
                  onChange={(e) => setApplyName(e.target.value)}
                  placeholder="홍길동"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apply-dept">3. 소속 부서 · 직급</Label>
                <Input
                  id="apply-dept"
                  value={applyDept}
                  onChange={(e) => setApplyDept(e.target.value)}
                  placeholder="예) ESG경영팀 책임"
                  className="h-11"
                />
              </div>
            </div>

            <Button type="submit" className="mt-2 h-12 w-full gap-2 text-base font-bold">
              <Sparkles className="size-4" />
              아이디 제출하고 강의 즉시 열기 ({selectedCorp?.allowedCourseIds.length}개 과정)
            </Button>
          </form>

          {applyResult && (
            <div className="mt-5 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
              <p className="flex items-center gap-2 font-bold text-primary">
                <CheckCircle2 className="size-4" />
                {applyResult.message}
              </p>
              <div className="mt-3">
                <Button size="sm" onClick={onGoClassroom} className="font-semibold">
                  열린 강의실로 바로 이동 →
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

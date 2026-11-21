import { useState, type FormEvent } from "react";
import { CheckCircle2, Sparkles, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms-store";
import { isPersonalEmail } from "@/sections/contact";

export function LmsApplyTab({
  selectedCorpCode,
  onChangeCorpCode,
  onGoClassroom,
}: {
  selectedCorpCode: string;
  onChangeCorpCode: (code: string) => void;
  onGoClassroom: () => void;
}) {
  const { courseMedia, corps, isAdminLoggedIn, applyByCorpForm } = useLms();
  const [applyEmail, setApplyEmail] = useState("");
  const [applyName, setApplyName] = useState("");
  const [applyDept, setApplyDept] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [applyResult, setApplyResult] = useState<{ ok: boolean; message: string } | null>(null);

  const selectedCorp = corps.find((c) => c.code === selectedCorpCode) ?? corps[0];

  const handleApplySubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmailErr("");
    if (!applyEmail.trim()) return;
    if (isPersonalEmail(applyEmail)) {
      setEmailErr("개인 무료 메일은 등록할 수 없습니다. 소속 기업·기관의 업무용 이메일 주소를 입력해 주세요.");
      return;
    }
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
    <div className="grid gap-8 break-keep lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4">
        <Badge className="bg-primary/15 text-primary">기업 단체 수강 등록</Badge>
        <h2 className="text-2xl font-extrabold tracking-tight">
          기업 담당자에게 전달되는{" "}
          <br />
          전용 수강 등록 링크
        </h2>
        <p className="text-sm leading-[1.7] text-muted-foreground">
          단체 수강 계약을 마친 기업에 아래 전용 링크를 전달하면,
          <br />임직원이 본인의 업무용 회사 이메일을 등록하는 즉시 계약된 과정이 열립니다.
        </p>

        <div className="space-y-2 rounded-xl border bg-card p-4">
          <Label htmlFor="corp-select" className="text-xs font-bold text-muted-foreground">
            {isAdminLoggedIn ? "계약 법인 선택 (관리자 전용)" : "배정된 계약 법인"}
          </Label>
          {isAdminLoggedIn ? (
            <select
              id="corp-select"
              value={selectedCorpCode}
              onChange={(e) => {
                onChangeCorpCode(e.target.value);
                setApplyResult(null);
              }}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm font-bold"
            >
              {corps.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.name} · {c.allowedCourseIds.length}개 과정 ({c.planName})
                </option>
              ))}
            </select>
          ) : (
            <p className="rounded-md border bg-muted/40 px-3 py-2.5 text-sm font-bold">
              {selectedCorp?.name} · {selectedCorp?.allowedCourseIds.length}개 과정
            </p>
          )}
          <div className="mt-2 rounded-lg bg-muted p-2.5 font-mono text-xs break-all text-foreground">
            https://www.cea.co.kr/#apply?corp={selectedCorp?.code}
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl border bg-muted/20 p-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 font-bold text-foreground">
            <Video className="size-4 text-primary" />
            등록 즉시 열리는 계약 과정 ({selectedCorp?.allowedCourseIds.length}개)
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
              기업코드: {selectedCorp?.code.toUpperCase()}
            </Badge>
            <span className="text-xs font-semibold text-primary">계약 과정 자동 배정</span>
          </div>
          <CardTitle className="mt-2 text-xl font-extrabold">
            [{selectedCorp?.name}] 임직원 ESG 교육 수강 등록
          </CardTitle>
          <CardDescription>
            소속 기업의 업무용 이메일을 입력해 주세요. 제출 즉시 계약된 교육 과정이 열립니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="apply-email">1. 업무용 이메일 (기업·기관 메일만 가능) *</Label>
              <Input
                id="apply-email"
                type="email"
                required
                value={applyEmail}
                onChange={(e) => {
                  setApplyEmail(e.target.value);
                  if (emailErr) setEmailErr("");
                }}
                placeholder="예) esg@company.co.kr"
                className="h-11"
              />
              {emailErr && (
                <p role="alert" className="text-xs font-bold text-destructive">
                  {emailErr}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="apply-name">2. 담당자 성함 · 직함 *</Label>
                <Input
                  id="apply-name"
                  required
                  value={applyName}
                  onChange={(e) => setApplyName(e.target.value)}
                  placeholder="예) OOO 매니저"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apply-dept">3. 소속 부서</Label>
                <Input
                  id="apply-dept"
                  value={applyDept}
                  onChange={(e) => setApplyDept(e.target.value)}
                  placeholder="예) 전략기획팀 / ESG추진팀"
                  className="h-11"
                />
              </div>
            </div>

            <Button type="submit" className="mt-2 h-12 w-full gap-2 text-base font-bold">
              <Sparkles className="size-4" />
              수강 계정 등록하고 과정 열기 ({selectedCorp?.allowedCourseIds.length}개 과정)
            </Button>
          </form>

          {applyResult && (
            <div className="mt-5 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
              <p className="flex items-center gap-2 font-bold text-primary">
                <CheckCircle2 className="size-4" />
                {applyResult.message}
              </p>
              <div className="mt-3">
                <Button size="sm" onClick={onGoClassroom} className="font-bold">
                  나의 온라인 강의실로 이동 →
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

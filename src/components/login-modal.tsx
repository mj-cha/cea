import { useState, type FormEvent } from "react";
import { Lock, LogIn, ShieldCheck, UserCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms-store";

export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, loginWithEmail } = useLms();
  const [email, setEmail] = useState("admin@cea.co.kr");
  const [password, setPassword] = useState("cea2026!");
  const [err, setErr] = useState("");

  if (!loginModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = loginWithEmail(email);
    if (!res.ok) setErr(res.message);
    else setErr("");
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="CEA 계정 로그인"
    >
      <Card className="w-full max-w-md border-primary/30 py-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img
              src={`${import.meta.env.BASE_URL}cea-logo.png`}
              alt="CEA 로고"
              className="size-8 rounded-full bg-white p-0.5 object-contain shadow-xs"
              width={32}
              height={32}
            />
            <div>
              <CardTitle className="text-base font-extrabold">주식회사 씨이에이(CEA) 로그인</CardTitle>
              <CardDescription className="text-xs">www.cea.co.kr 통합 인증 시스템</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setLoginModalOpen(false)} aria-label="닫기">
            <X className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-5 p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-bold">
                아이디 (회사 이메일)
              </Label>
              <Input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cea.co.kr"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-pw" className="text-xs font-bold">
                비밀번호
              </Label>
              <Input
                id="login-pw"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>
            {err && <p className="text-xs font-semibold text-destructive">{err}</p>}
            <Button type="submit" className="h-11 w-full gap-2 font-bold">
              <LogIn className="size-4" />
              로그인
            </Button>
          </form>

          <div className="space-y-2 border-t pt-4">
            <p className="text-xs font-bold text-muted-foreground">
              빠른 계정 전환 (클릭 시 해당 권한 화면으로 즉시 이동):
            </p>
            <button
              type="button"
              onClick={() => loginWithEmail("admin@cea.co.kr")}
              className="flex w-full items-center justify-between rounded-xl border border-primary/40 bg-primary/10 p-3 text-left text-xs transition-colors hover:bg-primary/15"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                <div>
                  <p className="font-extrabold text-foreground">차명진 대표 · 총괄관리자 (admin@cea.co.kr)</p>
                  <p className="text-[11px] text-muted-foreground">
                    주식회사 씨이에이(CEA) 경영총괄 → 로그인 즉시 관리자 페이지 오픈
                  </p>
                </div>
              </div>
              <Badge className="shrink-0">관리자</Badge>
            </button>

            <button
              type="button"
              onClick={() => loginWithEmail("by.yoo@cea.co.kr")}
              className="flex w-full items-center justify-between rounded-xl border bg-card p-3 text-left text-xs transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="size-4 shrink-0 text-primary" />
                <div>
                  <p className="font-bold text-foreground">유보영 매니저 · 수강생 (by.yoo@cea.co.kr)</p>
                  <p className="text-[11px] text-muted-foreground">
                    주식회사 씨이에이(CEA) ESG컨설팅본부 → 온라인 강의실 오픈
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0">
                수강생
              </Badge>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminLoginGate() {
  const { loginWithEmail, setLoginModalOpen } = useLms();
  return (
    <section className="container py-20">
      <Card className="mx-auto max-w-lg border-primary/30 py-8 text-center shadow-lg">
        <CardHeader className="space-y-3 px-6">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold">관리자 전용 페이지입니다</CardTitle>
          <CardDescription>
            이 화면(14대 운영 콘솔 및 수료증 일괄 출력)은 <strong>주식회사 씨이에이(CEA) 관리자 계정</strong>으로 로그인했을 때만 표시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col items-center justify-center gap-3 px-6 sm:flex-row">
          <Button onClick={() => loginWithEmail("admin@cea.co.kr")} className="h-11 gap-2 px-6 font-bold">
            <ShieldCheck className="size-4" />
            차명진 대표(admin@cea.co.kr) 관리자 로그인
          </Button>
          <Button variant="outline" onClick={() => setLoginModalOpen(true)} className="h-11 font-semibold">
            다른 계정으로 로그인
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

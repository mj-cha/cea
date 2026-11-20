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
              <CardDescription className="text-xs">기업 수강생 · 관리자 인증</CardDescription>
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
                아이디 (업무용 회사 이메일)
              </Label>
              <Input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="esg@company.co.kr"
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
            <p className="text-xs font-bold text-muted-foreground">시연용 빠른 계정 선택:</p>
            <button
              type="button"
              onClick={() => loginWithEmail("admin@cea.co.kr")}
              className="flex w-full items-center justify-between rounded-xl border border-primary/40 bg-primary/10 p-3 text-left text-xs transition-colors hover:bg-primary/15"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                <div>
                  <p className="font-extrabold text-foreground">관리자 (admin@cea.co.kr)</p>
                  <p className="text-[11px] text-muted-foreground">관리자 콘솔 · 수료증 일괄 출력 권한</p>
                </div>
              </div>
              <Badge className="shrink-0">관리자</Badge>
            </button>

            <button
              type="button"
              onClick={() => loginWithEmail("manager@cea.co.kr")}
              className="flex w-full items-center justify-between rounded-xl border bg-card p-3 text-left text-xs transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="size-4 shrink-0 text-primary" />
                <div>
                  <p className="font-bold text-foreground">OOO 매니저 · 수강생 (manager@cea.co.kr)</p>
                  <p className="text-[11px] text-muted-foreground">온라인 강의실 수강 · 수료증 확인</p>
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
          <CardTitle className="text-2xl font-extrabold">관리자 전용 화면입니다</CardTitle>
          <CardDescription className="break-keep">
            기업 수강 운영 관리 및 수료증 일괄 출력은 <strong>관리자 계정</strong>으로 로그인했을 때만 표시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col items-center justify-center gap-3 px-6 sm:flex-row">
          <Button onClick={() => loginWithEmail("admin@cea.co.kr")} className="h-11 gap-2 px-6 font-bold">
            <ShieldCheck className="size-4" />
            관리자 로그인
          </Button>
          <Button variant="outline" onClick={() => setLoginModalOpen(true)} className="h-11 font-semibold">
            다른 계정으로 로그인
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

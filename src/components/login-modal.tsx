import { useState, type FormEvent } from "react";
import { Lock, LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms-store";

/** 공개 로그인 창: 시연용 계정·미리 채운 비밀번호 없이 아이디/비밀번호만 받는다. */
export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, loginWithEmail } = useLms();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (!loginModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = loginWithEmail(email);
    if (!res.ok) setErr("아이디 또는 비밀번호를 확인해 주세요.");
    else {
      setErr("");
      setPassword("");
    }
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
              <CardDescription className="text-xs">수강생 · 기업 담당자 · 관리자 공통</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setLoginModalOpen(false)} aria-label="닫기">
            <X className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-bold">
                아이디 (회사 이메일)
              </Label>
              <Input
                id="login-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.co.kr"
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
                autoComplete="current-password"
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
          <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
            기업 단체 수강 계정은 소속 회사 교육 담당자에게 받은 전용 링크로 먼저 등록해 주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/** 로그인이 필요한 화면(강의실 · 관리자)에서 공통으로 쓰는 안내 */
export function LoginGate({ title, desc }: { title: string; desc: string }) {
  const { setLoginModalOpen } = useLms();
  return (
    <section className="container py-20">
      <Card className="mx-auto max-w-lg border-primary/30 py-8 text-center shadow-lg">
        <CardHeader className="space-y-3 px-6">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold">{title}</CardTitle>
          <CardDescription className="break-keep">{desc}</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex justify-center px-6">
          <Button onClick={() => setLoginModalOpen(true)} className="h-11 gap-2 px-6 font-bold">
            <LogIn className="size-4" />
            로그인
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

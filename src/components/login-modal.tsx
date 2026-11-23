import { useEffect, useState, type FormEvent } from "react";
import { KeyRound, Loader2, Lock, LogIn, Mail, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms-store";

type AuthMode = "login" | "signup" | "reset" | "recovery";

/** 공개 로그인 창: Supabase Auth 실인증 (로그인 · 처음 비밀번호 설정 · 비밀번호 재설정) */
export function LoginModal() {
  const {
    loginModalOpen,
    setLoginModalOpen,
    recoveryToken,
    clearRecoveryToken,
    loginWithPassword,
    setupFirstPassword,
    requestPasswordReset,
    completePasswordRecovery,
  } = useLms();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (recoveryToken) {
      setMode("recovery");
      setErr("");
      setNotice("메일 인증이 확인되었습니다. 새로 사용할 비밀번호를 입력해 주세요.");
    }
  }, [recoveryToken]);

  useEffect(() => {
    if (!loginModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLoginModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [loginModalOpen, setLoginModalOpen]);

  if (!loginModalOpen) return null;

  const switchMode = (next: AuthMode) => {
    if (mode === "recovery") clearRecoveryToken();
    setMode(next);
    setErr("");
    setNotice("");
    setPassword("");
    setConfirmPw("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setNotice("");

    if (mode === "login") {
      setBusy(true);
      const res = await loginWithPassword(email, password);
      setBusy(false);
      if (!res.ok) setErr(res.message);
      else setPassword("");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setErr("비밀번호는 6자 이상으로 입력해 주세요.");
        return;
      }
      if (password !== confirmPw) {
        setErr("비밀번호가 서로 일치하지 않습니다.");
        return;
      }
      setBusy(true);
      const res = await setupFirstPassword(email, password);
      setBusy(false);
      if (!res.ok) setErr(res.message);
      else if (res.needsEmailConfirmation) {
        setNotice(res.message);
        setPassword("");
        setConfirmPw("");
      }
      return;
    }

    if (mode === "reset") {
      setBusy(true);
      const res = await requestPasswordReset(email);
      setBusy(false);
      if (!res.ok) setErr(res.message);
      else setNotice(res.message);
      return;
    }

    if (mode === "recovery") {
      if (password.length < 6) {
        setErr("새 비밀번호는 6자 이상으로 입력해 주세요.");
        return;
      }
      if (password !== confirmPw) {
        setErr("새 비밀번호가 서로 일치하지 않습니다.");
        return;
      }
      setBusy(true);
      const res = await completePasswordRecovery(password);
      setBusy(false);
      if (!res.ok) setErr(res.message);
      else {
        setMode("login");
        setPassword("");
        setConfirmPw("");
        setNotice(res.message);
      }
    }
  };

  const titleByMode: Record<AuthMode, string> = {
    login: "주식회사 씨이에이(CEA) 로그인",
    signup: "처음 비밀번호 설정",
    reset: "비밀번호 재설정",
    recovery: "새 비밀번호 저장",
  };

  const descByMode: Record<AuthMode, string> = {
    login: "수강생 · 기업 담당자 · 관리자 공통 (실서버 인증)",
    signup: "배정된 회사 이메일에 첫 비밀번호를 등록합니다",
    reset: "이메일로 비밀번호 재설정 링크를 보내드립니다",
    recovery: "6자 이상의 새 비밀번호를 설정해 주세요",
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="CEA 계정 로그인"
      onClick={(e) => {
        if (e.target === e.currentTarget) setLoginModalOpen(false);
      }}
    >
      <Card className="my-auto max-h-[90vh] w-full max-w-md overflow-y-auto border-primary/30 py-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b bg-muted/30 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={`${import.meta.env.BASE_URL}cea-logo.png`}
              alt="CEA 로고"
              className="size-8 shrink-0 rounded-full bg-white p-0.5 object-contain shadow-xs"
              width={32}
              height={32}
            />
            <div className="min-w-0">
              <CardTitle className="text-base font-extrabold">{titleByMode[mode]}</CardTitle>
              <CardDescription className="text-xs">{descByMode[mode]}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 min-h-11 min-w-11 shrink-0 sm:size-9 sm:min-h-9 sm:min-w-9"
            onClick={() => setLoginModalOpen(false)}
            aria-label="닫기"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== "recovery" && (
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-bold">
                  아이디 (회사 이메일)
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  disabled={busy}
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.co.kr"
                  className="h-11"
                />
              </div>
            )}

            {mode !== "reset" && (
              <div className="space-y-1.5">
                <Label htmlFor="login-pw" className="text-xs font-bold">
                  {mode === "recovery" ? "새 비밀번호 (6자 이상)" : mode === "signup" ? "사용할 비밀번호 (6자 이상)" : "비밀번호"}
                </Label>
                <Input
                  id="login-pw"
                  type="password"
                  required
                  minLength={mode === "login" ? 1 : 6}
                  disabled={busy}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
            )}

            {(mode === "signup" || mode === "recovery") && (
              <div className="space-y-1.5">
                <Label htmlFor="login-pw-confirm" className="text-xs font-bold">
                  비밀번호 확인
                </Label>
                <Input
                  id="login-pw-confirm"
                  type="password"
                  required
                  minLength={6}
                  disabled={busy}
                  autoComplete="new-password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="h-11"
                />
              </div>
            )}

            {err && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-semibold break-keep text-destructive">
                {err}
              </p>
            )}
            {notice && (
              <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold break-keep text-primary">
                {notice}
              </p>
            )}

            <Button type="submit" disabled={busy} className="h-11 w-full gap-2 font-bold">
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "login" ? (
                <LogIn className="size-4" />
              ) : mode === "signup" ? (
                <UserPlus className="size-4" />
              ) : mode === "reset" ? (
                <Mail className="size-4" />
              ) : (
                <KeyRound className="size-4" />
              )}
              {busy
                ? "인증 서버 확인 중..."
                : mode === "login"
                  ? "로그인"
                  : mode === "signup"
                    ? "비밀번호 설정하기"
                    : mode === "reset"
                      ? "재설정 메일 보내기"
                      : "새 비밀번호 저장"}
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t pt-3 text-xs">
            {mode !== "login" && (
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                로그인으로 돌아가기
              </button>
            )}
            {mode !== "signup" && (
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                처음 비밀번호 설정
              </button>
            )}
            {mode !== "reset" && (
              <button
                type="button"
                onClick={() => switchMode("reset")}
                className="font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                비밀번호 재설정
              </button>
            )}
          </div>

          <p className="text-center text-[12px] leading-[1.6] break-keep text-muted-foreground">
            기업 단체 수강 계정은 관리자가 배정한 회사 이메일로 첫 비밀번호를 설정한 뒤 로그인해 주세요.
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

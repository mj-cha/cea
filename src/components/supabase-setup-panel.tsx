import { useState } from "react";
import { Check, CloudUpload, Copy, Database, RefreshCw, Unplug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms-store";
import {
  getSupabaseConfig,
  saveSupabaseRuntimeConfig,
  SUPABASE_SCHEMA_SQL,
  testSupabaseConnection,
} from "@/lib/supabase-client";

export function SupabaseSetupPanel() {
  const { syncStatus, syncMessage, syncToCloud, pullFromCloud, refreshSupabaseConfig } = useLms();
  const currentCfg = getSupabaseConfig();

  const [url, setUrl] = useState(currentCfg.url);
  const [anonKey, setAnonKey] = useState(currentCfg.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const handleSaveAndTest = async () => {
    setTesting(true);
    setTestResult(null);
    saveSupabaseRuntimeConfig(url, anonKey);
    refreshSupabaseConfig();
    const res = await testSupabaseConnection(url, anonKey);
    setTesting(false);
    setTestResult({ ok: res.ok, text: res.message });
    if (res.ok) {
      await syncToCloud();
    }
  };

  const handleDisconnect = () => {
    saveSupabaseRuntimeConfig("", "");
    setUrl("");
    setAnonKey("");
    setTestResult(null);
    refreshSupabaseConfig();
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      setShowSql(true);
    }
  };

  return (
    <Card className="border-primary/40 bg-card py-5">
      <CardHeader className="px-6 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base font-extrabold">
            <Database className="size-5 text-primary" />
            Supabase 클라우드 DB 실서버 연동 제어판 (PostgREST 직결)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={currentCfg.isConnected ? "default" : "outline"} className="text-xs">
              {currentCfg.isConnected
                ? `연결됨 (${currentCfg.source === "env" ? ".env 환경변수" : "관리자 직접 설정"})`
                : "미연결 (로컬 저장소 동작 중)"}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              상태: {syncStatus}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs">
          Supabase Project URL과 Anon Key를 입력하고 [연결 테스트 및 클라우드 동기화]를 누르면 수강생 진도율·법인 전용 코드·수료증 발급·상담 신청이 실서버 DB(`cea_lms_store`, `cea_consult_requests`)와 실시간 동기화됩니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="sb-url" className="text-xs font-bold">
              Supabase Project URL (`VITE_SUPABASE_URL`)
            </Label>
            <Input
              id="sb-url"
              placeholder="https://xxxxxxxxxxxx.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="sb-key" className="text-xs font-bold">
              Supabase Anon Public Key (`VITE_SUPABASE_ANON_KEY`)
            </Label>
            <Input
              id="sb-key"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleSaveAndTest}
            disabled={testing}
            className="gap-1.5 font-bold"
          >
            <CloudUpload className="size-4" />
            {testing ? "연결 확인 중 (제한 8000ms)..." : "연결 저장 · 실서버 동기화"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={pullFromCloud}
            disabled={!currentCfg.isConnected || testing}
            className="gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="size-3.5" />
            클라우드에서 불러오기
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopySql}
            className="gap-1.5 text-xs font-semibold"
          >
            {copiedSql ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
            {copiedSql ? "SQL 복사됨!" : "초기 테이블 생성 SQL 복사"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSql((v) => !v)}
            className="text-xs text-muted-foreground"
          >
            {showSql ? "SQL 접기" : "SQL 보기"}
          </Button>
          {currentCfg.source === "runtime" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="ml-auto gap-1 text-xs text-muted-foreground"
            >
              <Unplug className="size-3.5" />
              연결 해제
            </Button>
          )}
        </div>

        {(testResult || syncMessage) && (
          <div
            className={`rounded-lg border px-3.5 py-2.5 text-xs font-medium ${
              testResult && !testResult.ok
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-primary/30 bg-primary/10 text-primary"
            }`}
          >
            {testResult ? testResult.text : syncMessage}
          </div>
        )}

        {showSql && (
          <pre className="max-h-48 overflow-auto rounded-lg border bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
            {SUPABASE_SCHEMA_SQL}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}

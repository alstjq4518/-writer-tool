"use client";
import { useEffect, useState } from "react";

const WRITERS = [
  { id: "sonkkeut", name: "손끝홈케어", desc: "따뜻·친절한 이웃 어투" },
  { id: "seopgun", name: "섭군의집수리", desc: "정중한 기술 보고서 어투" },
  { id: "hooni", name: "후니홈컴퍼니", desc: "객관·논리적 설명문 어투" },
  { id: "jiyu", name: "지유홈케어", desc: "단호한 전후 대비 전문가" },
  { id: "mannyeon", name: "만년집수리", desc: "침착한 안전 가이드 어투" },
  { id: "rani", name: "라니홈픽스", desc: "시원·속도감 있는 해결형" },
  { id: "keyhero119", name: "열쇠히어로119", desc: "도어락·출입보안 전문" },
];

export default function Page() {
  const [accessCode, setAccessCode] = useState("");
  const [verifiedRole, setVerifiedRole] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [writerId, setWriterId] = useState(WRITERS[0].id);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [workDetail, setWorkDetail] = useState("");
  const [company, setCompany] = useState(WRITERS[0].name);
  const [output, setOutput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkCode = async (codeToCheck: string) => {
    const trimmed = codeToCheck.trim();
    if (!trimmed) return;
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", accessCode: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setAuthError(data.error || "비밀번호가 일치하지 않습니다.");
        localStorage.removeItem("writer_access_code");
        setVerifiedRole("");
      } else {
        localStorage.setItem("writer_access_code", trimmed);
        setAccessCode(trimmed);
        setVerifiedRole(data.role);
        if (data.role !== "admin") {
          const found = WRITERS.find((w) => w.id === data.role);
          if (found) {
            setWriterId(found.id);
            setCompany(found.name);
          }
        }
      }
    } catch {
      setAuthError("인증 확인 중 네트워크 오류가 발생했습니다.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("writer_access_code");
    if (saved) {
      setAccessCode(saved);
      checkCode(saved);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("writer_access_code");
    setAccessCode("");
    setVerifiedRole("");
    setOutput("");
    setErrorMsg("");
  };

  const handleSelectWriter = (id: string, name: string) => {
    if (verifiedRole !== "admin") return;
    setWriterId(id);
    setCompany(name);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, writerId, keyword, location, workDetail, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "오류가 발생했습니다.");
      } else {
        setOutput(data.text || "");
      }
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!verifiedRole) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 text-slate-900">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold">블로그 기술 보고서 작성기</h1>
          <p className="mt-1 text-sm text-slate-600">
            발급받은 작가 전용 비밀번호를 입력해야 이용할 수 있습니다.
          </p>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkCode(accessCode)}
            placeholder="비밀번호 입력"
            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={() => checkCode(accessCode)}
            disabled={authLoading || !accessCode.trim()}
            className="mt-3 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            {authLoading ? "확인 중..." : "접속하기"}
          </button>
          {authError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {authError}
            </div>
          )}
        </div>
      </main>
    );
  }

  const visibleWriters =
    verifiedRole === "admin"
      ? WRITERS
      : WRITERS.filter((w) => w.id === verifiedRole);

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">블로그 기술 보고서 작성기 (Gemini 연동)</h1>
            <p className="mt-1 text-sm text-slate-600">
              {verifiedRole === "admin"
                ? "관리자 모드: 7개 업체 전체 선택 가능"
                : `${company} 전용 계정으로 인증되었습니다.`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            코드 변경
          </button>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold mb-2">
            {verifiedRole === "admin" ? "1. 작가(업체) 선택" : "1. 배정된 전용 업체"}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {visibleWriters.map((w, idx) => {
              const active = writerId === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleSelectWriter(w.id, w.name)}
                  className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-sm font-bold">
                    {verifiedRole === "admin" ? `${idx + 1}. ` : ""}{w.name}
                  </div>
                  <div className={`mt-0.5 text-xs ${active ? "text-slate-300" : "text-slate-500"}`}>
                    {w.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">핵심 키워드</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 욕실 샤워 수전 교체"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">작업 현장 (동/단지명)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 기흥구 보정동 ○○아파트 (비워도 됨)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">작업 내용</label>
            <input
              type="text"
              value={workDetail}
              onChange={(e) => setWorkDetail(e.target.value)}
              placeholder="예: 기존 수전 철거 및 신규 설치"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">업체명 (자동 입력)</label>
            <input
              type="text"
              value={company}
              readOnly={verifiedRole !== "admin"}
              onChange={(e) => verifiedRole === "admin" && setCompany(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
        >
          {loading ? `${company} 전용 프롬프트로 작성 중...` : `${company} 블로그 초안 생성하기`}
        </button>

        {errorMsg && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {output && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">
                생성된 초안 (공백 포함 {output.length}자)
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md bg-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-300 cursor-pointer"
              >
                {copied ? "복사 완료!" : "전체 복사"}
              </button>
            </div>
            <textarea
              readOnly
              rows={20}
              value={output}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed"
            />
          </div>
        )}
      </div>
    </main>
  );
}
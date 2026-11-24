"use client";
import { useState } from "react";

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [workDetail, setWorkDetail] = useState("");
  const [company, setCompany] = useState("");
  const [output, setOutput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, location, workDetail, company }),
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

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold">블로그 기술 보고서 작성기 (Gemini 연동)</h1>
        <p className="mt-1 text-sm text-slate-600">
          핵심 키워드, 작업 현장, 작업 내용, 업체명을 입력하면 Gemini가 1,500~2,000자 분량의 초안을 작성합니다.
        </p>

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
            <label className="block text-sm font-medium mb-1">업체명</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="예: 만년집수리, 채움홈픽스"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Gemini가 초안을 작성 중입니다..." : "블로그 초안 생성하기"}
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
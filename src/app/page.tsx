"use client";
import { useState } from "react";

export default function Page() {
  const [topic, setTopic] = useState("");
  const [region, setRegion] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const t = topic.trim() || "집수리 시공";
    const r = region.trim();
    const area = r
      ? `${r} 및 인근 지역 출장 시공이 가능합니다.`
      : "서울, 경기, 인천 지역 출장 시공이 가능합니다.";
    const title = r ? `[${r}] ${t} 깔끔하게 해결한 후기` : `${t} 꼼꼼하게 진행한 현장 후기`;
    const text = [
      title,
      "",
      "안녕하세요. 현장에서 직접 작업하며 꼼꼼하게 마무리해 드리는 글쓰기 도우미입니다.",
      "",
      "1. 현장 점검 및 상태 확인",
      `${t} 작업을 진행하기 전 상태를 정확히 점검하고 필요한 부분만 깔끔하게 정리했습니다.`,
      "",
      "2. 작업 과정 및 핵심 포인트",
      "무리한 작업 없이 순서대로 진행하여 마무리 완성도를 높였습니다. 작업 전후 상태를 비교해 보셔도 차이가 확실합니다.",
      "",
      "3. 마무리 안내",
      "사용하시면서 불편한 점이나 추가 문의가 있으시면 편하게 말씀해 주세요.",
      "",
      area,
    ].join("\n");
    setResult(text);
    setCopied(false);
  };

  const copyText = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold">블로그 글쓰기 도우미</h1>
        <p className="mt-1 text-sm text-slate-600">
          주제와 지역만 입력하면 바로 복사해서 쓸 수 있는 블로그 초안을 만들어 줍니다.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">글 주제 / 작업 내용</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 가스레인지 교체, 인덕션 설치, 도어락 교체"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              지역 (비워두면 서울·경기·인천으로 자동 입력)
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="예: 용인 수지, 수원, 성남"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={generate}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white"
          >
            글 초안 만들기
          </button>
        </div>
        {result && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">생성된 초안</span>
              <button
                type="button"
                onClick={copyText}
                className="rounded-md bg-slate-200 px-3 py-1 text-xs font-medium"
              >
                {copied ? "복사 완료!" : "전체 복사"}
              </button>
            </div>
            <textarea
              readOnly
              rows={14}
              value={result}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm"
            />
          </div>
        )}
      </div>
    </main>
  );
}
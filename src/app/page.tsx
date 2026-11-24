"use client";
import { useState } from "react";

function pickSubjectParticle(word: string) {
  const trimmed = word.trim();
  if (!trimmed) return "은";
  const lastChar = trimmed[trimmed.length - 1];
  const code = lastChar.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const jong = (code - 0xac00) % 28;
    return jong === 0 ? "는" : "은";
  }
  return "은";
}

function buildReport(params: {
  keyword: string;
  location: string;
  workDetail: string;
  company: string;
}) {
  const kw = params.keyword.trim() || "설비 교체 시공";
  const loc = params.location.trim();
  const detail = params.workDetail.trim() || "기존 노후 설비 철거 및 신규 정석 설치";
  const comp = params.company.trim() || "현장기술팀";
  const particle = pickSubjectParticle(comp);

  const placeLabel = loc || "현장";
  const dispatchLine = loc
    ? `이번 시공 현장인 ${loc}을 비롯해 인근 주요 생활권까지 신속하게 방문하여 정확히 점검해 드립니다.`
    : "수도권 전 지역 출장 방문 및 현장 정밀 점검이 가능합니다.";

  const sec1 = [
    "[현장 규격 진단 및 증상 파악]",
    `이번 현장은 ${placeLabel}에서 진행된 ${kw} 사례로, ${detail}이 필요한 상태였습니다. 초기 이상 신호를 가볍게 넘기고 방치할 경우 주변 마감재 변형이나 누수·고착 등 2차 파손 위험이 커질 수 있습니다. 육안 확인과 현장 치수 측정을 통해 현재 작동 상태와 간섭 여부를 먼저 면밀히 파악했습니다.`,
  ].join("\n");

  const sec2 = [
    "[구조적 결함 및 원인 분석]",
    `기존 설비를 분리하며 확인한 결과, 마감재 안쪽 골조 노후화와 장기간 사용에 따른 배관·연결부 부식이 함께 진행되고 있었습니다. 또한 기존 체결 규격이 현재 설치 환경과 미세하게 어긋나 있어 진동이나 하중이 한쪽에 집중되는 결함이 발견되었습니다. 겉으로 드러난 증상뿐 아니라 내부 지지 구조의 안정성까지 함께 개선해야 재발을 막을 수 있는 구조였습니다.`,
  ].join("\n");

  const sec3 = [
    "[정석 테크니컬 시공 과정]",
    `먼저 주변 바닥과 벽체, 인접 기기에 손상이 가지 않도록 보양을 마친 뒤 기존 부품을 안전하게 철거했습니다. 철거 후 드러난 하부 및 벽체 고정부는 처짐과 흔들림을 잡을 수 있도록 특수 보강 작업을 진행했습니다. 이어서 연결 부위 이물질을 제거하고 기밀과 내구성을 확보할 수 있도록 마감 처리와 고정을 단계별로 맞췄습니다. 수평계를 이용해 0점 세팅을 정밀하게 잡은 상태에서 신품 ${kw}를 기울어짐 없이 견고하게 안착시켰습니다. 배선·배관 및 각종 고정 볼트의 체결 토크와 정렬 상태까지 한 번 더 확인하며 정석 순서대로 마무리했습니다.`,
  ].join("\n");

  const sec4 = [
    "[현장 검증 및 수치 점검]",
    `시공을 마친 직후에는 작동 테스트와 함께 체결부 누출·유격·단차 여부를 꼼꼼히 점검했습니다. 수평과 기울기, 개폐 및 작동 반응이 기준치 내에서 안정적으로 유지되는지 실제 사용 조건과 동일하게 확인했습니다. 모든 항목에서 이상 수치가 없음을 검증한 뒤 현장을 정리했습니다.`,
  ].join("\n");

  const sec5 = [
    "[기술자가 당부하는 유지관리 팁]",
    `설비 내구성을 2배 이상 안정적으로 유지하려면 첫째, 정기적인 육안 점검으로 연결부 주변 습기나 미세한 흔들림 여부를 조기에 확인하시는 것이 좋습니다. 둘째, 무리한 힘으로 조작하거나 세게 충격을 주는 습관을 피하고 오염물은 부드러운 천으로 가볍게 닦아 관리해 주시길 권장합니다. 작은 이상이라도 초기에 조치하시면 수리 비용과 불편을 크게 줄일 수 있습니다.`,
  ].join("\n");

  const sec6 = [
    "[자주 묻는 질문 FAQ]",
    `Q. 작업 소요 시간은 보통 얼마나 걸리나요?\nA. 현장 여건과 보강 작업 범위에 따라 다르지만, 일반적인 ${kw} 기준 보통 1시간 내외로 진행됩니다.\n\nQ. 시공 후 당일 바로 사용이 가능한가요?\nA. 최종 작동 및 안전 점검이 완료된 이후에는 당일 바로 사용하실 수 있도록 안내해 드립니다.`,
  ].join("\n");

  const sec7 = [
    "[상담 안내 및 출장 안내]",
    `정확한 진단과 견적 안내를 위해 현장 사진, 원하시는 작업 내용, 거주 지역을 문자로 남겨주시면 순차적으로 확인 후 안내해 드리겠습니다.\n${comp}${particle} ${dispatchLine}`,
  ].join("\n");

  const rawTags = [
    `#${kw.replace(/\s+/g, "")}`,
    loc ? `#${loc.replace(/\s+/g, "")}${kw.replace(/\s+/g, "")}` : `#${comp.replace(/\s+/g, "")}`,
    `#${kw.replace(/\s+/g, "")}시공`,
    `#${kw.replace(/\s+/g, "")}교체`,
    `#${comp.replace(/\s+/g, "")}`,
    loc ? `#${loc.replace(/\s+/g, "")}설비` : `#${kw.replace(/\s+/g, "")}점검`,
  ];
  const uniqueTags = Array.from(new Set(rawTags)).slice(0, 6);
  while (uniqueTags.length < 6) {
    uniqueTags.push(`#${kw.replace(/\s+/g, "")}후기${uniqueTags.length + 1}`);
  }

  let body = [sec1, sec2, sec3, sec4, sec5, sec6, sec7].join("\n\n");

  const padParagraphs = [
    `현장 여건에 따라 마감재 두께나 고정면 강도가 조금씩 다르기 때문에, 설치 전후 상태를 세밀하게 비교해 두는 것이 중요합니다. ${placeLabel} 현장의 경우 기존 구조의 한계를 보완하면서 실사용 편의성과 안전성을 함께 높이는 방향으로 기준을 잡았습니다.`,
    `시공 이후에도 사용 환경 변화에 맞춰 주기적인 점검을 병행하시면 설비 수명을 길게 가져가실 수 있습니다. 작업 전후 변화가 궁금하시거나 추가 확인이 필요한 부분이 있다면 언제든 편하게 문의해 주시기 바랍니다.`,
  ];

  let idx = 0;
  while (body.length < 1520 && idx < 10) {
    body += `\n\n${padParagraphs[idx % padParagraphs.length]}`;
    idx += 1;
  }

  if (body.length > 1940) {
    body = body.slice(0, 1940).trimEnd();
  }

  return `${body}\n\n${uniqueTags.join("\n")}`;
}

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [workDetail, setWorkDetail] = useState("");
  const [company, setCompany] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const text = buildReport({ keyword, location, workDetail, company });
    setOutput(text);
    setCopied(false);
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
        <h1 className="text-2xl font-bold">블로그 기술 보고서 작성기</h1>
        <p className="mt-1 text-sm text-slate-600">
          핵심 키워드, 작업 현장, 작업 내용, 업체명을 입력하면 1,500~2,000자 분량의 블로그 초안을 생성합니다.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">핵심 키워드</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 가스레인지 교체, 도어락 교체"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">작업 현장 (동/단지명)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 상현동 ○○아파트 (비워도 됨)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">작업 내용</label>
            <input
              type="text"
              value={workDetail}
              onChange={(e) => setWorkDetail(e.target.value)}
              placeholder="예: 기존 노후 기기 철거 및 신규 설치"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">업체명</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="예: 채움홈픽스, 열쇠히어로119"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer"
        >
          블로그 초안 생성하기
        </button>

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
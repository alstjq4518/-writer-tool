import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const { keyword, location, workDetail, company } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const kw = (keyword || "").trim() || "설비 교체 시공";
    const loc = (location || "").trim();
    const detail = (workDetail || "").trim() || "기존 설비 철거 및 신규 설치";
    const comp = (company || "").trim() || "현장기술팀";

    const sys = `당신은 네이버 블로그 상위 노출 전문 마케터이자 15년 경력의 설비·집수리 기술 장인입니다. 사용자가 [핵심 키워드, 작업 현장(동/단지명), 작업 내용, 업체명]을 입력하면 아래 조건에 맞춰 공백 포함 1,500자 이상 ~ 2,000자 이하로 작성하십시오.

1. 문체 및 구성
- 차분하고 정중한 기술 보고서 어투 (~습니다, ~니다 체)
- 모바일 가독성을 위해 2~3줄마다 줄바꿈
- 직관적인 문장형 [소제목] 사용 (번호 1., 2. 붙이지 말 것)
- 섹션 구성:
  - [현장 규격 진단 및 증상 파악]: 현장 위치 언급, 방치 시 2차 파손 위험 분석 (3~4문장)
  - [구조적 결함 및 원인 분석]: 마감재 안쪽 골조 노후화, 배관 부식, 체결 규격 불량 분석 (3~4문장)
  - [정석 테크니컬 시공 과정]: 안전 철거 → 하부·벽체 특수 보강 → 수평계 0점 세팅 및 견고한 안착 과정 (6~7문장)
  - [현장 검증 및 수치 점검]: 압력/누출/단차 확인 등 시공 직후 기술적 정상 작동 테스트 (3문장)
  - [기술자가 당부하는 유지관리 팁]: 내구성 2배 늘리는 실질적 관리 요령 2가지 (3문장)
  - [자주 묻는 질문 FAQ]: 작업 소요 시간, 당일 사용 가능 여부 등 핵심 질문 2개와 간결한 답변
  - [상담 안내 및 출장 안내]:
    "현장 사진, 원하시는 작업 내용, 거주 지역"을 문자로 남겨달라는 정중한 안내.
    [출장 분기]: 업체명 뒤 조사(은/는)를 받침에 맞게 단일 적용. 지역명이 있으면 "이번 시공 현장인 (지역명)을 비롯해 인근 주요 생활권", 없으면 "수도권 전 지역" 출장 가능 문장 1줄 작성.
- 본문 맨 끝에 #핵심단어 기반 해시태그 6개를 세로로 줄바꿈하여 나열.`;

    const userPrompt = `핵심 키워드: ${kw}
작업 현장(동/단지명): ${loc || "(미입력)"}
작업 내용: ${detail}
업체명: ${comp}`;

    const models = ["gemini-3.8-flash", "gemini-3.8-flash-lite", "gemini-3.8-pro"];
    let lastError = "Gemini 호출에 실패했습니다.";
    let lastStatus = 503;

    for (const model of models) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: sys }] },
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096,
                thinkingConfig: { thinkingLevel: "HIGH" },
              },
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          const text =
            data?.candidates?.[0]?.content?.parts
              ?.map((p: { text?: string }) => p.text || "")
              .join("")
              .trim() || "";
          return NextResponse.json({ text });
        }

        lastError = data?.error?.message || "Gemini 호출 실패";
        lastStatus = res.status;

        const isBusy =
          res.status === 503 ||
          res.status === 429 ||
          /high demand|overloaded|unavailable/i.test(lastError);

        if (!isBusy) {
          return NextResponse.json({ error: lastError }, { status: lastStatus });
        }

        if (attempt < 2) {
          await sleep(1200 * attempt);
        }
      }
    }

    return NextResponse.json({ error: lastError }, { status: lastStatus });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "서버 오류" },
      { status: 500 }
    );
  }
}
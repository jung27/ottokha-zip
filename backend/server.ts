import "dotenv/config"; // 반드시 최상단에 위치
import express, { type Express, type Request, type Response } from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import { createCanvas } from "@napi-rs/canvas";

// 환경변수가 제대로 들어왔는지 콘솔로 확인
console.log(
  "Loaded API Key:",
  process.env.GEMINI_API_KEY ? "EXISTS" : "UNDEFINED",
);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function processText(text: string) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    input: `${text} / 이 상황에서 다음 두 선택지를 고르고 "{first}/{second}"의 형식으로만 출력해줘 다른 형식은 절대 금지. first: (월세, 전세 + 대출) 중 택1, second: (원룸, 오피스텔, 빌라, 옥탑방, 반지하, 고시원) 중 택1`,
  });
  const pair = interaction.output_text?.split("/");
  return { first: pair?.[0], second: pair?.[1] };
}

async function summarize(text: string) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    input: `${text} / 이것들은 사용자가 주거 계약을 맺을 때 특히 주의해야할 요소들이야 최대한 간단하게 200자 이내로 요약해줘. 오로지 줄글로만 써줘. 빠진 내용이 없게 해.`,
  });
  return interaction.output_text;
}

const app: Express = express();

app.use(cors());

app.get("/api", async (req: Request, res: Response) => {
  const text = req.query.text as string;
  if (!text) {
    return res.status(400).json({ error: "Text parameter is required" });
  }
  const result = await processText(text);
  console.log("Processed result:", result);
  res.json(result);
});

app.get("/api/summarize", async (req: Request, res: Response) => {
  const text = req.query.text as string;
  if (!text) {
    return res.status(400).json({ error: "Text parameter is required" });
  }
  const result = await summarize(text);
  console.log("Processed result:", result);
  res.json({ summary: result });
});

// 매물 및 계약 라벨 맵
const HOUSE_LABELS: Record<string, string> = {
  oneroom: "원룸",
  officetel: "오피스텔",
  villa: "빌라",
  rooftop: "옥탑방",
  semi_basement: "반지하",
  goshiwon: "고시원",
};

// 1. SNS 크롤러용 HTML 메타태그 제공 및 브라우저 리다이렉트
app.get("/api/share", (req: Request, res: Response) => {
  const encodedData = req.query.d as string;
  if (!encodedData) {
    return res.redirect("/");
  }

  let parsed = { c: "monthly", h: "oneroom", r: 0 };
  try {
    parsed = JSON.parse(
      decodeURIComponent(Buffer.from(encodedData, "base64").toString("utf-8")),
    );
  } catch (e) {
    console.error("Failed to parse share data:", e);
  }

  const houseName = HOUSE_LABELS[parsed.h] || "첫 집";
  const contractType = parsed.c === "monthly" ? "월세" : "전세";
  const title =
    parsed.r === 0
      ? `🏆 전세사기 방어율 100%! 완벽한 ${houseName} 계약`
      : `⚠️ 주의 요소 ${parsed.r}개 발견! 나의 ${houseName} 계약 안전할까?`;

  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  const ogImageUrl = `${protocol}://${host}/api/og?d=${encodeURIComponent(encodedData)}`;
  const clientOrigin = req.headers.referer
    ? new URL(req.headers.referer).origin
    : `${protocol}://${host}`;

  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="[${contractType} · ${houseName}] 사회초년생을 위한 전월세 계약 시뮬레이션 '어떡하집?' 결과표" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <meta http-equiv="refresh" content="0; url=${clientOrigin}/#ending" />
</head>
<body style="font-family: sans-serif; background: #11191f; color: #fff; text-align: center; padding-top: 100px;">
  <p>결과 화면으로 이동 중입니다...</p>
</body>
</html>`);
});

// 2. 동적 성적표 카드 이미지(PNG) 실시간 렌더링
app.get("/api/og", (req: Request, res: Response) => {
  const encodedData = req.query.d as string;
  let parsed = { c: "monthly", h: "oneroom", r: 0 };

  if (encodedData) {
    try {
      parsed = JSON.parse(
        decodeURIComponent(
          Buffer.from(encodedData, "base64").toString("utf-8"),
        ),
      );
    } catch (e) {
      console.error("Failed to decode OG data:", e);
    }
  }

  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 배경 칠하기
  ctx.fillStyle = "#11191f";
  ctx.fillRect(0, 0, width, height);

  // 포인트 그리드 및 테두리 장식
  ctx.strokeStyle = "#1e2933";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // 상단 로고 & 타이틀
  ctx.fillStyle = "#32d583"; // 앱의 민트/악센트 컬러
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("어떡하집? 🏠", 80, 110);

  ctx.fillStyle = "#667085";
  ctx.font = "24px sans-serif";
  ctx.fillText("첫 번째 전월세 계약 시뮬레이션 성적표", 280, 110);

  // 메인 성적 헤드라인
  const isPerfect = parsed.r === 0;
  ctx.fillStyle = isPerfect ? "#ffffff" : "#fda29b";
  ctx.font = "bold 54px sans-serif";
  const mainTitle = isPerfect
    ? "무결점 계약 완료! 든든한 독립 시작"
    : `주의해야 할 위험 선택 ${parsed.r}건 발견!`;
  ctx.fillText(mainTitle, 80, 240);

  // 계약 세부 정보 뱃지
  const houseName = HOUSE_LABELS[parsed.h] || "첫 집";
  const contractType = parsed.c === "monthly" ? "월세" : "전세 + 대출";

  ctx.fillStyle = "#1d2939";
  ctx.fillRect(80, 290, 480, 60);
  ctx.fillStyle = "#98a2b3";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText(`계약 형태: ${contractType} · ${houseName}`, 105, 330);

  // 하단 요약 조언 박스
  ctx.fillStyle = "#16202a";
  ctx.fillRect(80, 390, 1040, 150);

  ctx.fillStyle = "#e6edf2";
  ctx.font = "26px sans-serif";
  if (isPerfect) {
    ctx.fillText(
      "✓ 등기부등본 확인부터 필수 특약까지 꼼꼼하게 챙겼어요.",
      115,
      450,
    );
    ctx.fillText(
      "✓ 실전 부동산 계약에서도 보증금을 안전하게 지킬 수 있습니다!",
      115,
      495,
    );
  } else {
    ctx.fillText(
      "! 보증보험 요건이나 등기부 채권 최고액 확인에 아쉬운 점이 있었어요.",
      115,
      450,
    );
    ctx.fillText(
      "! 실제 계약서 서명 전, '어떡하집?' 체크리스트를 다시 확인해보세요.",
      115,
      495,
    );
  }

  const buffer = canvas.toBuffer("image/png");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400"); // 하루 브라우저 캐싱
  res.send(buffer);
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

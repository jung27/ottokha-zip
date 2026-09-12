import "dotenv/config"; // 반드시 최상단에 위치
import express, { type Express, type Request, type Response } from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

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

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

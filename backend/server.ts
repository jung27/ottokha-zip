import "dotenv/config"; // 반드시 최상단에 위치
import express, { type Express, type Request, type Response } from "express";
import { GoogleGenAI } from "@google/genai";

// 환경변수가 제대로 들어왔는지 콘솔로 확인
console.log(
  "Loaded API Key:",
  process.env.GEMINI_API_KEY ? "EXISTS" : "UNDEFINED",
);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function processText(text: string) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    input: `이 텍스트를 가공해서 공공기관 프로그램 등장인물 대사처럼 만들어줘. 오로지 대사만 적고 다른 말은 제외. 없는 말을 덧붙여서는 안돼. 나쁜 말투는 완화해줘.: ${text}`,
  });
  return interaction.output_text;
}

const app: Express = express();
app.get("/api", async (req: Request, res: Response) => {
  const text = req.query.text as string;
  if (!text) {
    return res.status(400).json({ error: "Text parameter is required" });
  }
  res.json({ result: await processText(text) });
});

app.listen(80);

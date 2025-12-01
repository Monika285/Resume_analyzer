import fs from 'fs';
import pdf from 'pdf-parse';
import OpenAI from 'openai';
import { extractTextFromPdf } from '../utils/pdfUtils.js';

const client = new OpenAI({ apiKey: "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" });

export const analyzeResume = async (file) => {
  if (!file) throw new Error('No file uploaded');
  const buffer = fs.readFileSync(file.path);
  const text = await extractTextFromPdf(buffer);

  // Simple prompt for analysis (you can expand this)
  const prompt = `You are a helpful resume reviewer. Analyze the resume text below and return a JSON with keys:
  "ats_score" (0-100), "pass_probability" ("High"/"Medium"/"Low"), "issues" (array of short strings),
  "suggestions" (array of short strings), "improved_resume" (rewritten resume text).
  Resume text:
  ${text.substring(0, 2000)}
  Note: respond only with valid JSON.`;

  const aiResponse = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800
  });

  const content = aiResponse.choices?.[0]?.message?.content || '';
  let parsed = {};
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    // fallback: return raw content
    parsed = { raw: content };
  }

  return {
    extracted_text: text,
    analysis: parsed
  };
};

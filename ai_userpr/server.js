const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate", async (req, res) => {
  const { jobTitle, experience, strength, tone } = req.body;

  if (!jobTitle || !experience || !strength) {
    return res.status(400).json({ error: "必要な入力が足りません。" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEYが設定されていません。" });
  }

  const prompt = `あなたは日本語で丁寧な自己PR文を作るアシスタントです。以下の情報をもとに、応募先に魅力が伝わる自己PRを書いてください。

職種: ${jobTitle}
経験: ${experience}
強み: ${strength}
文体: ${tone}

読みやすく、熱意と信頼感が伝わる文章にしてください。`;

  try {
    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      max_output_tokens: 500,
    });

    const aiText = Array.isArray(completion.output)
      ? completion.output.map((item) => item.content?.map((c) => c.text).join("")).join("")
      : completion.output_text || "";

    res.json({ prText: aiText.trim() });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "AI生成中にエラーが発生しました。" });
  }
});

app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}/index.html`);
});

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { industry, style, keywords } = req.body;

  const prompt = `Suggest 5 unique and creative brand name ideas for a ${style} ${industry} business using these keywords: ${keywords}.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const result = response.choices[0].message.content;
    res.json({ names: result.split("\n").filter((name) => name.trim() !== "") });
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error generating names" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

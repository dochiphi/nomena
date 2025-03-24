const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/generate", async (req, res) => {
  const { industry, style, keywords } = req.body;

  const prompt = `Suggest 5 unique and creative brand name ideas for a ${style} ${industry} business using these keywords: ${keywords}.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const result = response.data.choices[0].message.content;
    res.json({ names: result.split("\n").filter(name => name.trim() !== "") });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating names");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

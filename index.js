const venom = require('venom-bot');
const fetch = require('node-fetch');
require('dotenv').config();

venom.create({ session: 'fourmuda' }).then((client) => {
  client.onMessage(async (message) => {
    if (message.body.startsWith("/ask")) {
      const prompt = message.body.replace("/ask", "").trim();
      const response = await askAI(prompt);
      client.sendText(message.from, response);
    }
  });
});

async function askAI(prompt) {
  const res = await fetch("https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  const data = await res.json();
  return data[0]?.generated_text || "🧠 No answer from AI.";
}

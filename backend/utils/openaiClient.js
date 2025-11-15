// backend/utils/openaiClient.js
require("dotenv").config();
const OpenAI = require("openai").default;

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Classify a message
 */
const classifyMessage = async (content) => {
  try {
    const prompt = `
You are an assistant that classifies user messages for support tickets.
Respond ONLY in JSON format:
{
  "tag": "question" | "request" | "complaint" | "praise" | "other",
  "sentiment": "positive" | "neutral" | "negative",
  "priority": number (1 to 5)
}
Message: "${content}"
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content.trim());
  }  catch (err) {
  console.error("Error in classifyMessage:", err.response?.data || err);
  return null;
}

};

/**
 * Suggest a reply
 */
const suggestReply = async (content) => {
  try {
    const prompt = `
Write a short, polite customer support reply to this message:
"${content}"
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
    });

    return response.choices[0].message.content.trim();
} catch (err) {
  console.error("Error in suggestReply:", err.response?.data || err);
  return "Sorry, I could not generate a reply at this time.";
}


};

module.exports = { classifyMessage, suggestReply };

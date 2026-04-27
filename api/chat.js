const SILICONFLOW_API_URL =
  process.env.SILICONFLOW_API_URL || "https://api.siliconflow.cn/v1/chat/completions";
const API_KEY = process.env.SILICONFLOW_API_KEY;
const MODEL = process.env.SILICONFLOW_MODEL || "Qwen/Qwen2.5-7B-Instruct";

function buildPrompt(messages, context) {
  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "Assistant" : "Student"}: ${m.content}`)
    .join("\n");

  return [
    "You are Pathwise, a professional Future Career Planning Advisor embedded in a career exploration website.",
    "Style: warm, rigorous, concise, supportive, and practical. Keep replies short enough for a small floating chat box.",
    "Do not override the website workflow. Help the student reflect, clarify options, understand STEM relevance, and ask better questions.",
    "If the student asks for medical, legal, or financial decisions, give general educational guidance and recommend consulting a qualified professional.",
    `Current website context: ${JSON.stringify(context || {})}`,
    "Conversation:",
    transcript,
  ].join("\n\n");
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  if (!API_KEY) {
    res.status(500).json({ error: "SILICONFLOW_API_KEY is not configured on the server." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const prompt = buildPrompt(messages, body.context || {});

    const response = await fetch(SILICONFLOW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        max_output_tokens: 420,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      res
        .status(response.status)
        .json({ error: data.error?.message || data.message || "SiliconFlow API request failed." });
      return;
    }

    const reply = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message || "AI chat is temporarily unavailable." });
  }
};

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { type, text } = JSON.parse(event.body || '{}');
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return { statusCode: 500, body: "Missing API key" };
  }

  let prompt = "";
  if (type === "summarize") prompt = `Summarize this: ${text}`;
  else if (type === "quiz") prompt = `Make 5 quiz questions from this text: ${text}`;
  else if (type === "chat") prompt = text;

  try {
    const response = await fetch("https://api.groq.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    return { statusCode: 200, body: data.choices[0].message.content };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

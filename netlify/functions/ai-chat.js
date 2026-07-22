// netlify/functions/ai-chat.js
const OpenAI = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, courseTitle } = JSON.parse(event.body);
    
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENAI_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://www.skillbridgeafrica.africa',
        'X-Title': 'SkillBridge Africa AI Tutor',
      },
    });

    const systemPrompt = `You are an AI tutor for SkillBridge Africa (SBA). 
You are helping a student with the course: "${courseTitle}".
Provide helpful, clear, and practical answers. Keep your responses concise (under 150 words).
If you don't know the answer, say "I don't have that information yet – please check the course material or contact support."`;

    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response' }),
    };
  }
};
"Fix broken ai-chat.js syntax"

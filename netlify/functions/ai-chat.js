// netlify/functions/ai-chat.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, courseTitle } = JSON.parse(event.body);

    if (!message || !courseTitle) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing message or courseTitle' }),
      };
    }

    const systemPrompt = `You are the AI Tutor for SkillBridge Africa (SBA). 
You are helping a student who is taking the course: "${courseTitle}".
Give clear, practical, and encouraging answers.
Keep responses concise (2-3 paragraphs max).
If you don't know, say so honestly.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply }),
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI service temporarily unavailable. Please try again later.' }),
    };
  }
};

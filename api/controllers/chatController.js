import OpenAI from 'openai';
import Product from '../models/product.js';
import dotenv from 'dotenv';

dotenv.config({
  path: '../.env'
})

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

export const createChat = async (req, res) => {
    const products = await Product.findAll();

    const contents = `
        Available menu (id:name):
        ${
          products
            .map(p => `- ${p.id}:${p.name}`)
            .join("\n")
        }

        I need straight and rational answer.
        
        ${
          req.body.message
        }.
        Recommend one.

        response format (plain text, no markdown, no code block):
        {
            id,
            reason,
        }
    `
    const completion = await openai.chat.completions.create({
        model: 'baidu/qianfan-ocr-fast:free', // in consistent
        // model: 'inclusionai/ling-2.6-1t:free', // going away Apr 30
        // model: 'tencent/hy3-preview:free', // consistent but slow
        // model: 'google/gemma-4-26b-a4b-it:free', // consistent but slow
        messages: [{
            role: 'user',
            content: contents,
        }],
    });

    return res.json({
      data: JSON.parse(completion.choices[0].message.content)
    })
};
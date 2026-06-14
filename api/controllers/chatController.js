import OpenAI from 'openai';
import Product from '../models/product.js';
import dotenv from 'dotenv';

dotenv.config({
  path: '../.env'
})

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY || '<OPENAI_API_KEY>',
});

export const createChat = async (req, res) => {
    const products = await Product.findAll();

    const systemPrompt = `
        You are a canteen assistant for "Mikro Canteen". Always respond in this exact JSON format, nothing else:
        {
            "message": "your friendly response here",
            "actions": [
                { "label": "button label", "action": "add_to_cart", "item_id": "id here" }
            ]
        }
        If no buttons are needed, return actions as an empty array [].

        Available menu (id:name):
        ${
          products
            .map(p => `- ${p.id}:${p.name}`)
            .join("\n")
        }
    `

    const completion = await openai.chat.completions.create({
        model: 'openrouter/owl-alpha',
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: req.body.message}
        ],
    });

    return res.json({
      data: JSON.parse(completion.choices[0].message.content)
    })
};
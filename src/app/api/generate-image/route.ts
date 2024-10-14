import { generateObject, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import Together from "together-ai";

export const maxDuration = 30;

const systemPrompt = (ageGroup: string) => {
  return "Generate a beautiful storybook image for "
}

export async function POST(req: Request) {
  const { prompt, width, height, ageGroup }: { 
    prompt: string, 
    width: number, 
    height: number,
    ageGroup: string
  } = await req.json();

  const client = new Together({
    apiKey: process.env.TOGETHER_API_KEY,
    baseURL: process.env.TOGETHER_API_URL,
  });

  let response;

  try {
    response = await client.images.create({
      prompt: systemPrompt(ageGroup) + prompt,
      model: "black-forest-labs/FLUX.1-schnell",
      width: width,
      height: height,
      seed: 123,
      steps: 3,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.toString() }));
  }

  return new Response(JSON.stringify(response.data[0]), {
    headers: {
      'content-type': 'application/json',
    },
  });
}

import { generateObject, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import Together from "together-ai";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const systemPrompt = (ageGroup: string) => {
  switch(ageGroup) {
    case "0-3": 
      return "Generate a cute, bright, and whimsical storybook illustration for a 0-3 year old, with simple shapes and vibrant colors.";
    case "4-7": 
      return "Generate a charming storybook illustration for a 4-7 year old, with a mix of cute characters and a bit more detail.";
    case "8-12": 
      return "Generate a detailed and colorful storybook illustration for an 8-12 year old, with realistic elements and dynamic scenes.";
    case "13-18": 
      return "Generate a realistic and visually engaging storybook image for a 13-18 year old, with a focus on rich detail and mature themes.";
    case "18-30": 
      return "Generate a realistic and sophisticated storybook illustration for an 18-30 year old, with detailed backgrounds and lifelike characters.";
    case "30+": 
      return "Generate a realistic and mature storybook illustration for a 30+ year old, with intricate details and a refined style.";
    default: 
      return "Generate a beautiful storybook image with an appropriate level of realism and style based on the age.";
  }
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

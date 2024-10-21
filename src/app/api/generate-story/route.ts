import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { categories } from '@/lib/constant';

const systemPrompt = (age: string) => {
  return `You are an AI storyteller. Your task is to create engaging, creative, and coherent stories based on the prompts provided. Follow these guidelines:

          1. Create stories that are appropriate for the age group ${age}.
          2. Develop interesting characters and plotlines which are appropriate for the age group.
          3. Use vivid descriptions to bring the story to life.
          4. Maintain a consistent tone and style throughout the story.
          5. End the story with a satisfying conclusion.
          6. Add categories to the story. Categories should be a list of tags that describe the story should be in small letters. Only use the categories provided below.

          ----- available categories -----
          ${categories.join(', ')}
          --------------------------------
          Remember to be creative and entertaining while respecting the provided age group.
      `;
}

const getWordsPerPage = (age: string) => {
  switch(age) {
    case "0-3": return 50;
    case "4-7": return 100;
    case "8-12": return 150;
    case "13-18": return 200;
    case "18-30": return 250;
    case "30+": return 250;
    default: return 200;
  }
}

const getUserPrompt = (prompt: string, pages: number, wordsPerPage: number) => {
  return `Create a story with ${pages} pages based on the following prompt: ${prompt}. Each page must contain close to ${wordsPerPage} words.`;
}

export async function POST(req: Request) {
  const { prompt, age, pages }: { prompt: string, age: string, pages: number } = await req.json();

  const provider = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
  });

  const result = await generateObject({
    model: provider(process.env.OPENAI_MODEL as string),
    schema: z.object({
      story: z.object({
        title: z.string(),
        pages: z.array(
          z.object({
            summary: z.string(),
            content: z.string(),
          }),
        ),
        categories: z.array(z.string()),
      }),
    }),
    messages: [
      {
        role: 'system',
        content: systemPrompt(age),
      },
      {
        role: 'user',
        content: getUserPrompt(prompt, pages, getWordsPerPage(age)),
      },
    ],
  });

  const { story } = result.object;

  console.log("Generated story:", story);

  return new Response(JSON.stringify(story), {
    headers: {
      'content-type': 'application/json',
    },
  });
}

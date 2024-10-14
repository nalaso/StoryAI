import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export const maxDuration = 30;

const systemPrompt = (age: string) => {
  return `You are an AI storyteller. Your task is to create engaging, creative, and coherent stories based on the prompts provided. Follow these guidelines:

          1. Create stories that are appropriate for the age group ${age}.
          2. Develop interesting characters and plotlines which are appropriate for the age group.
          3. Use vivid descriptions to bring the story to life.
          4. Maintain a consistent tone and style throughout the story.
          5. End the story with a satisfying conclusion.
          
          Remember to be creative and entertaining while respecting the provided age group.
      `;
}

const getUserPrompt = (prompt: string, pages: number, wordsPerPage: number) => {
  return `Create a story with ${pages} pages based on the following prompt: ${prompt}. Each page should contain ${wordsPerPage*5} characters.`;
}

export async function POST(req: Request) {
  const { prompt, age, pages }: { prompt: string, age: string, pages: number } = await req.json();

  console.log("User prompt:", prompt);

  // const google = createGoogleGenerativeAI({
  //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  //   baseURL: process.env.GOOGLE_GENERATIVE_AI_API_URL,
  // });

  const glhf = createOpenAI({
    apiKey: process.env.GLHF_API_KEY,
    baseURL: process.env.GLHF_API_URL,
  });

  const result = await generateObject({
    model: glhf('hf:meta-llama/Meta-Llama-3.1-405B-Instruct'),
    schema: z.object({
      story: z.object({
        title: z.string(),
        pages: z.array(
          z.object({
            summary: z.string(),
            content: z.string(),
          }),
        )
      }),
    }),
    messages: [
      {
        role: 'system',
        content: systemPrompt(age),
      },
      {
        role: 'user',
        content: getUserPrompt(prompt, pages, 300),
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

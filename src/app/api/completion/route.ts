import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

export const maxDuration = 30;

const systemPrompt = `You are an AI storyteller. Your task is to create engaging, creative, and coherent stories based on the prompts provided. Follow these guidelines:

1. Create stories that are appropriate for all ages.
2. Develop interesting characters and plotlines.
3. Use vivid descriptions to bring the story to life.
4. Maintain a consistent tone and style throughout the story.
5. End the story with a satisfying conclusion.
7. The story should be in the style of a children's book with simple vocabulary and easy to understand words to be understood by a 3 year old.

Remember to be creative and entertaining while respecting the user's input prompt.`;

const getUserPrompt = (prompt: string, pages: number, wordsPerPage: number) => {
  return `Create a story with ${pages} pages based on the following prompt: ${prompt}. Each page should contain ${wordsPerPage*5} characters.`;
}

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  console.log("User prompt:", prompt);

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    baseURL: process.env.GOOGLE_GENERATIVE_AI_API_URL,
  });

  const result = await generateObject({
    model: google('gemini-1.5-pro'),
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
        content: systemPrompt,
      },
      {
        role: 'user',
        content: getUserPrompt(prompt, 3, 3000),
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

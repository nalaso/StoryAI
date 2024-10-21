import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getIp } from "@/lib/ip";

const redis = Redis.fromEnv();

const inputSchema = z.object({
  storyId: z.string().min(1, "storyId is required"),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { storyId } = inputSchema.parse(body);

    const ip = getIp();
    
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
    const hash = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");    

    const isNew = await redis.set(["deduplicate", hash, "story", storyId].join(":"), true, {
      nx: true,
      ex: 24 * 60 * 60 * 1000 * 3,
    });

    if (!isNew) {
      return new NextResponse(null, { status: 202 });
    }

    await redis.incr(["pageviews", "stories", storyId].join(":"));
    await prisma.story.update({
      where: {
        id: storyId,
      },
      data: {
        viewCount: {
          increment: 1,
        }
      },
    });

    return new NextResponse(null, { status: 202 });
  } catch (error) {
    console.error('Error in view-increment API route:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: 'Invalid input', details: error.errors }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
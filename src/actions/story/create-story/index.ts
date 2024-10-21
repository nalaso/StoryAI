'use server'

import { prisma } from "@/lib/prisma";

export const createStory = async ({
    prompt,
    image,
    title,
    pagesCount,
    categories,
    pages,
    ageGroup
}:{
    prompt: string,
    image: string,
    title: string,
    pagesCount: number,
    categories: string[],
    pages: any[],
    ageGroup: string
}) => {
    const data = await prisma.$transaction(async (tx) => {
        const story = await tx.story.create({
            data: {
                prompt,
                image,
                title,
                pagesCount,
                categories,
                ageGroup
            }
        });

        const pagesData = pages.map((page: any) => ({
            pageOrder: page.pageOrder,
            summary: page.summary,
            content: page.content,
            image: page.image,
            storyId: story.id 
        }));

        await tx.page.createMany({
            data: pagesData
        });

        return story;
    });

    return data;
}

'use server'

import { prisma } from "@/lib/prisma";

export const getStory = async (id: string) => {
    const story = await prisma.story.findUnique({
        where: {
            id: id
        },
        include: {
            pages: true
        },
    });
    return story;
}

export const getStories = async (mode: string, start: number, limit: number, timeRange: string, ageGroup: string) => {

    let orderBy =  {}
    let where = {}

    switch (mode) {
        case 'latest':
            orderBy = { createdAt: 'desc' };
            break;
        case 'most_viewed':
            orderBy = [
                { viewCount: 'desc' },    
                { createdAt: 'asc' }  
            ];
            break;
        default:
            orderBy = { createdAt: 'desc' };
    }

    const now = new Date();
    if(mode !== 'latest') {
        switch (timeRange) {
            case '1h':
                where = { createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) } };
                break;
            case '24h':
                where = { createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
                break;
            case '7d':
                where = { createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
                break;
            case '30d':
                where = { createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
                break;
            case 'all':
            default:
                break;
        }
    }

    if(ageGroup !== 'all') {
        where = { ...where, ageGroup };
    }

    const stories = await prisma.story.findMany({
        take: limit, 
        skip: start, 
        where,
        orderBy,
    });

    return stories.map((story) => ({
        id: story.id,
        title: story.title,
        image: story.image,
        createdAt: story.createdAt,
        viewCount: story.viewCount
    }));
}
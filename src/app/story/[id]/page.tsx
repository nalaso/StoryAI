'use client';
import React, { useState, useEffect } from 'react';
import { usePromptStore } from '@/hooks/usePromptStore';
import { Button, Card, Spinner } from '@nextui-org/react';
import StoryBook from '@/components/StoryBook';
import { useParams } from 'next/navigation';
import { getStory } from '@/actions/story/get-story';

interface Page {
	title: string;
	image: string;
	content: string;
}

interface Story {
	title: string;
	image: string;
	pages: Page[];
}

const StoryPage: React.FC = () => {
	const { text, age, pages } = usePromptStore();
	const [story, setStory] = useState<Story>({ 
		title: '', 
		image: '', 
		pages: [] 
	});
	const [loading, setLoading] = useState(true);
	const { id } = useParams();

	useEffect(() => {
		const fetchStory = async () => {
			setLoading(true);
			const data = await getStory(id as string);
			setStory(({
				image: data?.image || '',
				title: data?.title || '',
				pages: data?.pages?.sort((a: any, b: any) => a.pageOrder - b.pageOrder).map((page: any) => ({
					title: page.title,
					image: page.image,
					content: page.content
				})) || []
			}));
			setLoading(false);
		};

		fetchStory();
	}, []);

	useEffect(() => {
		const incView = async () => {
			await fetch('/api/view-increment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ storyId: id }),
			});
		}
		incView()
	}, [])

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			{loading && <Card className="w-full max-w-3xl p-6 space-y-6">
				<h1 className="text-3xl font-bold text-center">{text}</h1>
				 <Spinner color="primary" />
			</Card>}
			{!loading && <StoryBook story={story} />}
		</div>
	);
};

export default StoryPage;

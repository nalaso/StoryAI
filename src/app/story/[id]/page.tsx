'use client';
import React, { useState, useEffect } from 'react';
import { usePromptStore } from '@/store/textStore';
import { Button, Card, Spinner } from '@nextui-org/react';
import StoryBook from '@/app/components/StoryBook';

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

	console.log(story);

	const fetchImage = async (prompt: string, width: number, height: number) => {
		const response = await fetch(`/api/generate-image`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ 
				prompt: prompt,
				width: width,
				height: height,
				ageGroup: age,
			}),
		});
		const data = await response.json();
		return data.url;
	}

	useEffect(() => {
		const fetchStory = async () => {
			setLoading(true);
			try {
				const response = await fetch('/api/generate-story', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ 
						prompt: text,
						age: age,
						pages: parseInt(pages),
					}),
				});

				if (!response.ok) {
					throw new Error('Failed to fetch story');
				}

				const data = await response.json();

				let promises = [];

				for (let i = 0; i < data.pages.length; i++) {
					promises.push(fetchImage(data.title + ". " + data.pages[i].summary, 720, 480));
				}

				const CoverImage = await fetchImage("Create a beautiful cover image with title for a story called " + data.title, 720, 1200);


				Promise.all(promises).then((responses) => {
					const FinalPages: Page[] = []
					for (let i = 0; i < data.pages.length; i++) {
						const page = data.pages[i];
						const image = responses[i];
						FinalPages.push({
							title: page.summary,
							image: image,
							content: page.content,
						});
					}
					setStory(({
						title: data.title,
						image: CoverImage,
						pages: FinalPages,
					}));
					setLoading(false);

				});
			} catch (error) {
				console.error('Error fetching story:', error);
			}
		};

		if (text) {
			fetchStory();
		}
	}, [text]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<Card className="w-full max-w-3xl p-6 space-y-6">
				<h1 className="text-3xl font-bold text-center">{text}</h1>
				{loading && <Spinner color="primary" />}
			</Card>
			{!loading && <StoryBook story={story} />}
		</div>
	);
};

export default StoryPage;

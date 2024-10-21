'use client';
import React, { useEffect, useState } from 'react';
import { usePromptStore } from '@/hooks/usePromptStore';
import { useRouter } from 'next/navigation';
import { Textarea, Button, Card, Select, SelectItem, Spinner } from '@nextui-org/react';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { ages, pagesItem } from '@/lib/constant';
import { createStory } from '@/actions/story/create-story';
import { toast } from 'sonner';

interface Page {
	pageOrder: number;
	summary: string;
	image: string;
	content: string;
}

export default function Home() {
	const { text, setText, pages, setPages, age, setAge } = usePromptStore();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

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

	const generateStory = async (e: React.FormEvent) => {
		e.preventDefault();
		if(!text.trim() || !age || !pages) return;
		try {
			setLoading(true);
			toast.info('Creating story...');
			toast.info('Story content is being generated...');
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

			toast.success('Story content generated successfully!');

			const data = await response.json();

			toast.info('Cover image is being generated...');

			const CoverImage = await fetchImage("Create a beautiful cover image with title for a story called " + data.title, 720, 1200);

			toast.success('Cover image generated successfully!');

			let promises = [];

			for (let i = 0; i < data.pages.length; i++) {
				promises.push(fetchImage(data.title + ". " + data.pages[i].summary, 720, 480));
			}

			toast.info('Story images are being generated...');

			Promise.all(promises).then(async (responses) => {
				toast.success('Story images generated successfully!');
				toast.info('Storing generated story...');
				
				const FinalPages: Page[] = []
				for (let i = 0; i < data.pages.length; i++) {
					const page = data.pages[i];
					const image = responses[i];
					FinalPages.push({
						pageOrder: i+1,
						summary: page.summary,
						image: image,
						content: page.content,
					});
				}
				const story = await createStory({
					prompt: text,
					image: CoverImage,
					title: data.title,
					pagesCount: parseInt(pages),
					categories: data.categories,
					pages: FinalPages,
					ageGroup: age
				});
				setLoading(false);
				toast.success('Story created successfully!');
				router.push(`/story/${story.id}`);
			});
		} catch (error) {
			toast.error('Error creating story, please try again later.');
			console.error('Error fetching story:', error);
			setLoading(false);
		}
	};

	return (
		<div className='bg-gray-100'>
			<Header />    
			<div className="flex min-h-screen flex-col items-center justify-center p-4">
				<Card className="w-full max-w-2xl p-6 space-y-6">
					<h1 className="text-3xl font-bold text-center">AI Story Generator</h1>
					<h4 className="text-center">Enter a prompt, and let AI create a story for you!</h4>
					<form onSubmit={generateStory} className="space-y-4">
						<div className="flex gap-4">
							<Select
								isDisabled={loading}
								label="Number of Pages"
								variant="bordered"
								placeholder="Pages"
								selectedKeys={[pages]}
								className="max-w-xs"
								onChange={(e) => e.target.value && setPages(e.target.value)}
							>
								{
									pagesItem.map((page) => (
										<SelectItem key={page.key}>
											{page.label}
										</SelectItem>
									))
								}
							</Select>
							<Select
								isDisabled={loading}
								label="Target Age"
								variant="bordered"
								placeholder="Age"
								selectedKeys={[age]}
								className="max-w-xs"
								onChange={(e) => e.target.value && setAge(e.target.value)}
							>
								{ages.map((age) => (
									<SelectItem key={age.key}>
										{age.label}
									</SelectItem>
								))}
							</Select>
						</div>
						<Textarea
							isDisabled={loading}
							variant='bordered'
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Enter your story prompt..."
							className="bg-gray-100"
						/>

						<Button
							isDisabled={!text.trim() || loading}
							type="submit"
							color="primary"
							size="lg"
							className="w-full"
						>
							{loading ? <Spinner color="white" /> : "Generate Story"}
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
}

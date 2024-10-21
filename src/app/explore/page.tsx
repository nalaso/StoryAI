"use client";
import { getStories } from '@/actions/story/get-story';
import Header from '@/components/header';
import { ages } from '@/lib/constant';
import { timeAgo } from '@/lib/time';
import { Card, CardBody, Chip, Select, SelectItem, Tab, Tabs } from '@nextui-org/react';
import { Eye, Heart, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Story {
    id: string;
    title: string;
    image: string;
    createdAt: Date;
    viewCount: number;
}

const filterAges = [
    { key: 'all', label: 'All Ages' },
    ...ages
]

const Page = () => {
    const [mode, setMode] = useState<string>("latest");
    const [timeRange, setTimeRange] = useState<string>("all");
    const [stories, setStories] = useState<Story[]>([]);
    const [start, setStart] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false)
    const [maxReached, setMaxReached] = useState(false)
    const [ageGroup, setAge] = useState<string>("all");
    const limit = 9;
    const router = useRouter();

    useEffect(() => {
        const fetchUIs = async () => {
            setIsLoading(true)
            const fetchedStories = await getStories(mode, start, limit, timeRange, ageGroup);
            if (fetchedStories.length === 0) {
                setMaxReached(true)
            }
            if (start === 0) {
                setStories(fetchedStories);
            } else {
                setStories((prevStories) => [...prevStories, ...fetchedStories]);
            }
            setIsLoading(false)
        };

        fetchUIs();
    }, [mode, start, timeRange, ageGroup]);

    const handleTabChange = (value: string) => {
        setMaxReached(false)
        setStories([])
        setMode(value);
        setStart(0);
    };

    const handleTimeRangeChange = (value: string) => {
        setMaxReached(false)
        setStories([])
        setTimeRange(value);
        setStart(0);
    };

    const handleAgeChange = (value: string) => {
        setMaxReached(false)
        setStories([])
        setAge(value);
        setStart(0);
    };

    const handleLoadMore = () => {
        if (!maxReached) {
            setStart((prevStart) => prevStart + limit);
        }
    };

    useEffect(() => {
        if (isLoading) return
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
            if (bottom && !isLoading) {
                handleLoadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto pt-5 flex w-full flex-col">
                <div className='flex justify-between py-2 '>
                        <h1 className="text-3xl font-bold">Explore</h1>
                        <Select
								label="Target Age"
								variant="bordered"
								placeholder="Age"
								selectedKeys={[ageGroup]}
								className="max-w-xs"
								onChange={(e) => e.target.value && handleAgeChange(e.target.value)}
							>
								{filterAges.map((age) => (
									<SelectItem key={age.key}>
										{age.label}
									</SelectItem>
                        ))}
                    </Select>
                </div>
                <Tabs selectedKey={mode} onSelectionChange={(key) => handleTabChange(key.toString())}>
                    {
                        [{
                            key: 'latest',
                            label: 'Latest'
                        }, {
                            key: 'most_viewed',
                            label: 'Most Viewed'
                        }].map((mode) => (
                            <Tab key={mode.key} title={mode.label}>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {stories && stories.map((story) => (
                                    <Card key={story.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div onClick={() => router.push(`story/${story.id}`)} className="relative cursor-pointer">
                                            <img src={story.image} alt={story.title} className="w-full object-cover" />
                                        </div>
                                        <CardBody className="p-2 flex flex-row justify-between">
                                            <div
                                                className="flex rounded-s-full font-semibold "
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                <p className="text-xs text-gray-600">{story.viewCount}</p>
                                            </div>
                                            <p className="text-xs text-gray-600 whitespace-nowrap ml-2 flex-shrink-0">
                                                {timeAgo(story.createdAt)}
                                            </p>
                                        </CardBody>
                                    </Card>
                                ))}
                                {
                                    isLoading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                        <Card key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                                            <div className="relative">
                                                <div className="w-full h-48 bg-gray-200" />
                                            </div>
                                            <CardBody className="p-2 flex flex-row justify-between items-center">
                                                <div className="w-5 h-5 bg-gray-200 rounded-full" />
                                                <div className="w-16 h-5 bg-gray-200 rounded-full" />
                                            </CardBody>
                                        </Card>
                                    ))
                                }
                            </div>
                        </Tab>
                        ))
                    }
                </Tabs>
            </div>
        </div>
    );
};

export default Page;

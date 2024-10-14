'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTextStore } from '@/store/textStore';
import { Button, Card, Spinner } from '@nextui-org/react';
import StoryBook from '@/app/components/StoryBook';

interface Page {
  title: string;
  content: string;
}

interface Story {
  title: string;
  pages: Page[];
}

const StoryPage: React.FC = () => {
  const params = useParams();
  const { text } = useTextStore();
  const [story, setStory] = useState<Story>({title: '', pages: []});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: text }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        
        const data = await response.json();
        console.log(data);
        
        setStory(data);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
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
          { loading && <Spinner color="primary" /> }
      </Card>
      { !loading && <StoryBook story={story} /> }
    </div>
  );
};

export default StoryPage;

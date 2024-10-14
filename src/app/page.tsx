'use client';
import React from 'react';
import { useTextStore } from '@/store/textStore';
import { useRouter } from 'next/navigation';
import { Textarea, Button, Card } from '@nextui-org/react';
export default function Home() {
  const { text, setText } = useTextStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      router.push('/story/1'); // Replace '1' with actual story ID logic
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">AI Story Generator</h1>
        <h4 className="text-center">Enter a prompt, and let AI create a story for you!</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            variant='bordered'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your story prompt..."
            rows={6}
            fullWidth
            className="bg-gray-100"
          />
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full"
            disabled={!text.trim()}
          >
            Generate Story
          </Button>
        </form>
      </Card>
    </div>
  );
}

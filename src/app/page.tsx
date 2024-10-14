'use client';
import React, { useEffect, useState } from 'react';
import { usePromptStore } from '@/store/textStore';
import { useRouter } from 'next/navigation';
import { Textarea, Button, Card, Select, SelectItem } from '@nextui-org/react';

export default function Home() {
  const { text, setText, pages, setPages, age, setAge } = usePromptStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      router.push(`/story/id`);
    }
  };

  const ages = [
    { key: "0-3", label: "0-3" },
    { key: "4-7", label: "4-7" },
    { key: "8-12", label: "8-12" },
    { key: "13-18", label: "13-18" },
    { key: "18+", label: "18+" },
  ];

  const pagesItem = [
    { key: "1", label: "1" },
    { key: "2", label: "2" },
    { key: "3", label: "3" },
    { key: "4", label: "4" },
    { key: "5", label: "5" },
    { key: "6", label: "6" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">AI Story Generator</h1>
        <h4 className="text-center">Enter a prompt, and let AI create a story for you!</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Select
              label="Number of Pages"
              variant="bordered"
              placeholder="Pages"
              selectedKeys={[pages]}
              className="max-w-xs"
              onChange={(e) => setPages(e.target.value)}
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
              label="Target Age"
              variant="bordered"
              placeholder="Age"
              selectedKeys={[age]}
              className="max-w-xs"
              onChange={(e) => setAge(e.target.value)}
            >
              {ages.map((age) => (
                <SelectItem key={age.key}>
                  {age.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Textarea
            variant='bordered'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your story prompt..."
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

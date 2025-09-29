'use client';

import { useEffect, useState, use } from 'react';
import { useParams } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Story } from '@/types'; // Assuming you have a types file

export default function StoryPage() {
  const params = useParams();
  const storyId = params.id; // It's safe to access id here now

  const supabase = createSupabaseClient();
  const [story, setStory] = useState<Story | null>(null);
  const [content, setContent] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (error) {
        console.error('Error fetching story:', error);
        setError('Failed to load story.');
      } else {
        setStory(data);
        setContent(data.content || '');
      }
    };

    fetchStory();
  }, [storyId, supabase]);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    const newContent = content + '\n\n' + input;
    setContent(newContent);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        streamedContent += chunk;
        setContent(newContent + streamedContent);
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!story) {
    return <div>Loading story...</div>;
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{story.title}</h1>
        {/* Your Export button would go here */}
      </header>

      <div className="flex-grow p-4 bg-surface rounded overflow-y-auto mb-4">
        {/* This is where the story content should be displayed */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-auto">
        <textarea
          className="w-full p-2 rounded bg-surface border border-gray-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Continue the story..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 p-2 bg-primary rounded"
        >
          {isLoading ? 'Generating...' : 'Your Turn, AI'}
        </button>
      </form>
    </div>
  );
}
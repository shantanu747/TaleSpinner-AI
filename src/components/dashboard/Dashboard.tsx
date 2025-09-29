'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase/client';
import NewStoryModal from './NewStoryModal';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';

interface Story {
  id: string;
  title: string;
  genre: string;
  created_at: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const supabase = createSupabaseClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, genre, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
      } else {
        setStories(data);
      }
      setLoading(false);
    };

    fetchStories();
  }, [user.id, supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      window.location.href = '/';
    }
  };

  const handleDelete = async (e: React.MouseEvent, storyId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const { error } = await supabase.from('stories').delete().eq('id', storyId);

    if (error) {
      console.error('Error deleting story:', error);
    } else {
      setStories(stories.filter((story) => story.id !== storyId));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-on-primary-text p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Welcome to your Dashboard!</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 font-bold text-white rounded-md bg-blue-600 hover:bg-blue-500"
          >
            New Story
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 font-bold text-white rounded-md bg-primary hover:bg-opacity-90"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">My Stories</h2>
        {loading ? (
          <p>Loading stories...</p>
        ) : stories.length === 0 ? (
          <p>You have no stories yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
              <Link href={`/story/${story.id}`} key={story.id} className="block bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
                <h3 className="text-xl font-bold text-primary truncate">{story.title}</h3>
                <p className="text-on-secondary-text mt-2">{story.genre}</p>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={(e) => handleDelete(e, story.id)}
                    className="text-sm text-red-500 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && <NewStoryModal user={user} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

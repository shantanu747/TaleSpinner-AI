export interface Story {
  id: string;
  user_id: string;
  title: string;
  genre: string | null;
  prompt: string | null;
  content: string | null;
  created_at: string;
}
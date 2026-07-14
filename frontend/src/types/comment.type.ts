type Author = {
  first_name: string;
  last_name: string;
  avatar_url: string;
};

export type Comment = {
  id: string;
  content: string;
  reply_count: number;
  like_count: number;
  author: Author;
  is_liked: boolean;
  created_at: string;
};

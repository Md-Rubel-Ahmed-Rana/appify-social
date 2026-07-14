type Author = {
  id: string;
  name: string;
  avatar_url: string;
};

export type Reply = {
  id: string;
  content: string;
  like_count: number;
  created_at: string;
  is_liked: boolean;
  is_owner: boolean;
  parent_reply_id: string | null;
  author: Author;
  reply_to_user: Author | null;
};

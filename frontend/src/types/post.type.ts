type Author = {
  id: string;
  name: string;
  avatar_url?: string;
};

type PostImage = {
  url: string;
  width: number;
  height: number;
};

export type Post = {
  id: string;
  author: Author;
  content: string;
  created_at: string;
  image: PostImage;
  is_liked: false;
  comment_count: number;
  like_count: number;
};

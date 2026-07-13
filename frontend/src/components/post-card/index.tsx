import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Post } from '@/types/post.type';
import PostActions from './PostActions';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostImage from './PostImage';

type Props = {
  post: Post;
};

const PostCard = ({ post }: Props) => {
  return (
    <Card>
      <CardContent className="space-y-3 px-3 py-1">
        <PostHeader author={post.author} created_at={post.created_at} />

        <PostContent content={post.content} />

        <PostImage image={post?.image} />

        <Separator />

        <PostActions
          liked={post.is_liked}
          like_count={post.like_count}
          comment_count={post.comment_count}
          post_id={post.id}
        />
      </CardContent>
    </Card>
  );
};

export default PostCard;

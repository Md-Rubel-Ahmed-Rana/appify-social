import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import { Post } from '@/types/post.type';

type Props = {
  author: Post['author'];
  created_at: string;
};

const PostHeader = ({ author, created_at }: Props) => {
  const published = formatDistanceToNowStrict(new Date(created_at), {
    addSuffix: true,
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={author.avatar_url} />

          <AvatarFallback>
            {author.name
              .split(' ')
              .map((item) => item[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="font-semibold leading-none">{author.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground">{published}</p>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;

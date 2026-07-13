import { Post } from '@/types/post.type';

type Props = {
  content: Post['content'];
};

const PostContent = ({ content }: Props) => {
  return (
    <p className="whitespace-pre-wrap wrap-break-word leading-7 text-[15px]">
      {content}
    </p>
  );
};

export default PostContent;

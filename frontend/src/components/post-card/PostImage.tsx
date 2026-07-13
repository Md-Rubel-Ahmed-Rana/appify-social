import { Post } from '@/types/post.type';
import Image from 'next/image';

type Props = {
  image?: Post['image'];
};

const PostImage = ({ image }: Props) => {
  if (!image?.url) return null;

  return (
    <div className="overflow-hidden rounded-xl  border">
      <Image
        src={image.url}
        alt="Post image"
        width={image?.width || 1200}
        height={image?.height || 700}
        className="h-auto w-full  object-cover"
      />
    </div>
  );
};

export default PostImage;

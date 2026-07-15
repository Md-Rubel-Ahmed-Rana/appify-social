import CreatePostCard from '../posts/CreatePostCard';
import FeedPosts from './FeedPosts';

const Feed = () => {
  return (
    <div className="max-w-7xl mx-auto lg:px-6 space-y-2 mt-2 px-2">
      <CreatePostCard />
      <FeedPosts />
    </div>
  );
};

export default Feed;

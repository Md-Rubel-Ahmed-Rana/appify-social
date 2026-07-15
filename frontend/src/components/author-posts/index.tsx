import {
  useGetPostsByAuthorQuery,
  useLazyGetPostsByAuthorQuery,
} from '@/api/posts';
import { User } from '@/types/user.type';
import AuthorPostHeader from './AuthorPostHeader';
import PostsContainer from '../posts';

type Props = {
  user: User;
};

const AuthorPosts = ({ user }: Props) => {
  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useGetPostsByAuthorQuery({});

  const [fetchMore, { isFetching: isFetchingMore }] =
    useLazyGetPostsByAuthorQuery();

  return (
    <div className="max-w-7xl mx-auto lg:px-6 space-y-2 mt-2 px-2">
      <AuthorPostHeader user={user} />
      <PostsContainer
        fetchMore={fetchMore}
        isFetchingMore={isFetchingMore}
        isLoading={isLoading}
        meta={result?.data?.meta}
        posts={result?.data?.posts || []}
        refetch={refetch}
        error={error}
      />
    </div>
  );
};

export default AuthorPosts;

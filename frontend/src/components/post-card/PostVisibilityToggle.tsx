import { useToggleVisibilityMutation } from '@/api/posts';
import { toast } from 'sonner';

type Props = {
  post_id: string;
  is_public: boolean;
};

const PostVisibilityToggle = ({ is_public, post_id }: Props) => {
  const [toggle, { isLoading }] = useToggleVisibilityMutation();

  const handleToggleVisibility = async () => {
    try {
      const result = await toggle({ post_id }).unwrap();
      if (result.statusCode === 200) {
        toast.success(result.message || 'Post visibility updated successfully');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to change visibility');
    }
  };

  const buttonText = isLoading
    ? is_public
      ? '🔒 Making Private...'
      : '🌐 Making Public...'
    : is_public
      ? '🔒 Make Private'
      : '🌐 Make Public';

  return (
    <button disabled={isLoading} onClick={handleToggleVisibility}>
      {buttonText}
    </button>
  );
};

export default PostVisibilityToggle;

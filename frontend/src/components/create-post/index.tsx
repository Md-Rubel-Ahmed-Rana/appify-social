"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import CreatePostForm from "./create-post-form";
import { usePublishPostMutation } from "@/api/posts";
import { toast } from "sonner";
import { User } from "@/types/user.type";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
};

const CreatePostModal = ({ open, setOpen, user }: Props) => {
  const [createPost, { isLoading }] = usePublishPostMutation();

  const handleCreatePost = async (formData: FormData) => {
    try {
      const result = await createPost(formData).unwrap();
      if (result?.statusCode === 201) {
        setOpen(false);
        toast.success(result?.message || "Post published successfully");
      } else {
        toast.error(
          result?.error?.data?.message ||
            result?.message ||
            "Failed to publish post. Please try again!",
        );
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message ?? "Failed to publish post. Please try again!",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="space-y-4">
          <DialogTitle>Create Post</DialogTitle>

          <div className="flex items-center gap-3">
            <Avatar className="size-11">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback>
                {user.first_name[0]}
                {user.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="font-medium leading-none">
                {user.first_name} {user.last_name}
              </p>

              <p className="text-sm text-muted-foreground">
                Share something with your audience
              </p>
            </div>
          </div>
        </DialogHeader>

        <CreatePostForm
          onSubmit={handleCreatePost}
          isLoading={isLoading}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

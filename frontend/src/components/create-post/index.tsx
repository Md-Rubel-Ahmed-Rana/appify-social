"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CreatePostForm from "./create-post-form";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreatePostModal = ({ open, setOpen }: Props) => {
  const handleSubmit = async (formData: FormData) => {
    try {
      console.log(Object.fromEntries(formData.entries()));

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>

          <DialogDescription>
            Share your thoughts, photos, or updates with your audience.
          </DialogDescription>
        </DialogHeader>

        <CreatePostForm
          onSubmit={handleSubmit}
          isLoading={false}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

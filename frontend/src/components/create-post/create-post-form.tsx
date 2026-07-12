/* eslint-disable react-hooks/incompatible-library */
"use client";

import { KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import ImageUpload from "./image-upload";
import VisibilitySelect from "./visibility-select";

import {
  CreatePostFormValues,
  createPostSchema,
  MAX_POST_CONTENT_LENGTH,
} from "./schema";

type Props = {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  setOpen: (value: boolean) => void;
};

const CreatePostForm = ({ onSubmit, isLoading, setOpen }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      image: undefined,
      visibility: "public",
    },
    mode: "onChange",
  });

  const content = watch("content");
  const image = watch("image");

  const submitHandler = async (values: CreatePostFormValues) => {
    const formData = new FormData();

    formData.append("content", values.content.trim());

    if (values.image) {
      formData.append("image", values.image);
    }

    formData.append("visibility", values.visibility);

    await onSubmit(formData);

    reset();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();

      void handleSubmit(submitHandler)();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <div className="space-y-2">
        <Textarea
          {...register("content")}
          rows={6}
          placeholder="What's on your mind?"
          onKeyDown={handleKeyDown}
          disabled={isSubmitting || isLoading}
          className="resize-none border bg-transparent px-2 text-base shadow-none focus-visible:ring-0"
        />

        <div className="flex items-center justify-between">
          <div>
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <p
            className={`text-xs ${
              content.length > MAX_POST_CONTENT_LENGTH * 0.9
                ? "text-amber-500"
                : "text-muted-foreground"
            }`}
          >
            {content.length} / {MAX_POST_CONTENT_LENGTH}
          </p>
        </div>
      </div>

      <ImageUpload
        control={control}
        name="image"
        disabled={isSubmitting || isLoading}
      />

      <div className="flex items-center justify-between rounded-xl border p-4">
        <div>
          <h4 className="text-sm font-medium">Who can see this post?</h4>

          <p className="text-xs text-muted-foreground">
            Choose who can view your post.
          </p>
        </div>

        <VisibilitySelect
          control={control}
          name="visibility"
          disabled={isSubmitting || isLoading}
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || isLoading}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting || isLoading || (!content.trim() && !image) || !isValid
          }
        >
          {(isSubmitting || isLoading) && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}

          {isSubmitting || isLoading ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;

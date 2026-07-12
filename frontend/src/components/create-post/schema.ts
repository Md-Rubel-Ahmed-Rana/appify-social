import { z } from "zod";

export const MAX_POST_CONTENT_LENGTH = 5000;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const POST_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export const createPostSchema = z
  .object({
    content: z
      .string()
      .trim()
      .max(
        MAX_POST_CONTENT_LENGTH,
        `Post content must not exceed ${MAX_POST_CONTENT_LENGTH} characters.`,
      ),

    image: z
      .instanceof(File, {
        message: "Please select a valid image.",
      })
      .refine(
        (file) =>
          ALLOWED_IMAGE_TYPES.includes(
            file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
          ),
        {
          message: "Only JPG, PNG, and WEBP images are allowed.",
        },
      )
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: "Image size must not exceed 5 MB.",
      })
      .optional(),

    visibility: z.enum(
      [POST_VISIBILITY.PUBLIC, POST_VISIBILITY.PRIVATE] as const,
      {
        message: "Please select post visibility.",
      },
    ),
  })
  .superRefine(({ content, image }, ctx) => {
    if (!content.trim() && !image) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content"],
        message: "Write something or attach an image.",
      });
    }
  });

export type CreatePostFormValues = z.infer<typeof createPostSchema>;

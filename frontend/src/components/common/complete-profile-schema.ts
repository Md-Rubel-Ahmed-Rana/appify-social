import { z } from "zod";

export const completeProfileSchema = z
  .object({
    bio: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.string().trim().max(30).optional(),
    ),

    avatar: z
      .instanceof(File, {
        message: "Please select a valid image.",
      })
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only JPG, PNG and WebP are allowed.",
      )
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Maximum image size is 5MB.",
      )
      .optional(),
  })
  .refine(
    ({ bio, avatar }) => {
      return Boolean(bio?.trim()) || Boolean(avatar);
    },
    {
      path: ["bio"],
      message: "Please upload a photo or add a bio.",
    },
  );

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

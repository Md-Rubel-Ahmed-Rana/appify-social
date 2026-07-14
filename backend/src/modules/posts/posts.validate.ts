import z from "zod";

const postEditSchema = z.object({
  body: z.object({
    content: z
      .string({ error: "Post content is required." })
      .trim()
      .min(1, "Post cannot be empty.")
      .max(5000, "Post cannot exceed 5000 characters."),
  }),
});

export const PostValidations = { update: postEditSchema };

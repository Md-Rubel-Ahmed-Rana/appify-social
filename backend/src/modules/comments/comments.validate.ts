import { Types } from "mongoose";
import z from "zod";

const objectId = z
  .string()
  .trim()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid post id",
  })
  .transform((value) => new Types.ObjectId(value));

const createCommentSchema = z.object({
  body: z
    .object({
      post_id: objectId,
      content: z.string({ error: "Content is required" }).min(3).max(5000),
    })
    .strict(),
});

const updateCommentSchema = z.object({
  body: z
    .object({
      content: z.string({ error: "Content is required" }).min(3).max(5000),
    })
    .strict(),
  params: z.object({
    id: objectId,
  }),
});

export const CommentValidations = {
  create: createCommentSchema,
  update: updateCommentSchema,
};

import { Types } from "mongoose";
import z from "zod";

const objectId = z
  .string()
  .trim()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid target id",
  })
  .transform((value) => new Types.ObjectId(value));

const replySchema = z.object({
  body: z
    .object({
      comment_id: objectId,
      parent_reply_id: objectId.nullish(),
      content: z
        .string({ error: "Reply content is required." })
        .trim()
        .min(1, "Reply cannot be empty.")
        .max(5000, "Reply cannot exceed 5000 characters."),
    })
    .strict(),
});

export const ReplyValidations = {
  reply: replySchema,
};

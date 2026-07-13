import { Types } from "mongoose";
import z from "zod";
import { LikeTargetType } from "./likes.interface";

const objectId = z
  .string()
  .trim()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid target id",
  })
  .transform((value) => new Types.ObjectId(value));

const create = z.object({
  body: z
    .object({
      target_type: z.enum(Object.values(LikeTargetType)),
      target_id: objectId,
    })
    .strict(),
});

export const LikeValidations = {
  create,
};

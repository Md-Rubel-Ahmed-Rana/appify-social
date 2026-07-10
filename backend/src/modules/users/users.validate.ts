import z from "zod";

const create = z.object({
  body: z
    .object({
      name: z
        .string({
          error: "Name is required",
        })
        .min(3, "Name must be at least 3 characters"),
      phone_number: z.string(),
      email: z.email({ error: "Email is required" }),
      password: z
        .string({ error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(15, "Password must be less than 15 characters"),
    })
    .strict(),
});

export const UserValidations = { create };

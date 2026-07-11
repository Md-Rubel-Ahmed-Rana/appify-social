import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .email({ error: "Enter a valid email" })
    .transform((v) => v.trim().toLowerCase()),

  password: z.string().min(8, "Password must be at least 8 characters").max(64),
});

export type SigninInput = z.infer<typeof signinSchema>;

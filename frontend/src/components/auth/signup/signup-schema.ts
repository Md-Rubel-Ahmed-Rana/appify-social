import { z } from "zod";

export const signupSchema = z.object({
  first_name: z
    .string({ error: "First name is required" })
    .trim()
    .min(1, "First name is required")
    .max(50),

  last_name: z
    .string({ error: "Last name is required" })
    .trim()
    .min(1, "Last name is required")
    .max(50),

  email: z
    .email({ error: "Invalid email address" })
    .transform((email) => email.toLowerCase().trim()),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,64}$/,
      "Password must contain uppercase, lowercase, number, and special character.",
    ),
});

export type SignupInput = z.infer<typeof signupSchema>;

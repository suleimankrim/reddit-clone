import z from "zod";

export const UserNameSchema = z.object({
  username: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z0-9_]+$/),
});

export type UserNameType = z.infer<typeof UserNameSchema>;

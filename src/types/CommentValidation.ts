import z from "zod";

export const CommentSchema = z.object({
  text: z.string(),
  postId: z.string(),
  replayTo: z.string().optional(),
});

export type CommentType = z.infer<typeof CommentSchema>;

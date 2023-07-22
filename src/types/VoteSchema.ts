import z from "zod";

export const voteSchema = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});
export type VoteSchemaRequest = z.infer<typeof voteSchema>;

export const voteCommentSchema = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});
export type VoteCommentSchemaRequest = z.infer<typeof voteCommentSchema>;

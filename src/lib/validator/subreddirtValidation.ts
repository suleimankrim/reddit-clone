import z from "zod";

export const subreddirtNameValidator = z.object({
  name: z.string().max(22).min(3),
});

export const subreddirtSubredditIdValidator = z.object({
  subredditId: z.string(),
});
export type subridderNamePayload = z.infer<typeof subreddirtNameValidator>;
export type subridderSubreddirIdPayload = z.infer<
  typeof subreddirtSubredditIdValidator
>;

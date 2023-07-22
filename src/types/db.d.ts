import { Post, Subreddit, Vote, User, Comment } from ".prisma/client";

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  vote: Vote[];
  author: User;
  comments: Comment[];
};

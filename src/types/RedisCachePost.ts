import z from "zod";
import { Vote } from ".prisma/client";

export type CacheSchema = {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: Date;
  currentVote: Vote["type"];
};

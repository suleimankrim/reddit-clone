import { getAuthSession } from "@/lib/auth";
import { voteSchema } from "@/types/VoteSchema";
import { db } from "@/lib/db";
import { CacheSchema } from "@/types/RedisCachePost";
import { redis } from "@/lib/redis";
import z from "zod";

const CACHE_AFTER_UPDATE = -100;

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("unAuthorized", { status: 401 });
    const body = await req.json();
    const { voteType, postId } = voteSchema.parse(body);
    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        vote: true,
        author: true,
      },
    });
    if (!post) return new Response("post not found", { status: 404 });
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            postId_userId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("deleted");
      }
      await db.vote.update({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });
      const voteAmount = post.vote.reduce((acc, current) => {
        if (current.type === "UP") return acc + 1;
        if (current.type === "DOWN") return acc - 1;
        return acc;
      }, 0);
      if (voteAmount > CACHE_AFTER_UPDATE) {
        const payload: CacheSchema = {
          id: post.id,
          content: JSON.stringify(post.content),
          createdAt: post.createdAt,
          currentVote: voteType,
          title: post.title,
          username: post.author.username ?? "",
        };
        await redis.hset(`post:${post.id}`, payload);
      }
      return new Response("ok");
    } else {
      await db.vote.create({
        data: {
          type: voteType,
          postId,
          userId: session.user.id,
        },
      });
      const voteAmount = post.vote.reduce((acc, current) => {
        if (current.type === "UP") return acc + 1;
        if (current.type === "DOWN") return acc - 1;
        return acc;
      }, 0);
      if (voteAmount > CACHE_AFTER_UPDATE) {
        const payload: CacheSchema = {
          id: post.id,
          content: JSON.stringify(post.content),
          createdAt: post.createdAt,
          currentVote: voteType,
          title: post.title,
          username: post.author.username ?? "",
        };
        await redis.hset(`post:${post.id}`, payload);
      }
      return new Response("ok");
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    } else {
      return new Response("could not post now please try later");
    }
  }
}

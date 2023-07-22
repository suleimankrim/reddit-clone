import { getAuthSession } from "@/lib/auth";
import { voteCommentSchema } from "@/types/VoteSchema";
import { db } from "@/lib/db";
import z from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("unAuthorized", { status: 401 });
    const body = await req.json();
    const { voteType, commentId } = voteCommentSchema.parse(body);
    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            commentId_userId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
        return new Response("deleted");
      } else {
        await db.commentVote.update({
          where: {
            commentId_userId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
      }
      return new Response("ok");
    }
    await db.commentVote.create({
      data: {
        userId: session.user.id,
        commentId,
        type: voteType,
      },
    });
    return new Response("ok");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    } else {
      return new Response("could not post now please try later");
    }
  }
}

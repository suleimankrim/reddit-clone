import { getAuthSession } from "@/lib/auth";
import { CommentSchema } from "@/types/CommentValidation";
import { db } from "@/lib/db";
import z from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("anAuthorized", { status: 401 });
    const body = await req.json();
    const { replayTo, postId, text } = CommentSchema.parse(body);
    await db.comment.create({
      data: {
        text,
        postId,
        replyToId: replayTo,
        authorId: session.user.id,
      },
    });
    return new Response("done");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    } else {
      return new Response("could not create subreddit");
    }
  }
}

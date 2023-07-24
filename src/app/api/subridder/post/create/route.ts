import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import z from "zod";
import { PostValidator } from "@/lib/validator/PosTvalidator";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("anAuthorized", { status: 401 });
    }
    const body = await req.json();
    const { subredditId, title, content } = PostValidator.parse(body);
    const isSubscribe = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });
    if (!isSubscribe) {
      return new Response("you should subscribe before post", { status: 409 });
    }
    await db.post.create({
      data: {
        subredditId,
        title,
        content,
        authorId: session.user.id,
      },
    });
    return new Response("OK");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    } else {
      return new Response("could not post now please try later");
    }
  }
}

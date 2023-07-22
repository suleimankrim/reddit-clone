import { getAuthSession } from "@/lib/auth";
import { subreddirtSubredditIdValidator } from "@/lib/validator/subreddirtValidation";
import { db } from "@/lib/db";
import z from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("anAuthorized", { status: 401 });
    }
    const body = await req.json();
    const { subredditId } = subreddirtSubredditIdValidator.parse(body);
    const isSubscribe = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });
    if (isSubscribe) {
      return new Response("user already subscribe", { status: 409 });
    }
    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id,
      },
    });
    return new Response(subredditId);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    } else {
      return new Response("could not create subreddit");
    }
  }
}

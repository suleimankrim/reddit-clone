import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import z from "zod";
import { subreddirtNameValidator } from "@/lib/validator/subreddirtValidation";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("User an authorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = subreddirtNameValidator.parse(body);
    const existingSubreddit = await db.subreddit.findFirst({
      where: {
        name,
      },
    });
    if (existingSubreddit) {
      return new Response("name is already exist", { status: 409 });
    }
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });
    await db.subscription.create({
      data: {
        subredditId: subreddit.id,
        userId: session.user.id,
      },
    });
    return new Response(subreddit.name);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    } else {
      return new Response("could not create subreddit");
    }
  }
}

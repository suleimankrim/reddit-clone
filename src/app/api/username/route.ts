import { getAuthSession } from "@/lib/auth";
import { UserNameSchema } from "@/lib/validator/UserNameValidation";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("unauthorized", { status: 401 });
    const body = await req.json();
    const { username } = UserNameSchema.parse(body);
    const existUserName = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (existUserName)
      return new Response("existing userName", { status: 409 });
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });
    return new Response("ok");
  } catch (e) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}

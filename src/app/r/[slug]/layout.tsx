import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import JoinLeaveTaggle from "@/components/JoinLeaveTaggle";
import { cn } from "@/lib/utils";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          vote: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;
  if (!subreddit) return notFound();

  const countSubscription = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });
  return (
    <div
      className="w-full h-full grid grid-cols-4 bg-zinc-50 min-h-screen"
      suppressHydrationWarning={true}
    >
      <div className="col-span-3 h-full">{children}</div>

      <div className="hidden md:block col-span-1 border border-gray-300 h-fit rounded-lg shadow overflow-hidden bg-white mt-[70px]">
        <div className=" py-3 w-full text-center bg-gray-200">
          About r/{subreddit.name}
        </div>
        <div className="flex justify-center">
          <div className="p-3 inline-block">CreatedAt</div>
          <span className="p-3 text-end">
            {format(subreddit.createdAt, "MMM d, YYY")}
          </span>
        </div>
        <hr className="text-zinc-600 p-2"></hr>
        <div className="flex justify-center">
          <div className="p-1 inline-block">Members</div>
          <span className="p-1 text-end">{countSubscription}</span>
        </div>
        <hr className="text-zinc-600 p-2"></hr>
        {subreddit?.creatorId === session?.user.id ? (
          <div className="px-4 pb-3 text-center">
            You Created this Community
          </div>
        ) : (
          <JoinLeaveTaggle
            subredditId={subreddit.id}
            subredditName={subreddit.name}
            isSubscribe={isSubscribed}
          />
        )}
        <div className="w-full px-3 pb-3 pt-1">
          <Link
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "w-full"
            )}
            href={`/r/${slug}/submit`}
          >
            Create Post
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Layout;

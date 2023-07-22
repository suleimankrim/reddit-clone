import { db } from "@/lib/db";
import { INFINITE_SCROLLER_PAGINATION_RESULTS } from "@/config";
import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const CustomPosts = async () => {
  const session = await getAuthSession();

  // only rendered if session exists, so this will not happen
  if (!session) return notFound();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((sub) => sub.subreddit.name),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      vote: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLER_PAGINATION_RESULTS,
  });
  return <PostFeed initialPost={posts}></PostFeed>;
};
export default CustomPosts;

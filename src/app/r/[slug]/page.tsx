import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { INFINITE_SCROLLER_PAGINATION_RESULTS } from "@/config";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/Community-lande-page/MiniCreatePost";
import PostFeed from "@/components/PostFeed";

interface PageProps {
  params: {
    slug: string;
  };
}

const CommunityLandPage = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  if (!session) return notFound();
  const subridder = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          vote: true,
          author: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    take: INFINITE_SCROLLER_PAGINATION_RESULTS,
  });
  if (!subridder) return notFound();
  return (
    <div
      className="flex items-center flex-col pt-8"
      suppressHydrationWarning={true}
    >
      <div className="text-2xl font-bold mb-2">{subridder.name}</div>
      <MiniCreatePost session={session} slug={slug}></MiniCreatePost>
      <PostFeed
        initialPost={subridder.posts}
        subridderName={subridder.name}
      ></PostFeed>
    </div>
  );
};
export default CommunityLandPage;

import { db } from "@/lib/db";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLER_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";

const GeneralPost = async () => {
  const posts: ExtendedPost[] = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      vote: true,
      author: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLER_PAGINATION_RESULTS,
  });
  return <PostFeed initialPost={posts} />;
};
export default GeneralPost;

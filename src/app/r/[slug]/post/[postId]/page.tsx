import { Suspense } from "react";
import { redis } from "@/lib/redis";
import { CacheSchema } from "@/types/RedisCachePost";
import { Post, User, Vote } from ".prisma/client";
import { db } from "@/lib/db";
import PostVoteServerSIde from "@/components/post-vote/PostVoteServerSIde";
import { notFound } from "next/navigation";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { formatTimeToNow } from "@/lib/utils";
import Test from "@/components/ui/Test";
import CommentsSection from "@/components/CommentsSection";

interface PageProps {
  params: {
    postId: string;
  };
}

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
const Page = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `postId:${params.postId}`
  )) as CacheSchema;
  let post: (Post & { vote: Vote[]; author: User }) | null = null;
  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        vote: true,
        author: true,
      },
    });
  }
  if (!cachedPost && !post) return notFound();
  return (
    <div className="w-full h-full flex gap-1 justify-center">
      <Suspense fallback={fallBackVote()}>
        {/* @ts-expect-error async server component */}
        <PostVoteServerSIde
          postId={post?.id || cachedPost?.id}
          getData={async () => {
            return db.post.findFirst({
              where: {
                id: params.postId,
              },
              include: {
                vote: true,
              },
            });
          }}
        ></PostVoteServerSIde>
      </Suspense>
      <div className="bg-white rounded-lg shadow-xl mt-6  p-2 w-[600px]">
        <div className="w-full flex mt-2">
          <div className="text-sm inline-block mr-0.5">
            Posted By {post?.author.username ?? cachedPost.username}
          </div>
          <div className="text-sm">
            {" "}
            Created At{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </div>
        </div>
        <div className="text-2xl text-center mb-1 mt-1">
          {post?.title ?? cachedPost.title}
        </div>
        <hr className="content-center w-full"></hr>
        <Test content={post?.content ?? cachedPost.content}></Test>
        <Suspense
          fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}
        >
          {/* @ts-expect-error Server Component */}
          <CommentsSection postId={post?.id ?? cachedPost.id} />
        </Suspense>
      </div>
    </div>
  );
};

function fallBackVote() {
  return (
    <div className="flex flex-col gap-4">
      <ArrowBigUp />
      <Loader2 className="animate-spin" />
      <ArrowBigDown />
    </div>
  );
}

export default Page;

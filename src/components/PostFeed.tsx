"use client";
import { FC, useEffect, useRef, useState } from "react";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLER_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "@/components/Post";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  initialPost: ExtendedPost[];
  subridderName?: string;
}

const PostFeed: FC<PostFeedProps> = ({
  initialPost,
  subridderName,
}: PostFeedProps) => {
  const lastRootRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastRootRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();
  const [mount, setMount] = useState<boolean>(false);
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLER_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subridderName ? `&subredditName=${subridderName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },

    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPost], pageParams: [1] },
    }
  );
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);
  useEffect(() => {
    setMount(true);
  }, []);

  const posts = data?.pages.flatMap((page) => page) ?? initialPost;
  if (!mount) return null;
  return (
    <>
      {posts.map((post, index) => {
        const voteCount =
          post.vote &&
          post.vote.reduce((acc, currentValue) => {
            if (currentValue.type === "UP") {
              return acc + 1;
            }
            if (currentValue.type === "DOWN") {
              return acc - 1;
            }
            return acc;
          }, 0);
        const didVote =
          post.vote && post.vote.find((v) => v.userId === session?.user.id);
        if (index === posts.length - 1) {
          return (
            <div key={post.id} ref={ref}>
              <Post
                voteNumber={voteCount}
                commentNumber={post.comments.length}
                didVote={didVote}
                post={post}
                subredditName={post.subreddit.name}
              />
            </div>
          );
        } else {
          return (
            <div key={post.id}>
              <Post
                voteNumber={voteCount}
                commentNumber={post.comments.length}
                didVote={didVote}
                post={post}
                subredditName={post.subreddit.name}
              />
            </div>
          );
        }
      })}
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      )}
    </>
  );
};
export default PostFeed;

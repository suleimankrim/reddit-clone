import { FC } from "react";
import { Post, Subreddit, User, Vote } from ".prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import PostVote from "@/components/post-vote/PostVote";
import Test from "@/components/ui/Test";
import Link from "next/link";

type voteType = Pick<Vote, "type">;

interface PostProps {
  post: Post & {
    vote: Vote[];
    author: User;
    subreddit: Subreddit;
  };
  subredditName: string;
  voteNumber: number;
  commentNumber: number;
  didVote?: voteType;
}

const Post: FC<PostProps> = ({
  post,
  subredditName,
  voteNumber,
  didVote,
  commentNumber,
}: PostProps) => {
  return (
    <div className="flex mt-3 max-w-xl">
      <PostVote postId={post.id} initialVote={voteNumber} didVote={didVote} />
      <div className="bg-white rounded-lg w-full shadow-lg border p-2">
        <div className="flex w-full h-fit">
          <div className="">
            <div className="flex p-2 justify-center">
              {subredditName ? (
                <>
                  {" "}
                  <a
                    className="underline underline-offset-2 text-zinc-900"
                    href={`/r/${subredditName}`}
                  >
                    <div className="text-sm">r/{subredditName}</div>
                  </a>
                  <span className="text-sm mr-1">.</span>{" "}
                </>
              ) : null}

              {"    "}
              <span className="text-sm mr-1">
                Created By {post.author.username}
                {"  "}
              </span>
              <span className="text-sm">
                Form
                {"  " + formatTimeToNow(new Date(post.createdAt))}
              </span>
            </div>
            <hr></hr>
            {subredditName ? (
              <div className="p-2">
                <a href={`/r/${subredditName}/post/${post.id}`}>
                  <div className="text-2xl font-bold">{post.title}</div>
                </a>
              </div>
            ) : null}
            <div className="max-h-40 overflow-clip relative mt-2">
              <Test content={post.content}></Test>
            </div>
          </div>
        </div>

        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex items-center bg-gray-100 p-2 mt-1"
        >
          <MessageSquare className="h-5 w-5 mr-1" />
          {commentNumber?.toString()}
          <div className="ml-1 text-sm"> comment</div>
        </Link>
      </div>
    </div>
  );
};
export default Post;

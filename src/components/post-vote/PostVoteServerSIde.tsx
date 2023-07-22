import { Post, Vote, VoteType } from ".prisma/client";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import PostVote from "@/components/post-vote/PostVote";

interface PostVoteServerSIdeProps {
  postId: string;
  initialVotAmount?: number;
  initialVoteStatus?: VoteType | null;
  getData?: () => Promise<(Post & { vote: Vote[] }) | null>;
}

const PostVoteServerSIde = async ({
  initialVoteStatus,
  postId,
  initialVotAmount,
  getData,
}: PostVoteServerSIdeProps) => {
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  let _initialVoteStatus: VoteType | null | undefined = undefined;
  let _initialVotAmount: number = 0;
  let post: (Post & { vote: Vote[] }) | null = null;
  if (getData) {
    await wait(1000);
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        vote: true,
      },
    });
    if (!post) return notFound();
    const session = await getServerSession();
    _initialVotAmount = post.vote.reduce((acc, currentValue) => {
      if (currentValue.type === "UP") return acc + 1;
      if (currentValue.type === "DOWN") return acc - 1;
      return acc;
    }, 0);
    _initialVoteStatus = post.vote.find(
      (v) => v.userId === session?.user.id
    )?.type;
  } else {
    _initialVotAmount = initialVotAmount ?? 0;
    _initialVoteStatus = initialVoteStatus;
  }
  return (
    <>
      <PostVote
        postId={postId}
        didVote={_initialVoteStatus ? { type: _initialVoteStatus } : undefined}
        initialVote={_initialVotAmount}
      ></PostVote>
    </>
  );
};
export default PostVoteServerSIde;

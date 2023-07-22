import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostComment from "@/components/PostComment";
import CreateComment from "@/components/CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();
  const comment = await db.comment.findMany({
    where: {
      postId,
      replyTo: null,
    },
    include: {
      commentVote: true,
      author: true,
      replies: {
        include: {
          author: true,
          commentVote: true,
        },
      },
    },
  });
  return (
    <div className="w-full h-full flex flex-col">
      <CreateComment postId={postId} />
      <div className="w-full">
        {comment
          .filter((com) => !com.replyToId)
          .map((value) => {
            const topLevelCommentVotesAmt = value.commentVote.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVote = value.commentVote.find(
              (vote) => vote.userId === session?.user.id
            );
            return (
              <>
                {" "}
                <PostComment
                  key={postId}
                  postId={postId}
                  commentAmount={topLevelCommentVotesAmt ?? 0}
                  currentVote={topLevelCommentVote}
                  comment={value}
                ></PostComment>
                <div className=" border-l-4  ml-20">
                  {value.replies
                    .sort((a, b) => b.commentVote.length - a.commentVote.length)
                    .map((replay) => {
                      const replayVoteAmount = replay.commentVote.reduce(
                        (acc, vote) => {
                          if (vote.type === "UP") return acc + 1;
                          if (vote.type === "DOWN") return acc - 1;
                          return acc;
                        },
                        0
                      );

                      const replayVote = replay.commentVote.find(
                        (vote) => vote.userId === session?.user.id
                      );
                      return (
                        <>
                          {" "}
                          <PostComment
                            key={postId}
                            postId={postId}
                            commentAmount={replayVoteAmount ?? 0}
                            currentVote={replayVote}
                            comment={replay}
                          ></PostComment>
                        </>
                      );
                    })}
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};
export default CommentsSection;

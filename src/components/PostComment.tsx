"use client";
import { FC, useRef } from "react";
import { Comment, CommentVote, User } from ".prisma/client";
import CommentUI from "@/components/ui/CommentUI";

type ExtendedComment = Comment & {
  commentVote: CommentVote[];
  author: User;
};

interface PostCommentProps {
  postId: string;
  commentAmount: number;
  currentVote: CommentVote | undefined;
  comment: ExtendedComment;
}

const PostComment: FC<PostCommentProps> = ({
  commentAmount,
  postId,
  comment,
  currentVote,
}: PostCommentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      <CommentUI
        text={comment.text}
        author={comment.author}
        postId={postId}
        replayTo={comment.replyToId ?? comment.id}
        commentId={comment.id}
        commentAmount={commentAmount}
        currentVote={currentVote?.type}
      />
    </div>
  );
};
export default PostComment;

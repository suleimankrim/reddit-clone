"use client";
import { FC, useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import { User, VoteType } from ".prisma/client";
import CommentVote from "@/components/CommentVote";
import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CommentType } from "@/types/CommentValidation";
import axios from "axios";

interface CommentUiProps {
  author: User;
  text: string;
  commentId: string;
  commentAmount: number;
  currentVote?: VoteType;
  postId: string;
  replayTo?: string;
}

const CommentUi: FC<CommentUiProps> = ({
  author,
  text,
  commentId,
  commentAmount,
  currentVote,
  postId,
  replayTo,
}: CommentUiProps) => {
  const router = useRouter();
  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: async ({ replayTo, text, postId }: CommentType) => {
      const payload: CommentType = {
        replayTo,
        text,
        postId,
      };
      const { data } = await axios.patch(
        "/api/subridder/post/comment",
        payload
      );
    },
    onSuccess: () => {
      router.refresh();
    },
  });
  const { data: session } = useSession();
  const [input, setInput] = useState<string>();
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  return (
    <>
      <div className="bg-white dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-200 p-4 antialiased flex max-w-lg">
          <UserAvatar
            className="rounded-full h-8 w-8 mr-2 mt-1 relative"
            user={author}
          />
          <div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 pt-2 pb-2.5">
              <div className="font-semibold text-sm leading-relaxed">
                {author.id}
              </div>
              <div className="text-normal leading-snug md:leading-normal">
                {text}
              </div>
              <div className="flex">
                <CommentVote
                  initialVote={commentAmount}
                  didVote={currentVote ? { type: currentVote } : undefined}
                  commentId={commentId}
                  key={commentId}
                />
                <Button
                  variant={"ghost"}
                  onClick={() => setIsReplaying((prevState) => !prevState)}
                  className="-ml-3 mt-1"
                >
                  <MessageSquare className="mr-2" /> Replay
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isReplaying ? (
          <div className="mt-2">
            <Label htmlFor="comment">Your Comment</Label>
            <div>
              <Textarea
                autoFocus={true}
                id="comment"
                rows={1}
                placeholder="What are you thinging"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div>
              <Button
                variant={"default"}
                disabled={input?.length === 0}
                isLoading={isLoading}
                onClick={() => {
                  if (input) {
                    sendMessage({
                      postId,
                      text: input,
                      replayTo,
                    });
                  }
                }}
              >
                Post
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
export default CommentUi;

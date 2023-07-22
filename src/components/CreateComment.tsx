"use client";
import { FC, startTransition, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CommentType } from "@/types/CommentValidation";
import { toast } from "@/hooks";
import { useRouter } from "next/navigation";
import { useLoginToast } from "@/hooks/useLoginToast";
import { Button } from "@/components/ui/Button";

interface CreateCommentProps {
  postId: string;
  replyId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({
  replyId,
  postId,
}: CreateCommentProps) => {
  const [input, setInput] = useState<string>();
  const route = useRouter();
  const { loginToast } = useLoginToast();
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
      startTransition(() => {
        setInput("");
        route.refresh();
      });
      return toast({
        title: "subscribed",
        description: `You Are now subscribed to `,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) return loginToast();
        if (error.response?.status === 409) {
          return toast({
            title: "you already subscribe",
            description: "",
            variant: "destructive",
          });
        }

        return toast({
          title: "there is an error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });
  return (
    <div className="mt-2">
      <Label htmlFor="comment">Your Comment</Label>
      <div>
        <Textarea
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
                replayTo: replyId,
              });
            }
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
};
export default CreateComment;

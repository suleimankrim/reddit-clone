"use client";
import { FC } from "react";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModal: FC = () => {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      className="h-7 p-0 w-7 rounded-full"
      onClick={() => {
        router.back();
      }}
    >
      <X className="w-4 h-4" />
    </Button>
  );
};
export default CloseModal;

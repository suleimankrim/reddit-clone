import { FC } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import SignIn from "./SignIn";
import { ChevronLeft } from "lucide-react";

const page: FC = () => {
  return (
    <div className="absolute flex flex-col justify-center items-center inset-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "self-start -mt-20 z-10"
        )}
      >
        <ChevronLeft className="mr-2 w-4 h-4" />
        Home
      </Link>
      <div className="w-[600] h-[400]">
        <SignIn />
      </div>
    </div>
  );
};
export default page;

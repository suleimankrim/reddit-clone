import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import Menu from "@/components/Menu";
import redditIcon from "@/asset/reddit.svg";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div
      className="h-14 w-full
        border-b bg-zinc-100 z-10 border-zinc-300 inset-x-0 top-0 px-4 fixed flex items-center justify-between "
    >
      <Link href="/" className="flex items-center ">
        <Image src={redditIcon} alt={"logo"} className="w-24 h-24 mr-1" />
      </Link>
      <SearchBar />
      {session ? (
        <Menu user={session.user}></Menu>
      ) : (
        <Link href="sign-in" className={buttonVariants({ variant: "default" })}>
          Sign In
        </Link>
      )}
    </div>
  );
};
export default Navbar;

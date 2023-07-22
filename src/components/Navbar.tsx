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
      className="h-14 w-full max-w-9xl
        border-b bg-zinc-100 z-10 border-zinc-300 inset-x-0 top-0 fixed flex  items-center "
    >
      <div className="relative flex justify-between w-full items-center px-3">
        <Link href="/" className="flex items-center ">
          <Image src={redditIcon} alt={"logo"} className="w-24 h-24 mr-1" />
        </Link>
        <div className="w-full flex justify-center">
          <SearchBar />
        </div>
        <div>
          {session ? (
            <div className="flex justify-end w-full h-full items-center">
              <Menu user={session.user}></Menu>
            </div>
          ) : (
            <Link href="sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;

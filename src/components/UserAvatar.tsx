import { FC, HTMLAttributes } from "react";
import { User } from "next-auth";
import Image from "next/image";
import { Icons } from "@/components/Icons";

interface UserAvatarProps extends HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...prop }) => {
  return (
    <div {...prop}>
      {user.image ? (
        <Image
          alt="userPicture"
          src={user.image}
          fill={true}
          className="absolute rounded-full h-6 w-6"
        />
      ) : (
        <Icons.user />
      )}
    </div>
  );
};
export default UserAvatar;

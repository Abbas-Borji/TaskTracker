
interface UserAvatarProps {
  userImage: string | null | undefined;
  userName: string | null | undefined;
}

const UserAvatar = ({ userImage, userName }: UserAvatarProps) => {
  return (
    <>
      {userImage ? (
        <img
          src={userImage}
          className="h-8 w-8 rounded-full bg-gray-50"
          alt={"User Profile Image"}
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dark font-medium text-light">
          {userName?.charAt(0) || "U"}
        </div>
      )}
    </>
  );
};

export default UserAvatar;

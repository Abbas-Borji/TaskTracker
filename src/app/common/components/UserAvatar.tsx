const UserAvatar = ({ session }: any) => {
  const userImage = session?.user?.image;
  const userName = session?.user?.name;

  return (
    <>
      {userImage ? (
        <img
          src={userImage}
          className="h-8 w-8 rounded-full bg-gray-50"
          alt={userName}
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-50">
          {userName?.charAt(0)}
        </div>
      )}
    </>
  );
};

export default UserAvatar;

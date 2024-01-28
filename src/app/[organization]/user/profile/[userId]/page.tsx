import React from "react";
import Profile from "@/app/common/components/Profile";

const UserProfile = ({ params }: { params: { userId: string } }) => {
  const userId = params.userId ? params.userId : null;
  return <Profile userId={userId} />;
};

export default UserProfile;

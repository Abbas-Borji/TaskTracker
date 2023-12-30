import React from "react";
import Submission from "@/app/common/components/Submission";
import AllowOnlyUser from "@/app/common/functions/ClientAllowOnlyUser";

const UserViewSubmissionPage = ({
  params,
}: {
  params: { submissionId: string };
}) => {
  const submissionId = Number(params.submissionId);
  if (!submissionId) return <div>Invalid submission id!</div>;
  return (
    <>
      <AllowOnlyUser />
      <Submission submissionId={submissionId} />
    </>
  );
};

export default UserViewSubmissionPage;

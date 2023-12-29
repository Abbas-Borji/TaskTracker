import React from "react";
import Submission from "@/app/common/components/Submission";

const UserViewSubmissionPage = ({
  params,
}: {
  params: { submissionId: string };
}) => {
  const submissionId = Number(params.submissionId);
  if (!submissionId) return <div>Invalid submission id!</div>;
  return <Submission submissionId={submissionId} />;
};

export default UserViewSubmissionPage;

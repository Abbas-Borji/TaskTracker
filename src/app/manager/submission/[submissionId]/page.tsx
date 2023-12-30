import React from "react";
import Submission from "@/app/common/components/Submission";
import AllowOnlyManager from "@/app/common/functions/ClientAllowOnlyManager";

const ManagerViewSubmissionPage = ({
  params,
}: {
  params: { submissionId: string };
}) => {
  const submissionId = Number(params.submissionId);
  if (!submissionId) return <div>Invalid submission id!</div>;
  return (
    <>
      <AllowOnlyManager />
      <Submission submissionId={submissionId} />
    </>
  );
};

export default ManagerViewSubmissionPage;

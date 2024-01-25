import React from "react";
import Submission from "@/app/common/components/Submission";
import AllowOnlyAdmin from "@/app/common/functions/ClientAllowOnlyAdmin";

const AdminViewSubmissionPage = ({
  params,
}: {
  params: { submissionId: string };
}) => {
  const submissionId = Number(params.submissionId);
  if (!submissionId) return <div>Invalid submission id!</div>;
  return (
    <>
      <AllowOnlyAdmin />
      <Submission submissionId={submissionId} />
    </>
  );
};

export default AdminViewSubmissionPage;

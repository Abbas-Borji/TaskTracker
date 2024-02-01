import React from "react";
import { Invitation } from "@/app/common/types/Invitation";

interface InvitationCardProps {
  invitation: Invitation;
  handleClick: (invitationId: number) => void;
}

const InvitationCard = ({ invitation, handleClick }: InvitationCardProps) => {
  return (
    <>
      <div
        key={invitation.id}
        className="relative mb-4 rounded-lg bg-light p-4 shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-medium text-gray-600">
            {invitation.organization.name}
          </div>
          <button
            className={
              "h-8 w-16 rounded bg-primary px-2 py-1 text-sm font-medium text-light"
            }
            onClick={() => handleClick(invitation.id)}
          >
            {" "}
            Join
          </button>
        </div>
      </div>
    </>
  );
};

export default InvitationCard;

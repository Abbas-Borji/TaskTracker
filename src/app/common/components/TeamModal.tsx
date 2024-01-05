"use client";
import Loading from "@/app/loading";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import TextField from "@mui/material/TextField";
import React, { Fragment, useEffect, useState } from "react";
import Badge from "./Badge";
import ComboBox from "./ComboBox";
import Notification from "./Notification";

interface EmployeesResponse {
  employees: ComboBoxItem[];
  managers: ComboBoxItem[];
}

interface TeamData {
  name: string;
  manager: ComboBoxItem;
  members: ComboBoxItem[];
}

export interface ComboBoxItem {
  id: number | string;
  name: string;
}

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  teamId?: number;
}

const TeamModal = ({ open, onClose, teamId }: TeamModalProps) => {
  const [employees, setEmployees] = useState<ComboBoxItem[]>([]);
  const [managers, setManagers] = useState<ComboBoxItem[]>([]);
  const [teamName, setTeamName] = useState("");
  const [selectedManager, setSelectedManager] = useState<ComboBoxItem | null>(
    null,
  );
  const [selectedMembers, setSelectedMembers] = useState<ComboBoxItem[]>([]);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
  const isTeamProvided = teamId ? true : false;

  useEffect(() => {
    // Fetch all employees
    const fetchEmployees = async () => {
      setIsEmployeeLoading(true);
      try {
        const response = await fetch("/api/employees/get");
        const data: EmployeesResponse = await response.json();
        setEmployees(data.employees);
        setManagers(data.managers);
        setIsEmployeeLoading(false);
      } catch (error: any) {
        setServerError(error.message);
        setIsNotificationVisible(true);
        setTimeout(() => {
          setIsNotificationVisible(false);
          setServerError("");
        }, 1000);
        setIsEmployeeLoading(false);
      }
    };
    if (!isTeamProvided) {
      fetchEmployees();
    }
  }, []);

  useEffect(() => {
    // Fetch team details if teamId is provided
    const fetchTeamDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/team/get/${teamId}`);
        const data: TeamData = await response.json();
        setTeamName(data.name);
        setSelectedManager(data.manager);
        setSelectedMembers(data.members);
        setIsLoading(false);
      } catch (error: any) {
        setServerError(error.message);
        setIsNotificationVisible(true);
        setTimeout(() => {
          setIsNotificationVisible(false);
          setServerError("");
        }, 1000);
        setIsLoading(false);
      }
    };
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  // Handle manager selection
  const handleSelectManager = (item: ComboBoxItem) => {
    setSelectedManager(item);
  };

  // Handle member selection
  const handleSelectMember = (item: ComboBoxItem) => {
    setSelectedMembers([...selectedMembers, item]);
  };

  // Handle removing a member from selection
  const handleRemoveMember = (member: ComboBoxItem) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
  };

  // Handle team creation
  const handleCreate = async () => {
    setIsLoading(true);
    if (teamName === "" || !selectedManager || selectedMembers.length === 0) {
      setServerError("Please type a name and select the manager and members.");
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
        setServerError("");
      }, 1000);
      setIsLoading(false);
      return;
    }

    const teamData: TeamData = {
      name: teamName,
      manager: selectedManager!,
      members: selectedMembers,
    };

    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message);
        setIsNotificationVisible(true);
        setTimeout(() => {
          setIsNotificationVisible(false);
          setServerError("");
        }, 1000);
        setIsLoading(false);
        throw new Error(data.message || "Failed to create team.");
      }

      // Handle success
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 1000);
      setIsLoading(false);
      onClose();
    } catch (error: any) {
      setServerError(error.message);
      setIsNotificationVisible(true);
      setIsLoading(false);
    }
  };

  // Handle team update
  const handleUpdate = async () => {
    setIsLoading(true);

    if (
      !isTeamProvided ||
      teamName === "" ||
      !selectedManager ||
      selectedMembers.length === 0
    ) {
      setServerError("Please type a name and select the manager and members.");
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
        setServerError("");
      }, 1000);
      setIsLoading(false);
      return;
    }

    const teamData: TeamData = {
      name: teamName,
      manager: selectedManager!,
      members: selectedMembers,
    };

    try {
      console.log(teamId);
      const response = await fetch("/api/team/update/" + teamId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message);
        setIsNotificationVisible(true);
        setTimeout(() => {
          setIsNotificationVisible(false);
          setServerError("");
        }, 1000);
        setIsLoading(false);
        throw new Error(data.message || "Failed to update team.");
      }

      // Handle success
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 1000);
      setIsLoading(false);
      onClose();
    } catch (error: any) {
      setServerError(error.message);
      setIsNotificationVisible(true);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Call the original onClose prop to close the modal
    onClose();
    // Resetting all the state variables to their initial states
    setTimeout(() => {
      setTeamName("");
      setSelectedManager(null);
      setSelectedMembers([]);
      setServerError("");
      setIsNotificationVisible(false);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {isNotificationVisible ? (
        serverError ? (
          <Notification
            title={serverError}
            body={"There was an error loading this modal."}
            icon={<ExclamationTriangleIcon className="text-red-600" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        ) : (
          <Notification
            title={isTeamProvided ? "Team Updated" : "Team Created"}
            body={
              isTeamProvided
                ? "You have successfully updated the team."
                : "You have successfully created a team."
            }
            icon={<CheckCircleIcon className="text-green-400" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        )
      ) : null}
      {isLoading ? (
        <Loading />
      ) : (
        <Transition.Root show={open} as={React.Fragment}>
          <Dialog as="div" className="relative z-[50]" onClose={handleClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative w-full overflow-y-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:p-6">
                    <Dialog.Title className="mb-6 p-2 text-center text-3xl leading-6 text-gray-900">
                      <span className="font-medium">
                        {isTeamProvided ? "Update Team" : "Create Team"}
                      </span>
                    </Dialog.Title>

                    <div className="block text-sm font-medium leading-6 text-gray-900">
                      Team Name
                    </div>
                    <div className="relative mb-6 mt-2">
                      <TextField
                        fullWidth={true}
                        placeholder="Enter team name"
                        required={true}
                        autoFocus={false}
                        variant="outlined"
                        defaultValue={""}
                        value={teamName}
                        size="small"
                        onChange={(e) => setTeamName(e.target.value)}
                      />
                    </div>

                    <ComboBox
                      items={managers}
                      label="Select Manager"
                      placeholder="Choose a manager"
                      onChange={handleSelectManager}
                      value={selectedManager}
                      loading={isEmployeeLoading}
                    />

                    <ComboBox
                      items={employees}
                      label="Select Members"
                      placeholder="Choose the members"
                      onChange={handleSelectMember}
                      loading={isEmployeeLoading}
                    />
                    <div>
                      {selectedMembers.map((member) => (
                        <Badge
                          key={member.id}
                          label={member.name}
                          onRemove={() => handleRemoveMember(member)}
                        />
                      ))}
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark sm:ml-3 sm:w-auto"
                        onClick={isTeamProvided ? handleUpdate : handleCreate}
                      >
                        {isTeamProvided ? "Update" : "Create"}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
};

export default TeamModal;

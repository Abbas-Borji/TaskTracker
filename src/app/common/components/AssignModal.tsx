import ExpectedResponse from "@/app/common/types/AssignmentTeamsEmployees";
import Loading from "@/app/loading";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Datepicker } from "flowbite-react";
import React, { Fragment, useEffect, useState } from "react";
import Badge from "./Badge";
import ComboBox from "./ComboBox";
import Notification from "./Notification";

interface AssignmentData {
  checklistId: number;
  teamId: number;
  employeeIds: string[];
  dueDate: Date;
}

interface ComboBoxItem {
  id: number | string;
  name: string;
}

interface AssignmentModalProps {
  open: boolean; // Indicates whether the modal is open
  onClose: () => void; // Function to call when closing the modal
  checklistId: number; // The ID of the checklist being assigned
}

const AssignmentModal = ({
  open,
  onClose,
  checklistId,
}: AssignmentModalProps) => {
  const [checklistName, setChecklistName] = useState("");
  const [teams, setTeams] = useState<ComboBoxItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<ComboBoxItem | null>(null);
  const [hasTeam, setHasTeam] = useState(false);
  const [employees, setEmployees] = useState<ComboBoxItem[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<ComboBoxItem[]>(
    [],
  );
  const [dueDate, setDueDate] = useState(new Date());
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/assignment/get/${checklistId}`);
        const data: ExpectedResponse = await response.json();
        setChecklistName(data.checklistName);
        setHasTeam(data.hasTeam);

        // Set teams if the checklist does not have a team
        if (!data.hasTeam) {
          setTeams(data.restructuredTeams);
        } else {
          // If the checklist has a team, set the selected team and fetch its members
          setSelectedTeam(data.team);
          setEmployees(data.restructuredEmployees);
        }

        if (!response.ok) {
          setServerError(data.message!);
          setIsNotificationVisible(true);
          setTimeout(() => {
            setIsNotificationVisible(false);
            setServerError("");
          }, 1000);
        }
        setIsLoading(false);
      } catch (error: any) {
        setServerError(error.message);
        setIsNotificationVisible(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [open, checklistId]);

  // Handle team selection
  const handleTeamSelect = (team: ComboBoxItem) => {
    setSelectedTeam(team);
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/assignment/get/members/${team.id}`);
        const data = await response.json();
        setEmployees(data);
        if (!response.ok) {
          setServerError(data.message);
          setIsNotificationVisible(true);
          setTimeout(() => {
            setIsNotificationVisible(false);
            setServerError("");
          }, 1000);
        }
        setIsLoading(false);
      } catch (error: any) {
        setServerError(error.message);
        setIsNotificationVisible(true);
        setIsLoading(false);
      }
    };
    fetchEmployees();
  };

  // Handle employee selection
  const handleEmployeeSelect = (employee: ComboBoxItem) => {
    setSelectedEmployees([...selectedEmployees, employee]);
  };

  // Handle removing an employee from selection
  const handleRemoveEmployee = (employee: ComboBoxItem) => {
    setSelectedEmployees(
      selectedEmployees.filter((emp) => emp.id !== employee.id),
    );
  };

  // Handle assignment
  const handleAssign = async () => {
    if (!selectedTeam || selectedEmployees.length === 0) {
      setServerError("Please select a team and at least one employee.");
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
        setServerError("");
      }, 1000);
      return;
    }

    const assignmentData: AssignmentData = {
      checklistId,
      teamId: +selectedTeam.id, // Assuming selectedTeam.id is always a number
      employeeIds: selectedEmployees.map((emp) => emp.id.toString()), // Convert to string
      dueDate: new Date(dueDate),
    };

    try {
      const response = await fetch("/api/assignment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message);
        setIsNotificationVisible(true);
        setTimeout(() => {
          setIsNotificationVisible(false);
          setServerError("");
        }, 1000);
        throw new Error(data.message || "Failed to create assignments");
      }

      // Handle success
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 1000);
      onClose(); // You might want to show a success message before closing
    } catch (error: any) {
      setServerError(error.message);
      setIsNotificationVisible(true);
    }
  };

  // Handle Datepicker change
  const handleDateChange = (newDate: Date) => {
    setDueDate(newDate);
  };

  const handleClose = () => {
    // Resetting all the state variables to their initial states
    setChecklistName("");
    setTeams([]);
    setSelectedTeam(null);
    setEmployees([]);
    setSelectedEmployees([]);
    setDueDate(new Date());
    setServerError("");
    setIsNotificationVisible(false);
    setIsLoading(false);

    // Call the original onClose prop to close the modal
    onClose();
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
            title="Assignment Created"
            body={"You have successfully created an assignment."}
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
                    <Dialog.Title className="mb-6 text-lg font-medium leading-6 text-gray-900">
                      <span className="font-bold">Assign:&nbsp;&nbsp;</span>{" "}
                      {checklistName}
                    </Dialog.Title>
                    <div className="block text-sm font-medium leading-6 text-gray-900">
                      Specify a Deadline
                    </div>
                    <div className="relative mb-6 mt-2">
                      <Datepicker
                        defaultDate={dueDate}
                        onSelectedDateChanged={handleDateChange}
                        // Additional configurations
                      />
                    </div>

                    <ComboBox
                      items={teams}
                      label="Select Team"
                      placeholder="Choose a team"
                      onChange={handleTeamSelect}
                      value={selectedTeam}
                      disabled={selectedTeam !== null} // Disable if a team is already selected
                    />

                    <ComboBox
                      items={employees}
                      label="Select Employee"
                      placeholder="Choose an employee"
                      onChange={handleEmployeeSelect}
                    />
                    <div>
                      {selectedEmployees.map((emp) => (
                        <Badge
                          key={emp.id}
                          label={emp.name}
                          onRemove={() => handleRemoveEmployee(emp)}
                        />
                      ))}
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleAssign}
                      >
                        Assign
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

export default AssignmentModal;

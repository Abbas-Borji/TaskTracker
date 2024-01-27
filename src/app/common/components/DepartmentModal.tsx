"use client";
import { Dialog, Transition } from "@headlessui/react";
import TextField from "@mui/material/TextField";
import React, { Fragment } from "react";
import Badge from "./Badge";
import ComboBox from "./ComboBox";
import { ComboBoxItem } from "@/app/[organization]/admin/departments/page";
import CircularProgress from "@mui/material/CircularProgress";

interface DepartmentModalProps {
  open: boolean;
  handleClose: () => void;
  handleCreate: () => void;
  handleUpdate: () => void;
  departmentName: string;
  setDepartmentName: React.Dispatch<React.SetStateAction<string>>;
  employees: ComboBoxItem[];
  selectedMembers: ComboBoxItem[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<ComboBoxItem[]>>;
  isEmployeeLoading: boolean;
  isDepartmentProvided: boolean;
}

const DepartmentModal = ({
  open,
  handleClose,
  handleCreate,
  handleUpdate,
  departmentName,
  setDepartmentName,
  employees,
  selectedMembers,
  setSelectedMembers,
  isEmployeeLoading,
  isDepartmentProvided,
}: DepartmentModalProps) => {
  // Handle member selection
  const handleSelectMember = (item: ComboBoxItem) => {
    setSelectedMembers([...selectedMembers, item]);
  };

  // Handle removing a member from selection
  const handleRemoveMember = (member: ComboBoxItem) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
  };

  return (
    <>
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
                      {isDepartmentProvided
                        ? "Update Department"
                        : "Create Department"}
                    </span>
                  </Dialog.Title>

                  <div className="block text-sm font-medium leading-6 text-gray-900">
                    Department Name
                  </div>
                  <div className="relative mb-6 mt-2">
                    <TextField
                      fullWidth={true}
                      placeholder="Enter department name"
                      required={true}
                      autoFocus={false}
                      variant="outlined"
                      defaultValue={""}
                      value={departmentName}
                      size="small"
                      onChange={(e) => setDepartmentName(e.target.value)}
                    />
                    {isEmployeeLoading && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <CircularProgress size={24} />
                      </div>
                    )}
                  </div>

                  <ComboBox
                    items={employees}
                    label="Select Members"
                    placeholder="Choose the members"
                    onChange={handleSelectMember}
                    loading={isEmployeeLoading}
                  />
                  <div>
                    {selectedMembers?.map((member) => (
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
                      onClick={
                        isDepartmentProvided ? handleUpdate : handleCreate
                      }
                    >
                      {isDepartmentProvided ? "Update" : "Create"}
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
    </>
  );
};

export default DepartmentModal;

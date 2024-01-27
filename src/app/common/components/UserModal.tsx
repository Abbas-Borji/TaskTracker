"use client";
import { Dialog, Transition } from "@headlessui/react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, { Fragment } from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface Department {
  id: number;
  name: string;
}

interface ProfileData {
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "MANAGER";
  Department: Department | null;
}

interface UserModalProps {
  open: boolean;
  departments: Department[];
  userData: ProfileData;
  setUserData: React.Dispatch<React.SetStateAction<ProfileData>>;
  handleUpdate: () => void;
  handleClose: () => void;
  isUserModalLoading: boolean;
}

const UserModal = ({
  open,
  handleClose,
  handleUpdate,
  departments,
  userData,
  setUserData,
  isUserModalLoading,
}: UserModalProps) => {

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value || "", // Providing a default empty string
    }));
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setUserData((prevState) => ({
      ...prevState,
      role: event.target.value as "ADMIN" | "USER" | "MANAGER",
    }));
  };

  const handleDepartmentChange = (event: SelectChangeEvent<number>) => {
    const selectedDepartment = departments.find(
      (dept) => dept.id === (event.target.value as number),
    );
    setUserData((prevState) => ({
      ...prevState,
      Department: selectedDepartment || null,
    }));
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
                    Update User
                  </Dialog.Title>
                  
                  {/* Name Field */}
                  <TextField
                    label="Name"
                    size="small"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    name="name"
                    value={userData?.name}
                    onChange={handleTextFieldChange}
                    InputProps={{
                      endAdornment: isUserModalLoading && (
                        <CircularProgress size={20} />
                      ),
                    }}
                  />

                  {/* Email Field */}
                  <TextField
                    label="Email"
                    size="small"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    name="email"
                    value={userData?.email}
                    onChange={handleTextFieldChange}
                    InputProps={{
                      endAdornment: isUserModalLoading && (
                        <CircularProgress size={20} />
                      ),
                    }}
                  />

                  {/* Role Select */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      size="small"
                      name="role"
                      value={userData?.role || ""} // Use updatedUserData for the value
                      onChange={handleRoleChange} // Add the onChange handler
                    >
                      <MenuItem value="ADMIN">Admin</MenuItem>
                      <MenuItem value="USER">User</MenuItem>
                      <MenuItem value="MANAGER">Manager</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Department Select */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Department</InputLabel>
                    <Select
                      label="Department"
                      size="small"
                      name="department"
                      value={userData?.Department?.id || ""}
                      onChange={handleDepartmentChange}
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.id} value={department.id}>
                          {department.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Action Buttons */}
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark sm:ml-3 sm:w-auto"
                      onClick={handleUpdate}
                    >
                      Update
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

export default UserModal;

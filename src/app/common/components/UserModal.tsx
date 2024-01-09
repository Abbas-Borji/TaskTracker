"use client";
import Loading from "@/app/loading";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, { Fragment, useEffect, useState } from "react";
import Notification from "./Notification";

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
  onClose: () => void;
  userId?: string;
}

const UserModal = ({ open, onClose, userId }: UserModalProps) => {
  // Initial state for updatedUserData
  const emptyUserData: ProfileData = {
    name: "",
    email: "",
    role: "USER",
    Department: null,
  };

  // Initial data for the user
  const [userData, setUserData] = useState<ProfileData>(emptyUserData);
  // List of departments
  const [departments, setDepartments] = useState<Department[]>([]);

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user details if userId is provided
  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/users/get/${userId}`);
        const data: ProfileData = await response.json();
        setUserData(data);
        console.log("Department Id: " + data.Department?.id);
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
    fetchUserDetails();
  }, [userId]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/admin/departments");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

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

  // Handle user data update
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
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
        throw new Error(data.message || "Failed to update user.");
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
      setTimeout(() => {
        setIsNotificationVisible(false);
        setServerError("");
      }, 1000);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Resetting all the state variables to their initial states
    setTimeout(() => {
      setUserData({
        name: "",
        email: "",
        role: "USER",
        Department: null,
      });
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
            title="Couldn't Update User"
            body={serverError}
            icon={<ExclamationTriangleIcon className="text-red-600" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        ) : (
          <Notification
            title="User Updated"
            body="The user was updated successfully!"
            icon={<CheckCircleIcon className="text-green-600" />}
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
                    <Dialog.Title className="mb-6 p-2 text-center text-3xl leading-6 text-gray-900"></Dialog.Title>

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
      )}
    </>
  );
};

export default UserModal;

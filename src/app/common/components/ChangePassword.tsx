"use client";
import { Dialog, Transition } from "@headlessui/react";
import TextField from "@mui/material/TextField";
import React, { Fragment } from "react";

interface Notification {
  isVisible: boolean;
  title: string;
  body: string;
  type: "success" | "error";
}

type SetNotification = React.Dispatch<React.SetStateAction<Notification>>;

interface ChangePasswordModalProps {
  open: boolean;
  handleUpdate: () => void;
  handleClose: () => void;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmNewPassword: string;
  setConfirmNewPassword: React.Dispatch<React.SetStateAction<string>>;
  notification: Notification;
  setNotification: SetNotification;
  showNotification: (
    title: string,
    body: string,
    type: "success" | "error",
  ) => void;
}

const ChangePasswordModal = ({
  open,
  handleClose,
  handleUpdate,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  notification,
  setNotification,
  showNotification,
}: ChangePasswordModalProps) => {
  // Check if the new password and confirm new password are the same
  const checkPassword = () => {
    if (newPassword !== confirmNewPassword) {
      showNotification(
        "Passwords do not match",
        "The two passwords must match.",
        "error",
      );
      return;
    }
    handleUpdate();
  };
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmNewPassword(e.target.value);
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
                    Change Password
                  </Dialog.Title>

                  {/* New Password Field */}
                  <TextField
                    label="New Password"
                    size="small"
                    fullWidth
                    type="password"
                    margin="normal"
                    variant="outlined"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />

                  {/* Confirm New Password Field */}
                  <TextField
                    label="Confirm New Password"
                    size="small"
                    fullWidth
                    type="password"
                    margin="normal"
                    variant="outlined"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                  />

                  {/* Action Buttons */}
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark sm:ml-3 sm:w-auto"
                      onClick={checkPassword}
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

export default ChangePasswordModal;

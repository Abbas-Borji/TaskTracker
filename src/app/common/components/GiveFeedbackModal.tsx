"use client";
import Loading from "@/app/loading";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import TextField from "@mui/material/TextField";
import React, { Fragment, useState } from "react";
import Notification from "./Notification";

interface FeedbackData {
  submissionId: number;
  feedbackContent: string;
}

interface GiveFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  submissionId: number;
  checklistName: string;
}

const GiveFeedbackModal = ({
  open,
  onClose,
  submissionId,
  checklistName,
}: GiveFeedbackModalProps) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Handle submission of feedback
  const handleSubmit = async () => {
    setIsLoading(true);
    if (feedback === "") {
      setServerError("You cannot submit an empty feedback.");
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
        setServerError("");
      }, 1000);
      setIsLoading(false);
      return;
    }

    const feedbackData: FeedbackData = {
      submissionId,
      feedbackContent: feedback,
    };

    try {
      const response = await fetch("/api/feedback/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
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
        throw new Error(data.message || "Failed to create feedback.");
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
    // Resetting all the state variables to their initial states
    setServerError("");
    setIsNotificationVisible(false);
    setIsLoading(false);
    setFeedback("");
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
            title="Feedback Created"
            body={"You have successfully gave feedback."}
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
                      <span className="font-bold">
                        Feedback for {checklistName}
                      </span>
                    </Dialog.Title>
                    <form onSubmit={handleSubmit}>
                      <div>
                        <TextField
                          multiline
                          rows={4}
                          fullWidth={true}
                          placeholder="Enter your feedback here"
                          required={true}
                          autoFocus={false}
                          variant="standard"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark sm:ml-3 sm:w-auto"
                          disabled={isLoading}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
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

export default GiveFeedbackModal;

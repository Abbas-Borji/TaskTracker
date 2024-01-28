"use client";
import Loading from "@/app/loading";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Notification from "./Notification";

interface Department {
  name: string;
}

interface InitialData {
  name: string;
  email: string;
  Department: Department;
}

interface ProfileEditableData {
  fullName: string;
}

interface ProfileProps {
  userId: string | null;
}

const Profile = ({ userId }: ProfileProps) => {
  const { data: session, status, update } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState<Department>();
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateSession = async () => {
    // After updating the name in database, update the session
    if (session) update({ name: fullName });
  };

  useEffect(() => {
    // Fetch initial data
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/profile/get/${userId}`);
        const data: InitialData = await response.json();
        setFullName(data.name);
        setEmail(data.email);
        setDepartment(data.Department);
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
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleUpdate = async () => {
    setIsLoading(true);
    // Form submission logic
    const profileData: ProfileEditableData = {
      fullName,
    };
    const response = await fetch(`/api/profile/update/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
    if (response.ok) {
      setIsNotificationVisible(true);
      updateSession();
      setTimeout(() => {
        setIsNotificationVisible(false);
        setServerError("");
      }, 1000);
      setIsLoading(false);
    } else {
      setServerError("Couldn't update profile.");
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
        setServerError("");
      }, 1000);
      setIsLoading(false);
    }
  };

  const handleNameEditToggle = () => {
    setIsEditingName(!isEditingName);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
          <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
            <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>

                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Full name
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      {isEditingName ? (
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 pl-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:leading-6"
                        />
                      ) : (
                        <div className="text-gray-900">{fullName}</div>
                      )}
                      <button
                        type="button"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                        onClick={handleNameEditToggle}
                      >
                        {isEditingName ? "Done" : "Edit"}
                      </button>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Email address
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">{email}</div>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Department
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">{department?.name}</div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <button
                className="mx-auto rounded bg-primary px-4 py-1 text-lg font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </main>
        </div>
      )}
      {isNotificationVisible ? (
        serverError ? (
          <Notification
            title={serverError}
            body={"There was an error."}
            icon={<ExclamationTriangleIcon className="text-red-600" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        ) : (
          <Notification
            title="Profile Updated"
            body={"You have successfully updated your profile."}
            icon={<CheckCircleIcon className="text-green-400" />}
            show={isNotificationVisible}
            setShow={setIsNotificationVisible}
          />
        )
      ) : null}
    </>
  );
};

export default Profile;

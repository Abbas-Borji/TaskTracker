'use client';
import React, { useState, useEffect } from "react";
import SixCardContainer from "@/app/common/components/SixCardContainer";
import CardSkeleton from "@/app/common/components/CardSkeleton";
import ManagerChecklistCard from "../team/[teamId]/components/ManagerChecklistCard";
import { ManagerChecklist } from "@/app/common/types/ManagerChecklist";

const MyChecklists = () => {
  const [checklists, setChecklists] = useState<ManagerChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    async function fetchChecklists() {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("/api/manager/checklists");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setChecklists(data.checklists);
        setIsLoading(false); // Stop loading after fetching data
      } catch (error) {
        console.error("Error fetching checklists:", error);
      } finally {
        setIsLoading(false); // Stop loading in case of an error
      }
    }
    fetchChecklists();
  }, []);

  const sixSkeletonCardsArray = Array.from({ length: 6 }, (_, index) => (
    <CardSkeleton key={index} />
  ));

  return (
    <div className="p-2">
      <h1 className="mb-5 text-4xl font-medium">| My Checklists</h1>
      <SixCardContainer
        title="Checklists"
        items={isLoading ? sixSkeletonCardsArray : checklists}
        renderItem={(item, index) =>
          isLoading ? (
            <CardSkeleton key={index} />
          ) : (
            <ManagerChecklistCard checklist={item} key={index} />
          )
        }
      />
    </div>
  );
};

export default MyChecklists;

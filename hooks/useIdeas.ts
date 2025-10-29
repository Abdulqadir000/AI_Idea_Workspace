"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { Idea } from "@/types";

type Options = {
  initial?: Idea[];
  autoFetch?: boolean; 
};

export const useIdeas = (options?: Options) => {
  const [ideas, setIdeas] = useState<Idea[]>(options?.initial ?? []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("/api/ideas");
      setIdeas(response.data);
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
      setError("Failed to load ideas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const shouldFetch = options?.autoFetch ?? (options?.initial ? false : true);
    if (shouldFetch) {
      fetchIdeas();
    } else {
      setIsLoading(false);
    }
  }, [fetchIdeas]);

  const createIdea = async (title: string, description: string) => {
    try {
      setError(null);
      const response = await axios.post("/api/ideas", { title, description });
      setIdeas((prev) => [response.data, ...prev]);
      return { success: true, idea: response.data };
    } catch (err) {
      console.error("Failed to create idea:", err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || "Failed to create idea"
        : "Failed to create idea";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      setError(null);
      await axios.delete(`/api/ideas/${id}`);
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Failed to delete idea:", err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || "Failed to delete idea"
        : "Failed to delete idea";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getIdeaById = (id: string): Idea | undefined => {
    return ideas.find((idea) => idea.id === id);
  };

  return {
    ideas,
    isLoading,
    error,
    createIdea,
    deleteIdea,
    getIdeaById,
    refetch: fetchIdeas,
  };
};

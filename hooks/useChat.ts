"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import type { Message } from "@/types";

interface UseChatProps {
  ideaId: string;
  initialMessages?: Message[];
}

export const useChat = ({ ideaId, initialMessages = [] }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message optimistically
        const userMessage: Message = {
          id: `temp-${Date.now()}`,
          ideaId,
          role: "user",
          content,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Save user message to database
        await axios.post("/api/messages", {
          ideaId,
          role: "user",
          content,
        });

        // Get AI response
        const chatResponse = await axios.post("/api/chat", {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        const assistantContent = chatResponse.data.message;

        // Add assistant message
        const assistantMessage: Message = {
          id: `temp-assistant-${Date.now()}`,
          ideaId,
          role: "assistant",
          content: assistantContent,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Save assistant message to database
        await axios.post("/api/messages", {
          ideaId,
          role: "assistant",
          content: assistantContent,
        });

        return { success: true, message: assistantContent };
      } catch (err) {
        console.error("Failed to send message:", err);
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.error || "Failed to send message"
          : "Failed to send message";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [ideaId, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};

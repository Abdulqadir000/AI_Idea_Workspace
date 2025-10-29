"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Message, Task, Idea } from "@/types";

interface WorkspaceClientProps {
  initialIdea: Idea & { messages: Message[]; tasks: Task[] };
}

export default function WorkspaceClient({ initialIdea }: WorkspaceClientProps) {
  const [idea, setIdea] = useState(initialIdea);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [idea.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = message;
    setMessage("");

    try {
      await axios.post("/api/messages", {
        ideaId: idea.id,
        role: "user",
        content: userMessage,
      });

      const chatHistory = [
        ...idea.messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ];

      const aiResponse = await axios.post("/api/chat", {
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant helping to refine and develop project ideas. The current project idea is: "${idea.title}" - ${idea.description}. Provide thoughtful, actionable advice and insights.`,
          },
          ...chatHistory,
        ],
      });

      const assistantText = aiResponse.data.message as string;

      await axios.post("/api/messages", {
        ideaId: idea.id,
        role: "assistant",
        content: assistantText,
      });

      setIdea((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `temp-${Date.now()}`,
            ideaId: prev.id,
            role: "user",
            content: userMessage,
            createdAt: new Date().toISOString(),
          },
          {
            id: `temp-a-${Date.now()}`,
            ideaId: prev.id,
            role: "assistant",
            content: assistantText,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message"); // Changed alert to toast
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTasks = async () => {
    if (idea.messages.length === 0) {
      toast.error(
        "Please chat with the AI Assistant first before generating tasks."
      );
      return; // Stop the function here
    }

    setGeneratingTasks(true);
    try {
      await axios.post("/api/tasks/generate", {
        ideaId: idea.id,
        description: idea.description,
        // Also send chat history for better context
        chatHistory: idea.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      const updated = await axios.get(`/api/ideas/${idea.id}`);
      setIdea(updated.data);
      toast.success("Tasks generated successfully!");
    } catch (err) {
      console.error("Error generating tasks:", err);
      toast.error("Failed to generate tasks");
    } finally {
      setGeneratingTasks(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "low":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="border-b border-gray-200/50 bg-white/70 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {idea.title}
              </h1>
              <p className="text-gray-600 mt-1">{idea.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-[calc(100vh-130px)] gap-6 p-6">
        {/* Chat Section */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-gray-200/50">
          {/* Chat Header */}
          <div className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-600">
                  Chat with AI to refine your idea
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {idea.messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Start a conversation with the AI assistant
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Ask questions or get suggestions to develop your idea
                  </p>
                </div>
              </div>
            ) : (
              idea.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-5 py-3.5 shadow-md ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p
                      className={`whitespace-pre-wrap leading-relaxed ${msg.role === "assistant" ? "text-gray-800" : ""}`}
                    >
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200/50 p-6 bg-white/50"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border-2 border-gray-200 px-5 py-3.5 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>

        {/* Tasks Section */}
        <div className="w-[420px] flex flex-col overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-gray-200/50">
          <div className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5">
            {/* Task Header Content */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
                  <p className="text-sm text-gray-600">
                    {idea.tasks.length} task{idea.tasks.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateTasks}
                disabled={generatingTasks}
                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
              >
                {generatingTasks ? "Generating..." : "+ Generate"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {idea.tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="h-10 w-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 text-lg">
                  No tasks yet
                </p>
                <p className="mt-2 text-sm text-gray-600 max-w-xs">
                  Click Generate to create an AI-powered task breakdown for your
                  idea!
                </p>
              </div>
            ) : (
              idea.tasks
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((task, index) => (
                  <div
                    key={task.id}
                    className="rounded-xl border-2 border-gray-200 p-4 bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-gray-700 text-sm">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-gray-900 leading-snug">
                          {task.title}
                        </h3>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm flex-shrink-0 ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed ml-11">
                      {task.description}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

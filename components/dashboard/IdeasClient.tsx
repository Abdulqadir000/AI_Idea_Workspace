"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useIdeas } from "@/hooks/useIdeas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardSkeleton } from "@/components/ui/Loader";
import type { Idea } from "@/types";

interface IdeasClientProps {
  initialIdeas: Idea[];
}

export default function IdeasClient({ initialIdeas }: IdeasClientProps) {
  const { ideas, createIdea, deleteIdea, isLoading } = useIdeas({
    initial: initialIdeas,
    autoFetch: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createIdea(title, description);
    if (res.success) {
      setTitle("");
      setDescription("");
      setShowModal(false);
      toast.success("Idea created successfully!");
    } else {
      toast.error(res.error || "Failed to create idea");
    }
    setIsSubmitting(false);
  };

  const handleDeleteClick = (id: string) => {
    setIdeaToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ideaToDelete) return;
    setIsDeleting(true);
    const res = await deleteIdea(ideaToDelete);
    if (res.success) {
      toast.success("Idea deleted successfully!");
      setShowDeleteModal(false);
      setIdeaToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete idea");
    }
    setIsDeleting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Always Visible */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Your Ideas
            </h1>
            <p className="text-gray-600">
              Transform your thoughts into reality with AI
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Idea
          </Button>
        </div>

        {/* Loading State - Only for Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden animate-pulse"
              >
                {/* Skeleton Header */}
                <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 border-b border-gray-200/50">
                  <div className="h-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-blue-100 rounded-lg w-full mb-2"></div>
                  <div className="h-4 bg-blue-100 rounded-lg w-2/3"></div>
                </div>
                
                {/* Skeleton Body */}
                <div className="p-6">
                  <div className="flex gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl"></div>
                      <div>
                        <div className="h-3 bg-blue-100 rounded w-16 mb-2"></div>
                        <div className="h-5 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-8"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl"></div>
                      <div>
                        <div className="h-3 bg-purple-100 rounded w-16 mb-2"></div>
                        <div className="h-5 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-8"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skeleton Buttons */}
                  <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg"></div>
                    <div className="w-10 h-10 bg-red-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No ideas yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Get started by creating your first idea and let AI help you bring
              it to life!
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8 py-6 text-base"
            >
              Create Your First Idea
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 border-b border-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {idea.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                {/* Card Stats */}
                <div className="p-6">
                  <div className="flex gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Messages</p>
                        <p className="text-lg font-bold text-gray-900">
                          {idea._count?.messages || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tasks</p>
                        <p className="text-lg font-bold text-gray-900">
                          {idea._count?.tasks || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/workspace/${idea.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
                        Open Workspace
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteClick(idea.id)}
                      className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Idea Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create New Idea
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Enter a title and description for your new idea. AI will help
                you develop it further.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateIdea} className="space-y-5 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Title
                </label>
                <Input
                  placeholder="Enter idea title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-2 border-gray-200 focus:border-blue-500 h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your idea..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                  className="border-2 border-gray-200 focus:border-blue-500 text-base resize-none"
                />
              </div>
            </form>

            <DialogFooter className="mt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="border-2 border-gray-300 hover:bg-gray-50 px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateIdea}
                disabled={!title || !description || isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-6"
              >
                {isSubmitting ? "Creating..." : "Create Idea"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Delete Idea
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base pt-2">
                Are you sure you want to delete this idea? This action cannot be
                undone and will permanently remove all associated messages and
                tasks.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setIdeaToDelete(null);
                }}
                disabled={isDeleting}
                className="border-2 border-gray-300 hover:bg-gray-50 px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg px-6"
              >
                {isDeleting ? "Deleting..." : "Delete Idea"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
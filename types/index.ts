export interface Idea {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
    tasks: number;
  };
  messages?: Message[];
  tasks?: Task[];
}

export interface Message {
  id: string;
  ideaId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  ideaId: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

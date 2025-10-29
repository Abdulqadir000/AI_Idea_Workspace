import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = { variable: "" };

const geistMono = { variable: "" };

export const metadata: Metadata = {
  title: "AI Idea Workspace - Create & Manage Project Ideas with AI",
  description:
    "A full-stack Next.js application to create, manage, and refine project ideas with AI assistance. Built with Next.js 14, MongoDB, Prisma ORM, and OpenRouter API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

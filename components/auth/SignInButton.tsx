"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  children?: React.ReactNode;
}

export function SignInButton({
  size = "lg",
  variant = "default",
  children = "Get Started Free",
}: SignInButtonProps) {
  return (
    <Button
      size={size}
      variant={variant}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      {children}
    </Button>
  );
}

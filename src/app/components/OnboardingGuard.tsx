"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStatus } from "../hooks/useOnboarding";

interface Props {
  children: ReactNode;
  requireCompleted?: boolean;
}

export default function OnboardingGuard({ children, requireCompleted = false }: Props) {
  const { data: completed, isLoading } = useOnboardingStatus();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (requireCompleted) {
      if (!completed) router.replace("/components/FirstTimeSetUp/Landing");
    } else if (completed) {
      router.replace("/components/Dashboard");
    }
  }, [completed, isLoading, requireCompleted, router]);

  if (isLoading) return null;
  if (requireCompleted ? !completed : completed) {
    return null;
  }
  return <>{children}</>;
}

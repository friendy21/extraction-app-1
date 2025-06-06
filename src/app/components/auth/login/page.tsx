// File: /app/login/page.tsx

import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Your App Name",
  description: "Log in to your account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const resetSuccess = searchParams?.resetSuccess === "true";
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gray-50">
      {resetSuccess && (
        <div className="w-full max-w-md mb-4 p-3 text-sm text-green-800 bg-green-100 rounded-md">
          Your password has been reset successfully. You can now log in with your new password.
        </div>
      )}
      <LoginForm />
    </div>
  );
}

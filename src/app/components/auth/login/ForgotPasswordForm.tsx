// File: /components/auth/ForgotPasswordForm.tsx
'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../../../lib/validation";
import {Input} from "@/app/components/ui/input";
import {Button} from "@/app/components/ui/button";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (_data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Here you would integrate with Supabase to send password reset email
      // For now, we'll just simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Check your email</h1>
          <p className="mt-4 text-gray-600">
            We have sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              Return to login
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-gray-600">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>
      
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="name@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Send reset link
        </Button>
        
        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}

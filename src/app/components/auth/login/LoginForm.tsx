'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "./../../../lib/validation";
import {Input} from "@/app/components/ui/input";
import {Button} from "@/app/components/ui/button";

export default function LoginForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if (result?.error) {
        setAuthError("Invalid email or password");
        return;
      }
      
      // If no error, login was successful
      // Redirect to landing page
      router.push('/components/FirstTimeSetUp/Landing');
      
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const useDemoAccount = () => {
    setValue("email", "admin123@glynac.ai");
    setValue("password", "admin123");
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Log in to your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your credentials to access your account
        </p>
      </div>
      
      {authError && (
        <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
          {authError}
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
        
        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Log in
        </Button>
      </form>
      
      {/* Demo Account Section */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Demo Account</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={useDemoAccount}
            className="text-xs"
          >
            Use Demo Credentials
          </Button>
        </div>
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <span className="font-medium w-20">Email:</span>
            <code className="bg-blue-100 px-2 py-0.5 rounded">admin123@glynac.ai</code>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Password:</span>
            <code className="bg-blue-100 px-2 py-0.5 rounded">admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
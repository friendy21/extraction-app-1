"use client"

import { useState } from "react";
import {Button} from "@/app/components/ui/button";
import { 
  CheckCircle2, 
  BarChart2, 
  Users,
  Shield,
  ArrowRight,
  Monitor,
  Mail, 
  MessageSquare, 
  Video, 
  Archive
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/components/FirstTimeSetUp/OrganizationSetup');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                Welcome to Glynac
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Gain powerful insights into your workplace dynamics and improve collaboration with Glynac's advanced analytics platform.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Connect to your workplace platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Discover valuable communication patterns</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Protect employee privacy with advanced anonymization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Make data-driven decisions with confidence</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md flex items-center gap-2"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-center mb-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md w-full"
                    onClick={handleGetStarted}
                  >
                    Set up your analytics dashboard in minutes
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-2 mb-2">
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-center text-gray-700">Data Insights</span>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-2 mb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-center text-gray-700">Team Collaboration</span>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-2 mb-2">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-center text-gray-700">Privacy Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8"></div>

      {/* Platform Integration Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-gray-700 text-lg mb-8">
            Connects with your favorite workplace platforms
          </h2>
          <div className="flex justify-between items-center gap-6">
            {/* Microsoft 365 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 11V0H0V11H11Z" fill="#F25022"/>
                  <path d="M24 11V0H13V11H24Z" fill="#7FBA00"/>
                  <path d="M11 24V13H0V24H11Z" fill="#00A4EF"/>
                  <path d="M24 24V13H13V24H24Z" fill="#FFB900"/>
                </svg>
              </div>
            </div>
            
            {/* Google Workspace */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
                </svg>
              </div>
            </div>
            
            {/* Slack */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.07 15.77C9.07 16.88 8.17 17.78 7.06 17.78C5.95 17.78 5.05 16.88 5.05 15.77C5.05 14.66 5.95 13.76 7.06 13.76H9.07V15.77Z" fill="#E01E5A"/>
                  <path d="M10.08 15.77C10.08 14.66 10.98 13.76 12.09 13.76C13.2 13.76 14.1 14.66 14.1 15.77V20.79C14.1 21.9 13.2 22.8 12.09 22.8C10.98 22.8 10.08 21.9 10.08 20.79V15.77Z" fill="#E01E5A"/>
                  <path d="M12.09 9.05C10.98 9.05 10.08 8.15 10.08 7.04C10.08 5.93 10.98 5.03 12.09 5.03C13.2 5.03 14.1 5.93 14.1 7.04V9.05H12.09Z" fill="#36C5F0"/>
                  <path d="M12.09 10.06C13.2 10.06 14.1 10.96 14.1 12.07C14.1 13.18 13.2 14.08 12.09 14.08H7.07C5.96 14.08 5.06 13.18 5.06 12.07C5.06 10.96 5.96 10.06 7.07 10.06H12.09Z" fill="#36C5F0"/>
                  <path d="M18.81 12.07C18.81 10.96 19.71 10.06 20.82 10.06C21.93 10.06 22.83 10.96 22.83 12.07C22.83 13.18 21.93 14.08 20.82 14.08H18.81V12.07Z" fill="#2EB67D"/>
                  <path d="M17.8 12.07C17.8 13.18 16.9 14.08 15.79 14.08C14.68 14.08 13.78 13.18 13.78 12.07V7.05C13.78 5.94 14.68 5.04 15.79 5.04C16.9 5.04 17.8 5.94 17.8 7.05V12.07Z" fill="#2EB67D"/>
                  <path d="M15.79 18.79C16.9 18.79 17.8 19.69 17.8 20.8C17.8 21.91 16.9 22.81 15.79 22.81C14.68 22.81 13.78 21.91 13.78 20.8V18.79H15.79Z" fill="#ECB22E"/>
                  <path d="M15.79 17.78C14.68 17.78 13.78 16.88 13.78 15.77C13.78 14.66 14.68 13.76 15.79 13.76H20.81C21.92 13.76 22.82 14.66 22.82 15.77C22.82 16.88 21.92 17.78 20.81 17.78H15.79Z" fill="#ECB22E"/>
                </svg>
              </div>
            </div>
            
            {/* Zoom */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="256" cy="256" r="256" fill="#2D8CFF" />
                  <path
                    d="M352 228.3v55.4c0 10.6-11.6 17-20.6 11.2l-45.4-27.7v22.8c0 11.1-9 20.1-20.1 20.1H160.1c-11.1 0-20.1-9-20.1-20.1v-76.4c0-11.1 9-20.1 20.1-20.1h106.8c11.1 0 20.1 9 20.1 20.1v22.8l45.4-27.7c9.1-5.6 20.6 0.6 20.6 11.2z"
                    fill="#fff"
                  />
                </svg>
              </div>
            </div>
            
            {/* Dropbox */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.2 1.5L0 6.6L5.1 10.95L12.3 6.15L7.2 1.5Z" fill="#0061FF"/>
                  <path d="M0 15.3L7.2 20.4L12.3 15.75L5.1 10.95L0 15.3Z" fill="#0061FF"/>
                  <path d="M12.3 15.75L17.4 20.4L24.6 15.3L19.5 10.95L12.3 15.75Z" fill="#0061FF"/>
                  <path d="M24.6 6.6L17.4 1.5L12.3 6.15L19.5 10.95L24.6 6.6Z" fill="#0061FF"/>
                  <path d="M12.3262 16.7963L7.2 21.4963L5.1 20.0963V21.8963L12.3262 25.4963L19.5 21.8963V20.0963L17.4 21.4963L12.3262 16.7963Z" fill="#0061FF"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
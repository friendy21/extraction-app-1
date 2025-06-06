"use client"

import { Info } from "lucide-react"; // Import the Info icon from lucide-react

export default function Footer() {

  return (
    <footer className={`flex justify-between items-center p-4 border-t`}>
      <div className={`text-sm `}>
        © 2025 Glynac. All rights reserved.
      </div>
      <div>
        <Info className={`h-6 w-6 `} />
      </div>
    </footer>
  );
}
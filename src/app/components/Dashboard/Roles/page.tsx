"use client"

import React from 'react';
import RolePage from './RolePage';

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <RolePage />
      </div>
    </div>
  );
}
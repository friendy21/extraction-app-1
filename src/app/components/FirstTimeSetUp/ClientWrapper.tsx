"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // Get the current pathname

    return (
        <>
            {children}
        </>
    );
}

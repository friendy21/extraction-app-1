import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../../globals.css"
import MenuBar from '../MenuBar'
import ClientWrapper from '../ClientWrapper'
import { StepProvider } from '../StepContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Glynac Analytics - Employee Discovery",
    description: "Discover and manage your employees",
    icons: {
        icon: "/favicon.ico",
    }
}

export default function ReviewLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Employee is step 2 in the step array
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <StepProvider initialStep={5}>  
                    <ClientWrapper>
                        <MenuBar />
                        <main className="flex-grow flex-shrink-0">
                            {children}
                        </main>
                    </ClientWrapper>
                </StepProvider>
            </body>
        </html>
    )
}
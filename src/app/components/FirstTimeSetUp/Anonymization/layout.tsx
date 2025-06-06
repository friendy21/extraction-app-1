// File: src/app/components/FirstTimeSetUp/Connection/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../../globals.css"
import MenuBar from '../MenuBar'
import ClientWrapper from '../ClientWrapper'
import { StepProvider } from '../StepContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Glynac Analytics - Connection Setup",
    description: "Set up your workplace platform connections",
    icons: {
        icon: "/favicon.ico",
    }
}

export default function AnonymizationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Connection is step 1 in the step array
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <StepProvider initialStep={4}> 
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
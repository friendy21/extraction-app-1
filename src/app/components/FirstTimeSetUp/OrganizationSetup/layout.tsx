import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../../globals.css"
import MenuBar from '../MenuBar'
import ClientWrapper from '../ClientWrapper'
import { StepProvider } from '../StepContext'
import OnboardingGuard from '../../OnboardingGuard'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Glynac Analytics",
    description: "Workplace analytics platform",
    icons: {
        icon: "/favicon.ico",
    }
}

export default function OrganizationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <OnboardingGuard>
                    <StepProvider>
                        <ClientWrapper>
                            <MenuBar />
                            <main className="flex-grow flex-shrink-0">
                                {children}
                            </main>
                        </ClientWrapper>
                    </StepProvider>
                </OnboardingGuard>
            </body>
        </html>
    )
}
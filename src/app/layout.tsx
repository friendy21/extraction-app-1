import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from './components/Footer';
import ReactQueryProvider from "./components/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Glynac Analytics",
    description: "Workplace analytics platform",
    icons: {
        icon: "/favicon.ico",
    }
}

export default function RootLayout({
  children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <ReactQueryProvider>
                    <main className="flex-grow flex-shrink-0">
                        {children}
                    </main>
                    <Footer className="flex-shrink-0" />
                </ReactQueryProvider>
            </body>
        </html>
    )
}

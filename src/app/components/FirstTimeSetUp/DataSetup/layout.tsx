// File: src/app/components/FirstTimeSetUp/DataSetup/layout.tsx
import { Inter } from "next/font/google";
import MenuBar from '../MenuBar';
import { StepProvider } from '../StepContext';

const inter = Inter({ subsets: ["latin"] });

export default function DataSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DataSetup is step 3 in the step array
  return (
    <div className="flex flex-col min-h-screen">
      <StepProvider initialStep={3}>
        <MenuBar />
        <main className="flex-grow flex-shrink-0">
          {children}
        </main>
      </StepProvider>
    </div>
  );
}
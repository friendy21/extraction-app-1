// This is the main entry point of the application
// It renders the public landing page for non-authenticated users

import LoginPage from "./components/auth/login/page";

export default function Page() {
  return (
    <LoginPage />
  );
}
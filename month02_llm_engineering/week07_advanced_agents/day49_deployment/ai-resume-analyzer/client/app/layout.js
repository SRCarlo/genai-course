import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "AI Resume Analyzer",

  description: "AI SaaS Resume Analyzer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

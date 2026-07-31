import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],

  variable: "--font-inter",
});

export const metadata = {
  title: "AI Resume AI",

  description: "AI powered resume analyzer SaaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
${inter.variable}
font-sans
bg-gray-100
text-gray-900
`}
      >
        {children}
      </body>
    </html>
  );
}

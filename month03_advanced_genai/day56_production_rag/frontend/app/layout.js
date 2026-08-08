import "./globals.css";

export const metadata = {
  title: "AI Knowledge Assistant",
  description: "Production RAG Knowledge Base Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

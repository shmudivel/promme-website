import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROMME - Industrial HR Platform",
  description: "Connect job seekers, companies, and educational institutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


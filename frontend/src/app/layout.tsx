import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateSeoMetadata } from "@/lib/SEO";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = generateSeoMetadata({
  title: "Appify Social | Modern Social Media Platform",
  description:
    "Appify Social is a modern social networking application built with Next.js, Node.js, MongoDB, Redux Toolkit, and TypeScript. Users can create posts, upload images, like, comment, reply, and manage private or public content securely.",

  schemaTypes: ["WebSite", "WebApplication", "SoftwareApplication"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

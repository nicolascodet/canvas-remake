import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/client/Sidebar";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Canvas Student Remake",
  description: "A recreation of the Canvas LMS for students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex flex-col h-screen">
          {/* Top Navigation */}
          <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link 
                href="/studio"
                className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-800"
              >
                <VideoCameraIcon className="h-5 w-5" />
                <span>Studio</span>
              </Link>
            </div>
            <div className="text-sm">Canvas Student Remake</div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

import { Button } from "@/components/ui/button";
import { FileText, Home, MessageSquare } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Backend API Dashboard",
  description: "Manage your Posts and Comments",
};

interface RootLayoutProps {
  children: ReactNode;
}

const API_URI = process.env.NEXT_PUBLIC_API_URI || "";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <nav className="border-b bg-white shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-6 w-6" />
                    <span className="text-xl font-bold">Backend API</span>
                  </Link>

                  <div className="flex items-center gap-4">
                    <Link
                      href="/post"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Posts
                    </Link>

                    <Link
                      href="/comment"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Comments
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">API v1.0</span>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`${API_URI}/swagger`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      API Docs
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          <main className="container mx-auto px-4 py-6 flex-1">{children}</main>

          <footer className="border-t bg-white mt-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Built with Next.js and shadcn/ui
                </p>
                <p className="text-sm text-gray-600">© 2025 Backend API</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

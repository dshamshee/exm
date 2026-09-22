import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Exam Management Portal",
  description: "Candidate, Exam details and Hall Ticket portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

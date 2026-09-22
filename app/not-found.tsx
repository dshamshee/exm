import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center py-6 px-4 bg-background text-foreground relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-4 z-10">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase border border-primary/20">
          <GraduationCap className="h-4 w-4" />
          404 — Page Not Found
        </div>

        {/* Natural Aspect Ratio Image */}
        <div className="relative flex justify-center py-1">
          <Image
            src="/notFound.jpeg"
            alt="Not Found - घरे जा के सुत्ती बाबू"
            width={500}
            height={600}
            className="w-auto h-auto max-h-[420px] sm:max-h-[520px] md:max-h-[560px] rounded-2xl border-2 border-border shadow-2xl object-contain transition-transform hover:scale-[1.01] duration-300"
            priority
            unoptimized
          />
        </div>

        {/* Quote in Hindi & Text */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            &ldquo;घरे जा के सुत्ती बाबू&rdquo;
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/verify">
            <Button size="lg" className="gap-2 font-medium">
              <ArrowLeft className="h-4 w-4" />
              Go to Verify
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2 font-medium">
              <Home className="h-4 w-4" />
              Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

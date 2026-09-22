"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyCandidateMutation } from "@/app/(public)/verify/query/verify";
import { useRecordCandidateDownloadMutation } from "@/app/(public)/verify/query/download";
import { SupportDialog } from "@/app/(public)/verify/_components/support-dialog";
import HallTicket from "@/components/hall-ticket/HallTicket";
import type { HallTicketData, CastCategory } from "@/types/hall-ticket";
import { Printer, RotateCcw, Search, GraduationCap, LifeBuoy, AlertCircle } from "lucide-react";

export default function VerifyPage() {
  const [name, setName] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [dob, setDob] = useState("");
  const [hallTicketData, setHallTicketData] = useState<HallTicketData | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  const hallTicketRef = useRef<HTMLDivElement>(null);

  const { mutate, isPending, error, isError, reset } = useVerifyCandidateMutation();
  const { mutate: recordDownload } = useRecordCandidateDownloadMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: hallTicketRef,
    documentTitle: `HallTicket_${hallTicketData?.candidate.name ?? "candidate"}`,
  });

  function onPrintClick() {
    if (candidateId) {
      recordDownload(
        { candidateId },
        {
          onSuccess: (res) => {
            if (res.success && res.data) {
              setDownloadCount(res.data.downloadCount ?? 1);
            }
          },
        }
      );
    }
    handlePrint();
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    mutate(
      { name, fathersName, dob },
      {
        onSuccess: (res) => {
          if (!res.success) {
            setServerError(res.message);
            return;
          }

          const d = res.data;
          setCandidateId(d.id);
          setDownloadCount(d.downloadCount ?? 0);

          const data: HallTicketData = {
            collegeName: "SANT SANDHYA DAS MAHILA COLLEGE",
            centerAddress: "Barh, Patna",
            negativeMarking: false,
            instructions: [
              "Don't carry any electronic gadgets",
              "Candidates must reach the examination centre 30 minutes before the exam",
              "Bring a valid photo ID along with this hall ticket",
              "Use of unfair means will result in cancellation of candidature",
              "Candidates must carry their own pen, pencil, and eraser",
            ],
            candidate: {
              name: d.name,
              roll: d.roll,
              fathers_name: d.fathersName ?? "",
              category: (d.category as CastCategory) ?? "General",
              dob: d.dob ?? "",
              gender: d.gender ?? "",
              profile: d.profile ?? undefined,
              signature: d.signature ?? undefined,
            },
            exam: {
              name: d.examName ?? "",
              post: d.examPost ?? "",
              date: d.examDate ?? "",
              time: d.examTime ?? "",
              reporting: d.examReporting ?? "",
              center: d.examCenter ?? "",
            },
          };

          setHallTicketData(data);
        },
      }
    );
  }

  function handleReset() {
    setHallTicketData(null);
    setCandidateId(null);
    setDownloadCount(null);
    setServerError(null);
    setName("");
    setFathersName("");
    setDob("");
    reset();
  }

  // Hall Ticket Preview state
  if (hallTicketData) {
    return (
      <div className="flex flex-col items-center py-8 px-4 gap-6">
        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
          <Button onClick={onPrintClick} size="lg" className="gap-2">
            <Printer className="h-4 w-4" />
            Print Hall Ticket
          </Button>

          <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Verify Another
          </Button>

          <SupportDialog
            initialValues={{ name, fathersName, dob }}
            trigger={
              <Button variant="secondary" size="lg" className="gap-2">
                <LifeBuoy className="h-4 w-4" />
                Report an Issue
              </Button>
            }
          />

          {downloadCount !== null && downloadCount > 0 && (
            <span className="text-xs text-muted-foreground w-full text-center">
              Downloaded: {downloadCount} {downloadCount === 1 ? "time" : "times"}
            </span>
          )}
        </div>

        {/* Hall Ticket */}
        <div ref={hallTicketRef}>
          <HallTicket data={hallTicketData} />
        </div>
      </div>
    );
  }

  // Verification Form state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Hall Ticket Verification
          </CardTitle>
          <CardDescription>
            Enter your details to verify and download your hall ticket
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fathersName">Father&apos;s / Guardian&apos;s Name</Label>
              <Input
                id="fathersName"
                type="text"
                placeholder="Enter father's or guardian's name"
                value={fathersName}
                onChange={(e) => setFathersName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            {/* Error display with direct support link */}
            {(serverError || isError) && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-2 text-sm text-destructive">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{serverError || error?.message || "Something went wrong. Please try again."}</span>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setSupportDialogOpen(true)}
                    className="text-xs font-medium underline underline-offset-4 hover:opacity-80 flex items-center gap-1 text-destructive"
                  >
                    Cannot find your admit card? Contact Customer Support →
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full gap-2" size="lg" disabled={isPending}>
              {isPending ? (
                <>Verifying...</>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t pt-4 text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1.5">
            <span>Having trouble with your hall ticket?</span>
            <button
              type="button"
              onClick={() => setSupportDialogOpen(true)}
              className="text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Contact Support
            </button>
          </div>
        </CardFooter>
      </Card>

      {/* Controlled Support Dialog */}
      <SupportDialog
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
        initialValues={{ name, fathersName, dob }}
      />
    </div>
  );
}

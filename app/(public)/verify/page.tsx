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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyCandidateMutation } from "@/app/(public)/verify/query/verify";
import HallTicket from "@/components/hall-ticket/HallTicket";
import type { HallTicketData, CastCategory } from "@/types/hall-ticket";
import { Printer, RotateCcw, Search, GraduationCap } from "lucide-react";

export default function VerifyPage() {
  const [name, setName] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [dob, setDob] = useState("");
  const [hallTicketData, setHallTicketData] = useState<HallTicketData | null>(null);

  const hallTicketRef = useRef<HTMLDivElement>(null);

  const { mutate, isPending, error, isError, reset } = useVerifyCandidateMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: hallTicketRef,
    documentTitle: `HallTicket_${hallTicketData?.candidate.name ?? "candidate"}`,
  });

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
        <div className="flex gap-3 print:hidden">
          <Button onClick={() => handlePrint()} size="lg" className="gap-2">
            <Printer className="h-4 w-4" />
            Print Hall Ticket
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Verify Another
          </Button>
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
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md">
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

            {/* Error display */}
            {(serverError || isError) && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {serverError || error?.message || "Something went wrong. Please try again."}
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
      </Card>
    </div>
  );
}

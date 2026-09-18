"use client"

import * as React from "react"
import { type Candidate } from "../query/get"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, PenTool, Ticket, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import HallTicket from "@/components/hall-ticket/HallTicket"
import type { HallTicketData, CastCategory } from "@/types/hall-ticket"

interface CandidateRowActionsProps {
    candidate: Candidate
}

export function CandidateRowActions({ candidate }: CandidateRowActionsProps) {
    const [openDialog, setOpenDialog] = React.useState<"profile" | "signature" | "hallticket" | null>(null)
    const printRef = React.useRef<HTMLDivElement>(null)

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `HallTicket_${candidate.roll}_${candidate.name.replace(/\s+/g, "_")}`,
        pageStyle: `
          @page {
            size: A4 portrait;
            margin: 0;
          }
          @media print {
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: 100% !important;
              overflow: hidden !important;
            }
            #hall-ticket, .page {
              page-break-after: avoid !important;
              break-after: avoid !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              min-height: auto !important;
              height: auto !important;
              max-height: 297mm !important;
            }
          }
        `,
    })

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const hallTicketData: HallTicketData = React.useMemo(() => {
        return {
            candidate: {
                name: candidate.name,
                roll: candidate.roll,
                fathers_name: candidate.fathersName ?? "-",
                category: (candidate.category as CastCategory) ?? "General",
                dob: candidate.dob ? String(candidate.dob) : "-",
                gender: "Male",
                profile: candidate.profile ?? undefined,
                signature: candidate.signature ?? undefined,
            },
            exam: {
                name: candidate.examName ?? "Examination 2026",
                post: candidate.examPost ?? "Candidate",
                date: candidate.examDate ? String(candidate.examDate) : "2026-05-10",
                time: candidate.examTime ?? "10:00 AM - 01:00 PM",
                reporting: candidate.examReporting ?? "09:00 AM",
                center: candidate.examCenter ?? "Main Examination Center",
            },
            instructions: [
                "Candidates must bring this Admit Card along with a valid original Government Photo ID proof (Aadhaar, Passport, PAN Card, Driving License).",
                "Candidates should reach the examination center at the reporting time. No candidate will be allowed entry after gate closure.",
                "Electronic devices including mobile phones, smartwatches, calculators, and bluetooth headsets are strictly prohibited inside the examination hall.",
                "Preserve this Hall Ticket carefully until the entire recruitment/admission process is completed."
            ],
            negativeMarking: false,
            collegeName: "EXAMINATION AUTHORITY & TESTING SERVICE",
            centerAddress: candidate.examCenter ?? "Main Examination Center Address",
        }
    }, [candidate])

    return (
        <>
            {/* 3 Direct Action Buttons */}
            <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenDialog("profile")}
                    className="h-8 text-xs gap-1"
                >
                    <User className="h-3.5 w-3.5" />
                    Profile
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenDialog("signature")}
                    className="h-8 text-xs gap-1"
                >
                    <PenTool className="h-3.5 w-3.5" />
                    Signature
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenDialog("hallticket")}
                    className="h-8 text-xs gap-1"
                >
                    <Ticket className="h-3.5 w-3.5" />
                    Hall Ticket
                </Button>
            </div>

            {/* 1. Profile Photo Dialog */}
            <Dialog open={openDialog === "profile"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Profile Photo</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Avatar className="h-32 w-32 border-2 border-primary/20 shadow-md">
                            <AvatarImage src={candidate.profile ?? undefined} alt={candidate.name} className="object-cover" />
                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                {getInitials(candidate.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">Roll No: {candidate.roll}</p>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-2 text-xs border-t pt-3 mt-1">
                            <div><span className="font-semibold text-muted-foreground">Category:</span> {candidate.category ?? "N/A"}</div>
                            <div><span className="font-semibold text-muted-foreground">Phone:</span> {candidate.phone}</div>
                            <div><span className="font-semibold text-muted-foreground">Email:</span> {candidate.email ?? "N/A"}</div>
                            <div><span className="font-semibold text-muted-foreground">DOB:</span> {candidate.dob ? String(candidate.dob) : "N/A"}</div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 2. Signature Dialog */}
            <Dialog open={openDialog === "signature"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Signature</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-full h-36 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/30 p-4">
                            {candidate.signature ? (
                                <img
                                    src={candidate.signature}
                                    alt={`Signature of ${candidate.name}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground text-sm">
                                    <PenTool className="mx-auto h-8 w-8 mb-1 opacity-50" />
                                    No signature uploaded
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-semibold">{candidate.name}</h3>
                            <p className="text-xs text-muted-foreground">Roll No: {candidate.roll}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 3. Hall Ticket Dialog */}
            <Dialog open={openDialog === "hallticket"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                    <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b">
                        <DialogTitle>Admit Card / Hall Ticket</DialogTitle>
                        <Button variant="outline" size="sm" onClick={() => handlePrint()} className="gap-1">
                            <Printer className="h-4 w-4" />
                            Print / Download
                        </Button>
                    </DialogHeader>

                    {/* Render exact HallTicket component with candidate data */}
                    <div ref={printRef} className="pt-2">
                        <HallTicket data={hallTicketData} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

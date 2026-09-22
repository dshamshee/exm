"use client"

import * as React from "react"
import { type Exam } from "../query/get"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Calendar, Clock, MapPin, Briefcase } from "lucide-react"

interface ExamRowActionsProps {
    exam: Exam
}

export function ExamRowActions({ exam }: ExamRowActionsProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="h-8 text-xs gap-1"
            >
                <Eye className="h-3.5 w-3.5" />
                Details
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Exam Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="border-b pb-3">
                            <h3 className="text-lg font-bold text-primary">{exam.name ?? "Unnamed Exam"}</h3>
                            {exam.post && (
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Post: {exam.post}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-md">
                                <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Exam Date</p>
                                    <p className="font-medium">{exam.date ? String(exam.date) : "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-md">
                                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Exam Time</p>
                                    <p className="font-medium">{exam.time ?? "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-md text-sm">
                            <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">Reporting Time</p>
                                <p className="font-medium">{exam.reporting ?? "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-md text-sm">
                            <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground">Examination Center</p>
                                <p className="font-medium">{exam.center ?? "Center not assigned yet."}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useCreateSupportTicketMutation } from "@/app/(public)/verify/query/support";
import { LifeBuoy, CheckCircle2, AlertCircle, Headphones } from "lucide-react";

const ISSUE_CATEGORIES = [
  "Unable to find / download Hall Ticket",
  "Name / Father's Name mismatch",
  "Date of Birth discrepancy",
  "Photo or Signature missing / blurred",
  "Examination Centre / Timing query",
  "Other issue",
] as const;

interface SupportDialogProps {
  initialValues?: {
    name?: string;
    fathersName?: string;
    dob?: string;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SupportDialog({
  initialValues,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: SupportDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(val);
    } else {
      setInternalOpen(val);
    }
  };

  const [name, setName] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [issueCategory, setIssueCategory] = useState<string>(ISSUE_CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string } | null>(null);

  const { mutate, isPending } = useCreateSupportTicketMutation();

  // Populate initial values whenever dialog opens or initialValues change
  useEffect(() => {
    if (open) {
      if (initialValues?.name && !name) setName(initialValues.name);
      if (initialValues?.fathersName && !fathersName) setFathersName(initialValues.fathersName);
      if (initialValues?.dob && !dob) setDob(initialValues.dob);
    }
  }, [open, initialValues]);

  function handleReset() {
    setName(initialValues?.name ?? "");
    setFathersName(initialValues?.fathersName ?? "");
    setDob(initialValues?.dob ?? "");
    setPhone("");
    setEmail("");
    setIssueCategory(ISSUE_CATEGORIES[0]);
    setMessage("");
    setErrorMessage(null);
    setSubmittedTicket(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    mutate(
      {
        name,
        fathersName,
        dob,
        phone,
        email: email.trim() ? email.trim() : undefined,
        issueCategory,
        message,
      },
      {
        onSuccess: (res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setSubmittedTicket({ id: res.data.id });
        },
        onError: (err) => {
          setErrorMessage(err.message || "Failed to submit support request. Please try again.");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        // Reset state after dialog closes
        setTimeout(handleReset, 300);
      }
    }}>
      {trigger ? (
        <DialogTrigger render={trigger as React.ReactElement} />
      ) : (
        <DialogTrigger
          render={
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <LifeBuoy className="h-4 w-4" />
              Need Help? Contact Support
            </Button>
          }
        />
      )}

      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        {submittedTicket ? (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Support Request Submitted</h3>
              <p className="text-sm text-muted-foreground">
                Your issue has been logged. Our helpdesk team will review it and reach out to you.
              </p>
            </div>

            <div className="w-full rounded-lg border bg-muted/40 p-3 text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference Ticket ID:</span>
                <span className="font-mono font-semibold">{submittedTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Candidate:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact Phone:</span>
                <span className="font-medium">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{issueCategory}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReset}
              >
                Submit Another Query
              </Button>
              <Button
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1 text-left pb-1">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Headphones className="h-4 w-4" />
                Customer Support & Helpdesk
              </div>
              <DialogTitle className="text-xl">Raise a Support Issue</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="support-name" className="text-xs font-medium">
                    Candidate Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="support-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="support-fathersName" className="text-xs font-medium">
                    Father&apos;s / Guardian&apos;s Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="support-fathersName"
                    value={fathersName}
                    onChange={(e) => setFathersName(e.target.value)}
                    placeholder="Enter father's name"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="support-dob" className="text-xs font-medium">
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="support-dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="support-phone" className="text-xs font-medium">
                    Mobile / Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="support-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="support-email" className="text-xs font-medium">
                    Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="support-category" className="text-xs font-medium">
                    Issue Category <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="support-category"
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    disabled={isPending}
                    className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                  >
                    {ISSUE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-popover text-popover-foreground">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="support-message" className="text-xs font-medium">
                  Explain the Issue <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="support-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe the problem you are experiencing in detail..."
                  rows={3}
                  required
                  disabled={isPending}
                />
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="gap-2">
                  {isPending ? (
                    <>
                      <Spinner size="xs" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Support Request"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

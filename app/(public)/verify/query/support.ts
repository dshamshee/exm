import { useMutation } from "@tanstack/react-query";
import { createSupportTicketAction } from "@/app/(public)/verify/lib/action";
import type { CreateSupportTicketInput } from "@/app/(public)/verify/lib/schema";

export function useCreateSupportTicketMutation() {
  return useMutation({
    mutationFn: (input: CreateSupportTicketInput) => createSupportTicketAction(input),
  });
}

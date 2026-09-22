import { useMutation } from "@tanstack/react-query";
import { recordCandidateDownloadAction } from "@/app/(public)/verify/lib/action";

export function useRecordCandidateDownloadMutation() {
  return useMutation({
    mutationFn: ({ candidateId }: { candidateId: string }) =>
      recordCandidateDownloadAction(candidateId),
  });
}

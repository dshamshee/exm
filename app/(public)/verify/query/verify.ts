import { useMutation } from "@tanstack/react-query";
import { verifyCandidateAction } from "@/app/(public)/verify/lib/action";

export function useVerifyCandidateMutation() {
  return useMutation({
    mutationFn: ({ name, fathersName, dob }: { name: string; fathersName: string; dob: string }) =>
      verifyCandidateAction(name, fathersName, dob),
  });
}

import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCandidateHallTicketAction } from "../lib/action";
import { getCandidateAction } from "@/app/(admin)/candidate/lib/action";

// ── List all candidates ──

export function getCandidateQuery() {
  return queryOptions({
    queryKey: ["get-candidate"],
    queryFn: async () => {
      const res = await getCandidateAction();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useGetCandidateQuery() {
  return useQuery(getCandidateQuery());
}

export type Candidate = NonNullable<ReturnType<typeof useGetCandidateQuery>["data"]>[number];

// ── Single candidate hall ticket data ──

export function getCandidateHallTicketQuery(candidateId: string) {
  return queryOptions({
    queryKey: ["get-candidate-hall-ticket", candidateId],
    queryFn: async () => {
      const res = await getCandidateHallTicketAction(candidateId);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!candidateId,
  });
}

export function useGetCandidateHallTicketQuery(candidateId: string) {
  return useQuery(getCandidateHallTicketQuery(candidateId));
}

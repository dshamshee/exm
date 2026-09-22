import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCandidateAction, getExamsAction } from "@/app/(admin)/candidate/lib/action";

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

export function getExamsQuery() {
  return queryOptions({
    queryKey: ["get-exams"],
    queryFn: async () => {
      const res = await getExamsAction();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useGetExamsQuery() {
  return useQuery(getExamsQuery());
}

// Inferred entity type from the query hook
export type Candidate = NonNullable<ReturnType<typeof useGetCandidateQuery>["data"]>[number];


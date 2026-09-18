import { queryOptions, useQuery } from "@tanstack/react-query";
import { getExamAction } from "@/app/exam/lib/action";

export function getExamQuery() {
  return queryOptions({
    queryKey: ["get-exam"],
    queryFn: async () => {
      const res = await getExamAction();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useGetExamQuery() {
  return useQuery(getExamQuery());
}

// Inferred entity type from the query hook
export type Exam = NonNullable<ReturnType<typeof useGetExamQuery>["data"]>[number];

import { queryOptions, useQuery } from "@tanstack/react-query";
import { getPostsAction } from "@/app/(public)/verify/lib/action";

export function getPostsQuery() {
  return queryOptions({
    queryKey: ["get-posts"],
    queryFn: async () => {
      const res = await getPostsAction();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useGetPostsQuery() {
  return useQuery(getPostsQuery());
}

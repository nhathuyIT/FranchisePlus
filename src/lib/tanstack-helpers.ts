import { queryClient } from "@/config/tanstack.config";

export const invalidateQueries = (queryKey: string | string[]) => {
  return queryClient.invalidateQueries({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
  });
};

export const prefetchQuery = async <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
};

export const setQueryData = <T>(queryKey: string[], data: T) => {
  queryClient.setQueryData(queryKey, data);
};

export const getQueryData = <T>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData<T>(queryKey);
};

export const removeQuery = (queryKey: string[]) => {
  queryClient.removeQueries({ queryKey });
};

export const clearAllQueries = () => {
  queryClient.clear();
};

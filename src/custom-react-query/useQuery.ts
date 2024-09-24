import { useContext, useEffect, useRef, useState } from 'react';

import type {
  QueryClient,
  QueryFunction,
  QueryKey,
  QueryObserver,
  QueryState,
} from '~custom-react-query/QueryClient';
import { QueryClientContext } from '~custom-react-query/QueryClientProvider';

export interface UseQueryProps {
  queryKey: QueryKey;
  queryFn: QueryFunction;
  staleTime?: number;
}

const createQueryObserver = (
  queryClient: QueryClient,
  {
    queryKey,
    queryFn,
    staleTime = 0,
  }: {
    queryKey: QueryKey;
    queryFn: QueryFunction;
    staleTime?: number;
  }
) => {
  const query = queryClient.getQuery({
    queryKey,
    queryFn,
  });

  const observer: QueryObserver = {
    notify: () => {},
    subscribe: (rerender) => {
      const unsubscribe = query.subscribe(observer);

      observer.notify = rerender;

      if (
        !query.state.lastUpdated ||
        Date.now() - query.state.lastUpdated > staleTime
      ) {
        void query.fetch();
      }

      return unsubscribe;
    },
    getQueryState: () => query.state,
  };

  return observer;
};

export const useQuery = <QueryData>({
  queryKey,
  queryFn,
  staleTime,
}: UseQueryProps) => {
  const queryClient = useContext(QueryClientContext);

  const observer = useRef(
    createQueryObserver(queryClient, {
      queryKey,
      queryFn,
      staleTime,
    })
  );

  const [, setCount] = useState(0);
  const rerender = () => {
    setCount((c) => c + 1);
  };

  useEffect(() => observer.current.subscribe(rerender), []);

  return observer.current.getQueryState() as QueryState<QueryData>;
};

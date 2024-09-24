import type {
  Query,
  QueryFunction,
  QueryKey,
} from '~custom-react-query/QueryClient';

interface CreateQueryParams {
  queryKey: QueryKey;
  queryFn: QueryFunction;
}

export const createQuery = ({ queryKey, queryFn }: CreateQueryParams) => {
  const query: Query = {
    queryKey,
    queryHash: JSON.stringify(queryKey),
    fetchingFunction: null,
    subscribers: [],
    state: {
      status: 'pending',
      isFetching: true,
      data: undefined,
      error: undefined,
      lastUpdated: undefined,
    },
    subscribe: (subscriber) => {
      query.subscribers.push(subscriber);

      return () => {
        query.subscribers = query.subscribers.filter((s) => s !== subscriber);
      };
    },
    setState: (updater) => {
      query.state = updater(query.state);

      query.subscribers.forEach((s) => {
        s.notify();
      });
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    fetch: async () => {
      if (!query.fetchingFunction) {
        query.fetchingFunction = async () => {
          query.setState((oldState) => ({
            ...oldState,
            isFetching: true,
            error: undefined,
          }));

          try {
            const data = await queryFn();

            query.setState((oldState) => ({
              ...oldState,
              status: 'success',
              data,
              lastUpdated: Date.now(),
            }));
            // eslint-disable-next-line @arabasta/report-caught-error/report-caught-error
          } catch (error) {
            query.setState((oldState) => ({
              ...oldState,
              status: 'error',
              error: error as Error,
            }));
          } finally {
            query.fetchingFunction = null;

            query.setState((oldState) => ({
              ...oldState,
              isFetching: false,
            }));
          }
        };

        void query.fetchingFunction();
      }
    },
  };

  return query;
};

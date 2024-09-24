import { createQuery } from '~custom-react-query/createQuery';

export interface QueryState<QueryData = unknown> {
  status: 'pending' | 'success' | 'error';
  isFetching: boolean;
  data?: QueryData;
  error?: Error;
  lastUpdated?: number;
}

export type QueryKey = string[];

export type QueryFunction = () => Promise<unknown>;

export interface QueryObserver {
  subscribe: (rerender: () => void) => () => void;
  notify: () => void;
  getQueryState: () => QueryState;
}

export interface Query {
  queryKey: QueryKey;
  queryHash: string;
  subscribers: QueryObserver[];
  state: QueryState;
  subscribe: (subscriber: QueryObserver) => () => void;
  setState: (updater: (state: QueryState) => QueryState) => void;
  fetch: () => Promise<void>;
  fetchingFunction: (() => Promise<void>) | null;
}

export class QueryClient {
  queries: Query[];

  constructor() {
    this.queries = [];
  }

  getQuery = ({
    queryFn,
    queryKey,
  }: {
    queryFn: QueryFunction;
    queryKey: QueryKey;
  }) => {
    const queryHash = JSON.stringify(queryKey);

    let query = this.queries.find((q) => q.queryHash === queryHash);

    if (!query) {
      query = createQuery({ queryKey, queryFn });
      this.queries.push(query);
    }

    return query;
  };
}

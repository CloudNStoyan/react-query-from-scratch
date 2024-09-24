import { type ReactNode, createContext } from 'react';

import { QueryClient } from '~custom-react-query/QueryClient';

export const QueryClientContext = createContext(new QueryClient());

export const QueryClientProvider = ({
  client,
  children,
}: {
  client: QueryClient;
  children: ReactNode;
}) => (
  <QueryClientContext.Provider value={client}>
    {children}
  </QueryClientContext.Provider>
);

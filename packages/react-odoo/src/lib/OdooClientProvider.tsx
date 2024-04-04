import React from 'react';
import { OdooClient } from '@asmozia/odoo-client';

export const OdooClientContext = React.createContext<OdooClient | undefined>(
  undefined
);

export const useOdooClient = (odooClient?: OdooClient) => {
  const client = React.useContext(OdooClientContext);

  if (odooClient) {
    return odooClient;
  }

  if (!client) {
    throw new Error('No OdooClient set, use OdooClientProvider to set one');
  }

  return client;
};

export type OdooClientProviderProps = {
  client: OdooClient;
  children?: React.ReactNode;
};

export const OdooClientProvider = ({
  client,
  children,
}: OdooClientProviderProps): JSX.Element => {
  return (
    <OdooClientContext.Provider value={client}>
      {children}
    </OdooClientContext.Provider>
  );
};

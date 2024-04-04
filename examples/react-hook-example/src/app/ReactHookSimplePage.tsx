import React, { useEffect } from 'react';
import { useOdooClient } from '@asmozia/react-odoo';

import { Card, CardBody, CardHeader, CardTitle, Page, Pre } from './SampleUI';

export function ReactHookSimplePage() {
  const [serverVersion, setServerVersion] = React.useState<any | null>(null);
  const client = useOdooClient();

  useEffect(() => {
    client
      .version()
      .then((info) => {
        setServerVersion(info);
      })
      .catch((err) => {
        console.error('Failed to get server version', err);
      });
  }, [client]);

  return (
    <Page>
      <Card>
        <CardHeader>
          <CardTitle>Server Info</CardTitle>
        </CardHeader>
        <CardBody>
          <p>
            This is an example of a simple React app that uses the OdooClient
            provider and hook to make requests to an Odoo server.
          </p>
          <p>
            Server info is fetched using the <code>version()</code> method of
            OdooClient method.
          </p>
          <p>
            The server info for demo4.odoo.com are :
            <Pre>{JSON.stringify(serverVersion, null, 2)}</Pre>
          </p>
        </CardBody>
      </Card>
    </Page>
  );
}

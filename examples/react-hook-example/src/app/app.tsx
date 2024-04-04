import { OdooClientProvider, OdooClient } from '@asmozia/react-odoo';

import { ReactHookSimplePage } from './ReactHookSimplePage';

const odooClient = new OdooClient({
  dbName: 'db-demo', // This is not a real db dame for hostname demo4.odoo.com, to get a real db name, you need to create a new database on demo4.odoo.com
  hostname: 'localhost',
  port: '4200',
  pathname: 'jsonrpc',
  unsecure: true,
});

export function App() {
  return (
    <OdooClientProvider client={odooClient}>
      <ReactHookSimplePage />
    </OdooClientProvider>
  );
}

export default App;

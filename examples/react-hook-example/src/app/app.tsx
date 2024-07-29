import { OdooClientProvider, OdooClient } from '@asmozia/react-odoo';

import { ReactHookSimplePage } from './ReactHookSimplePage';

export function App() {
  return (
    <OdooClientProvider
      defaultConfig={{
        dbName: 'db-demo', // This is not a real db dame for hostname demo4.odoo.com, to get a real db name, you need to create a new database on demo4.odoo.com
        hostname: 'localhost',
        port: '4200',
        pathname: 'jsonrpc',
        unsecure: true,
      }}
    >
      <ReactHookSimplePage />
    </OdooClientProvider>
  );
}

export default App;

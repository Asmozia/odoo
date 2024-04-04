# Odoo API

This is a library for interacting with the Odoo API. It was generated with [Nx](https://nx.dev).

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install odoo-client.

```bash
pnpm install odoo-client
```

## Usage

```typescript
import { OdooClient } from 'odoo-client';

const api = new OdooClient();

// Use the api
api
  .search('rh.employee', ['name', 'John'], { limit: 10 })
  .then((users) => console.log(users))
  .catch((error) => console.error(error));
```

## Building

Run the following command to build the library:

```bash
nx build odoo-client
```

## Running Tests

To execute the unit tests via [Vitest](https://vitest.dev/), run the following command:

```bash
nx test odoo-client
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

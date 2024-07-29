# Jsonrpc Client

This is a JSON-RPC client implemented in TypeScript. It provides a simple and efficient way to make JSON-RPC calls.

## Installation

To install the `jsonrpc-client`, run the following command:

```bash
npm install @asmozia/jsonrpc-client
```

## Usage
Here is a basic example of how to use the jsonrpc-client:

  ```typescript
import { JsonRpcClient } from '@asmozia/jsonrpc-client';

const client = new JsonRpcClient('http://localhost:8545');

client.call('myMethod', [param1, param2])
  .then(response => console.log(response))
  .catch(error => console.error(error));
  ```

## License
This project is licensed under the MIT License

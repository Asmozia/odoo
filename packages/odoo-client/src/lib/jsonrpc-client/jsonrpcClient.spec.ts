import { describe, test, expect, vi, beforeEach } from 'vitest';
import { JsonrpcClient, JsonrpcConfig } from './jsonrpcClient';

// Mock fetch function
vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.resolve({ json: () => ({}) }))
);

const hostname = 'test.com';
const port = '8888';
const pathname = '/api';

const securedUrl = 'https://test.com/api';

const method = 'method';
const params = { param: 'value' };

describe('JsonRPCClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('execute should correctly construct fetch request with url provided', async () => {
    const config: JsonrpcConfig = { url: securedUrl };

    const client = new JsonrpcClient(config);

    await client.execute(method, params);

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    };

    expect(global.fetch).toBeCalledWith(new URL(securedUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expectedData),
    });
  });

  test('execute should correctly construct fetch request with hostname provided', async () => {
    const config: JsonrpcConfig = { hostname, port, pathname };
    const client = new JsonrpcClient(config);

    await client.execute(method, params);

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    };

    expect(global.fetch).toBeCalledWith(
      new URL(`https://${hostname}:${port}${pathname}`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expectedData),
      }
    );
  });

  test('execute should correctly construct fetch request with unsecured provided', async () => {
    const config: JsonrpcConfig = { hostname, port, pathname, unsecure: true };
    const client = new JsonrpcClient(config);

    await client.execute(method, params);

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    };

    expect(global.fetch).toBeCalledWith(
      new URL(`http://${hostname}:${port}${pathname}`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expectedData),
      }
    );
  });

  test('execute should correctly handle onSend', async () => {
    const config: JsonrpcConfig = { url: securedUrl };
    const client = new JsonrpcClient(config, async () => ({}));

    const method = 'method';
    const params = { param: 'value' };

    await client.execute(method, params);

    expect(global.fetch).not.toBeCalled();
  });
});

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { OdooClient, OdooClientConfig } from './odoo-client';

// Mock fetch function
vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.resolve({ json: () => ({}) }))
);

const hostname = 'test.com';
const port = '8888';
const pathname = '/api';
const dbName = 'db_test';
const username = 'username_test';
const password = 'password_test';
const method = 'call';
const config: OdooClientConfig = { hostname, port, pathname, dbName };

describe('odoo-client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('execute common method', () => {
    const OdooClient = new OdooClient(config);

    OdooClient.common('method', 'param');

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'common',
        method: 'method',
        args: ['param'],
      },
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

  test('execute version method', () => {
    const OdooClient = new OdooClient(config);

    OdooClient.version();

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'common',
        method: 'version',
        args: [],
      },
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

  test('execute authenticate method', () => {
    const OdooClient = new OdooClient(config);

    OdooClient.authenticate(username, password);

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'common',
        method: 'authenticate',
        args: [dbName, username, password, {}],
      },
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

  test('execute object method', async () => {
    const uid = 1;
    const OdooClient = new OdooClient(config);

    vi.spyOn(OdooClient, 'common').mockResolvedValueOnce(Promise.resolve(uid));

    await OdooClient.authenticate(username, password);
    OdooClient.object('method', 'param');

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'object',
        method: 'method',
        args: [dbName, uid, password, 'param'],
      },
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

  test('execute execute method', async () => {
    const uid = 1;
    const OdooClient = new OdooClient(config);

    vi.spyOn(OdooClient, 'common').mockResolvedValueOnce(Promise.resolve(uid));

    await OdooClient.authenticate(username, password);
    OdooClient.execute('my.model', 'read', ['param'], {
      filter1: 'value1',
      filter2: 'value2',
    });

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'object',
        method: 'execute',
        args: [
          dbName,
          uid,
          password,
          'my.model',
          'read',
          ['param'],
          { filter1: 'value1', filter2: 'value2' },
        ],
      },
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

  test('execute read method', async () => {
    const uid = 1;
    const OdooClient = new OdooClient(config);

    vi.spyOn(OdooClient, 'common').mockResolvedValueOnce(Promise.resolve(uid));

    await OdooClient.authenticate(username, password);
    OdooClient.read('my.model', ['param'], {
      filter1: 'value1',
      filter2: 'value2',
    });

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'object',
        method: 'execute',
        args: [
          dbName,
          uid,
          password,
          'my.model',
          'read',
          ['param'],
          { filter1: 'value1', filter2: 'value2' },
        ],
      },
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

  test('execute search method', async () => {
    const uid = 1;
    const OdooClient = new OdooClient(config);

    vi.spyOn(OdooClient, 'common').mockResolvedValueOnce(Promise.resolve(uid));

    await OdooClient.authenticate(username, password);
    OdooClient.search('my.model', ['param'], {
      filter1: 'value1',
      filter2: 'value2',
    });

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'object',
        method: 'execute',
        args: [
          dbName,
          uid,
          password,
          'my.model',
          'search',
          ['param'],
          { filter1: 'value1', filter2: 'value2' },
        ],
      },
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

  test('execute searchRead method', async () => {
    const uid = 1;
    const OdooClient = new OdooClient(config);

    vi.spyOn(OdooClient, 'common').mockResolvedValueOnce(Promise.resolve(uid));

    await OdooClient.authenticate(username, password);
    OdooClient.searchRead('my.model', ['param'], {
      filter1: 'value1',
      filter2: 'value2',
    });

    const expectedData = {
      jsonrpc: '2.0',
      method,
      params: {
        service: 'object',
        method: 'execute',
        args: [
          dbName,
          uid,
          password,
          'my.model',
          'search_read',
          ['param'],
          { filter1: 'value1', filter2: 'value2' },
        ],
      },
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
});

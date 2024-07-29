import React, { createContext, useContext, useEffect, useState } from 'react';
import { JsonrpcClient, JsonrpcConfig, onSend } from '@asmozia/jsonrpc-client';

export type OdooClientContextProps = {
  config: OdooClientConfig;
  profile: {
    login: string;
    apiKey: string;
    uid: number | null;
  };
  updateConfig: (config: OdooClientConfig) => any;
  version: () => Promise<any>;
  authenticate: (
    login: string,
    apiKey: string,
    persist?: boolean
  ) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  read: (model: string, args?: any[], options?: object) => Promise<any>;
  search: (model: string, args?: any[], options?: object) => Promise<any>;
  searchRead: (
    model: string,
    filter?: any[],
    fields?: any[],
    options?: { offset: number; limit: number; order: string; context: object }
  ) => Promise<any>;
  searchCount: (
    model: string,
    filter?: any[],
    fields?: any[],
    options?: { offset: number; limit: number; order: string; context: object }
  ) => Promise<any>;
  fieldsGet: (model: string, args?: any[], options?: object) => Promise<any>;
  create: (model: string, args?: any[], options?: object) => Promise<any>;
  update: (model: string, args?: any[], options?: object) => Promise<any>;
  remove: (model: string, args?: any[], options?: object) => Promise<any>;
  isReady: boolean;
};

function defaultFunction() {
  return Promise.resolve(false);
}

export const OdooClientContext = createContext<OdooClientContextProps>({
  config: { dbName: '' },
  profile: {
    login: '',
    apiKey: '',
    uid: null,
  },
  updateConfig: () => {},
  version: defaultFunction,
  authenticate: defaultFunction,
  disconnect: defaultFunction,
  read: defaultFunction,
  search: defaultFunction,
  searchRead: defaultFunction,
  searchCount: defaultFunction,
  fieldsGet: defaultFunction,
  create: defaultFunction,
  update: defaultFunction,
  remove: defaultFunction,
  isReady: false,
});

interface OdooClientConfig extends JsonrpcConfig {
  dbName: string;
}

enum ApiMethod {
  CALL = 'call',
}

enum Service {
  COMMON = 'common',
  OBJECT = 'object',
}

export type OdooClientProviderProps = {
  defaultConfig: OdooClientConfig;
  children?: React.ReactNode;
  onSend?: onSend;
};

export function OdooClientProvider({
  defaultConfig,
  children,
  onSend,
}: OdooClientProviderProps) {
  const [jsonRPCClient, setJsonRPCClient] = useState<JsonrpcClient>();

  const [config, setConfig] = useState<OdooClientConfig>(defaultConfig);
  const [profile, setProfile] = useState<{
    login: string;
    apiKey: string;
    uid: number | null;
  }>({
    login: '',
    apiKey: '',
    uid: null,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedHostname = localStorage.getItem('hostname');
    const savedDbName = localStorage.getItem('dbName');
    const savedLogin = localStorage.getItem('login');
    const savedApiKey = localStorage.getItem('apiKey');
    const savedUId = localStorage.getItem('uid');

    const jsonRPCClient = new JsonrpcClient(
      {
        pathname: 'jsonrpc',
        ...defaultConfig,
        hostname: savedHostname || defaultConfig.hostname,
      },
      onSend
    );

    setJsonRPCClient(jsonRPCClient);
    setConfig({
      ...defaultConfig,
      dbName: savedDbName || defaultConfig.dbName,
      hostname: savedHostname || defaultConfig.hostname,
    });
    setProfile({
      login: savedLogin || '',
      apiKey: savedApiKey || '',
      uid: savedUId ? parseInt(savedUId, 10) : null,
    });

    setIsReady(true);
  }, [defaultConfig]);

  function updateConfig(newConfig: OdooClientConfig) {
    const jsonrpcClient = new JsonrpcClient(newConfig);
    setJsonRPCClient(jsonrpcClient);
    setConfig(newConfig);

    localStorage.setItem('hostname', newConfig.hostname || '');
    localStorage.setItem('dbName', newConfig.dbName || '');

    setProfile({
      ...profile,
      uid: null,
    });
    localStorage.removeItem('uid');
  }

  function common(method: string, ...args: any) {
    if (!jsonRPCClient) {
      return Promise.resolve(false);
    }

    return jsonRPCClient?.execute(ApiMethod.CALL, {
      service: Service.COMMON,
      method,
      args,
    });
  }

  function object(method: string, ...args: any) {
    if (!jsonRPCClient) {
      return Promise.resolve(false);
    }

    if (!profile.uid) {
      throw new Error(
        `This method is protected, you need to be authenticated.`
      );
    }

    return jsonRPCClient?.execute(ApiMethod.CALL, {
      service: Service.OBJECT,
      method,
      args: [config.dbName, profile.uid, profile.apiKey, ...args],
    });
  }

  async function authenticate(login: string, apiKey: string, persist = true) {
    try {
      const uid = await common(
        'authenticate',
        config.dbName,
        login,
        apiKey,
        {}
      );

      if (uid && persist) {
        localStorage.setItem('login', login);
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('uid', uid);

        setProfile({
          login,
          apiKey,
          uid,
        });
      }

      return uid;
    } catch (error) {
      console.error(error);
      throw new Error('Authentication failed');
    }
  }

  async function disconnect() {
    try {
      setProfile({
        login: '',
        apiKey: '',
        uid: null,
      });

      localStorage.removeItem('login');
      localStorage.removeItem('apiKey');
      localStorage.removeItem('uid');

      return true;
    } catch (error) {
      console.error('Disconnecting failed', error);
      return false;
    }
  }

  function version() {
    return common('version');
  }

  function execute(
    model: string,
    method: string,
    args?: any[],
    filter?: object
  ) {
    return object('execute_kw', model, method, args);
  }

  function read(model: string, args: any[] = [], options: object = {}) {
    return execute(model, 'read', args, options);
  }

  async function search(model: string, args: any[] = [], options: object = {}) {
    return await execute(model, 'search', args, options);
  }

  function searchRead(
    model: string,
    filter: any[] = [],
    fields: any[] = [],
    options = { offset: 0, limit: 0, order: '', context: {} }
  ) {
    return execute(model, 'search_read', [filter], { ...options, fields });
  }

  function searchCount(model: string, args: any[] = [], options: object = {}) {
    return execute(model, 'search_count', args, options);
  }

  function fieldsGet(model: string, args: any[] = [], options: object = {}) {
    return execute(model, 'fields_get', args, options);
  }

  function create(model: string, args: any[] = [], options: object = {}) {
    return execute(model, 'create', args, options);
  }

  function update(model: string, args: any[] = [], options: object = {}) {
    return execute(model, 'write', args, options);
  }

  function remove(model: string, args: any[] = [], options: object = {}) {
    return execute(model, 'unlink', args, options);
  }

  return (
    <OdooClientContext.Provider
      value={{
        config,
        updateConfig,
        profile,
        authenticate,
        disconnect,
        version,
        read,
        search,
        searchRead,
        searchCount,
        fieldsGet,
        create,
        update,
        remove,
        isReady,
      }}
    >
      {children}
    </OdooClientContext.Provider>
  );
}

export const useOdooClient = () => useContext(OdooClientContext);

export type { OdooClientConfig };

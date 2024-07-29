import React, { ReactNode } from 'react';
import { OdooClient } from '@asmozia/odoo-client';

export type OdooClientContextProps = {
  client: OdooClient | undefined;
};

export const OdooClientContext = React.createContext<OdooClientContextProps>({
  client: undefined,
});

import { useEffect, useState } from 'react';
import { JsonrpcClient, JsonrpcConfig, onSend } from '@asmozia/odoo-client';

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

function useOdooClient(
  { dbName, ...config }: OdooClientConfig,
  onSend?: onSend
) {
  const [jsonRPCClient, setJsonRPCClient] = useState<JsonrpcClient>();

  const [_dbName, setDbName] = useState<string>(dbName);
  const [_userLogin, setUserLogin] = useState<string>('');
  const [_userPassword, setUserPassword] = useState<string>('');
  const [_userId, setUserId] = useState<number>();

  useEffect(() => {
    const jsonRPCClient = new JsonrpcClient(
      {
        pathname: 'jsonrpc',
        ...config,
      },
      onSend
    );

    setJsonRPCClient(jsonRPCClient);
  }, []);

  function common(method: string, ...args: any) {
    return jsonRPCClient?.execute(ApiMethod.CALL, {
      service: Service.COMMON,
      method,
      args,
    });
  }

  function object(method: string, ...args: any) {
    if (!_userId) {
      throw new Error(
        `This method is protected, you need to be authenticated.`
      );
    }

    return jsonRPCClient?.execute(ApiMethod.CALL, {
      service: Service.OBJECT,
      method,
      args: [_dbName, _userId, _userPassword, ...args],
    });
  }

  async function authenticate(user: string, password: string, persist = true) {
    try {
      const uid = await common('authenticate', dbName, user, password, {});

      if (uid && persist) {
        setUserId(uid);
        setUserLogin(user);
        setUserPassword(password);
      }

      return uid;
    } catch (error) {
      console.error(error);
      throw new Error('Authentication failed');
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

  return {
    authenticate,
    version,
    read,
    search,
    searchRead,
    searchCount,
    fieldsGet,
    create,
    update,
    remove,
  };
}

export type { OdooClientConfig };
export { useOdooClient };

export type OdooClientProviderProps = {
  client: OdooClient;
  children?: React.ReactNode;
};

export const OdooClientProvider = ({
  client,
  children,
}: OdooClientProviderProps): ReactNode => {
  return (
    <OdooClientContext.Provider value={{ client }}>
      {children}
    </OdooClientContext.Provider>
  );
};

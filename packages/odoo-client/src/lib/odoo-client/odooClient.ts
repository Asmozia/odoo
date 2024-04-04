import {
  JsonrpcClient,
  JsonrpcConfig,
  onSend,
} from '../jsonrpc-client/jsonrpcClient';

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

class OdooClient {
  readonly dbName: string;
  readonly jsonRPCClient;

  userLogin = '';
  userId = '';
  private userPassword = '';

  constructor({ dbName, ...config }: OdooClientConfig, onSend?: onSend) {
    this.dbName = dbName;
    this.jsonRPCClient = new JsonrpcClient(
      {
        pathname: 'jsonrpc',
        ...config,
      },
      onSend
    );
  }

  common(method: string, ...args: any) {
    return this.jsonRPCClient.execute(ApiMethod.CALL, {
      service: Service.COMMON,
      method,
      args,
    });
  }

  object(method: string, ...args: any) {
    if (!this.userId) {
      throw new Error(
        `This method is protected, you need to be authenticated.`
      );
    }

    return this.jsonRPCClient.execute(ApiMethod.CALL, {
      service: Service.OBJECT,
      method,
      args: [this.dbName, this.userId, this.userPassword, ...args],
    });
  }

  async authenticate(user: string, password: string, persist = true) {
    try {
      const uid = await this.common(
        'authenticate',
        this.dbName,
        user,
        password,
        {}
      );

      if (uid && persist) {
        this.userId = uid;
        this.userLogin = user;
        this.userPassword = password;
      }

      return uid;
    } catch (error) {
      console.error(error);
      throw new Error('Authentication failed');
    }
  }

  version() {
    return this.common('version');
  }

  execute(model: string, method: string, args?: any[], filter?: object) {
    return this.object('execute_kw', model, method, args);
  }

  read(model: string, args: any[] = [], options: object = {}) {
    return this.execute(model, 'read', args, options);
  }

  async search(model: string, args: any[] = [], options: object = {}) {
    return await this.execute(model, 'search', args, options);
  }

  searchRead(
    model: string,
    filter: any[] = [],
    fields: any[] = [],
    options = { offset: 0, limit: 0, order: '', context: {} }
  ) {
    return this.execute(model, 'search_read', [filter], { ...options, fields });
  }

  searchCount(model: string, args: any[] = [], options: object = {}) {
    return this.execute(model, 'search_count', args, options);
  }

  fieldsGet(model: string, args: any[] = [], options: object = {}) {
    return this.execute(model, 'fields_get', args, options);
  }

  create(model: string, args: any[] = [], options: object = {}) {
    return this.execute(model, 'create', args, options);
  }

  update(model: string, args: any[] = [], options: object = {}) {
    return this.execute(model, 'write', args, options);
  }

  delete(model: string, args: any[] = [], options: object = {}) {
    return this.execute(model, 'unlink', args, options);
  }
}

export type { OdooClientConfig };
export { OdooClient };

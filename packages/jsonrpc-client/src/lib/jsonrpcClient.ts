interface JsonrpcConfig {
  url?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  jsonrpcVersion?: string;
  unsecure?: boolean;
}

type onSend = (url: URL, data: object, headers: HeadersInit) => Promise<object>;

class JsonrpcClient {
  private readonly url: URL;
  private readonly onSend: onSend;
  private config: JsonrpcConfig;
  private sequence = 0;

  constructor(config: JsonrpcConfig, onSend?: onSend) {
    this.config = {
      hostname: 'localhost',
      port: '',
      jsonrpcVersion: '2.0',
      unsecure: false,
      ...config,
    };

    this.onSend = onSend || this.send;

    if (this.config.url) {
      this.url = new URL(this.config.url);
    } else {
      const protocol = this.config.unsecure ? 'http' : 'https';
      const port = this.config.port ? `:${this.config.port}` : '';
      const url = `${protocol}://${this.config.hostname}${port}/${this.config.pathname}`;
      this.url = new URL(url);
    }
  }

  private getNewSequence(): number {
    return ++this.sequence;
  }

  async execute(method: string, params: object): Promise<any> {
    const data: any = {
      jsonrpc: this.config.jsonrpcVersion,
      method,
      params,
      id: this.getNewSequence(),
    };

    // @TODO: Fix the type of the response
    const response: { result?: object; error?: { message: string } } =
      await this.onSend(this.url, data, {
        'Content-Type': 'application/json',
      });

    if (response.error) {
      console.error(response.error);
      throw new Error(response.error.message || 'Unknown error');
    }

    return response.result !== undefined ? response.result : response;
  }

  async send(url: URL, data: object, headers: HeadersInit): Promise<object> {
    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }
}

export type { JsonrpcConfig, onSend };
export { JsonrpcClient };

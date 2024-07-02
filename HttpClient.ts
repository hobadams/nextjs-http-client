interface Logger {
  log: (message: string) => void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.error(message);
  }
}

type HttpClientConfig = {
  baseUrl: string;
  headers?: HeadersInit;
  cache?: RequestCache;
  customErrorMessages?: { [status: number]: string };
  logger?: Logger;
};

type RequestConfig<P = {}, B = {}> = {
  params?: P;
  body?: B;
  headers?: HeadersInit;
  cache?: RequestCache;
};

class HttpClient {
  private baseUrl: string;
  private headers: HeadersInit = {};
  private defaultCache: RequestCache = 'default';
  private customErrorMessages: { [status: number]: string } = {};
  private logger: Logger;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    if (config.headers) {
      this.headers = config.headers;
    }
    if (config.cache) {
      this.defaultCache = config.cache;
    }
    if (config.customErrorMessages) {
      this.customErrorMessages = config.customErrorMessages;
    }
    this.logger = config.logger || new ConsoleLogger();
  }

  private async request<T, P = {}, B = {}>(
    url: string,
    options: RequestInit,
    config?: RequestConfig<P, B>,
  ): Promise<T> {
    const queryString = config?.params ? this.buildQueryString(config.params) : '';
    const fullUrl = this.baseUrl + url + queryString;

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...this.headers,
        ...config?.headers,
        ...options.headers,
      },
      cache: config?.cache || this.defaultCache,
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      const displayErrorMessage =
        this.customErrorMessages[response.status] || this.defaultErrorMessage(response.status);
      let errorMessage = displayErrorMessage;
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } else {
        errorMessage = (await response.text()) || errorMessage;
      }

      this.logger.log(`Error ${response.status}: ${errorMessage}`);
      throw new Error(displayErrorMessage);
    }

    if (contentType?.includes('application/json')) {
      return response.json();
    } else if (contentType?.includes('text')) {
      return response.text() as unknown as T;
    } else {
      return response.blob() as unknown as T;
    }
  }

  private serializeBody(body: any): string {
    return JSON.stringify(body);
  }

  private buildQueryString(params: { [key: string]: any }): string {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `?${queryString}` : '';
  }

  private defaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 402:
        return 'Payment Required';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 405:
        return 'Method Not Allowed';
      case 406:
        return 'Not Acceptable';
      case 407:
        return 'Proxy Authentication Required';
      case 408:
        return 'Request Timeout';
      case 409:
        return 'Conflict';
      case 410:
        return 'Gone';
      case 411:
        return 'Length Required';
      case 412:
        return 'Precondition Failed';
      case 413:
        return 'Payload Too Large';
      case 414:
        return 'URI Too Long';
      case 415:
        return 'Unsupported Media Type';
      case 416:
        return 'Range Not Satisfiable';
      case 417:
        return 'Expectation Failed';
      case 421:
        return 'Misdirected Request';
      case 422:
        return 'Unprocessable Entity';
      case 423:
        return 'Locked';
      case 424:
        return 'Failed Dependency';
      case 425:
        return 'Too Early';
      case 426:
        return 'Upgrade Required';
      case 428:
        return 'Precondition Required';
      case 429:
        return 'Too Many Requests';
      case 431:
        return 'Request Header Fields Too Large';
      case 451:
        return 'Unavailable For Legal Reasons';
      default:
        return 'An error occurred';
    }
  }

  public static create(config: HttpClientConfig): HttpClient {
    return new HttpClient(config);
  }

  public setHeaders(headers: HeadersInit): void {
    this.headers = headers;
  }

  public get<T, P = {}>(url: string, config?: RequestConfig<P>): Promise<T> {
    return this.request<T, P>(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      config,
    );
  }

  public post<T, B = {}>(url: string, config?: RequestConfig<{}, B>): Promise<T> {
    return this.request<T, {}, B>(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: config?.body ? this.serializeBody(config.body) : undefined,
      },
      config,
    );
  }

  public put<T, B = {}>(url: string, config?: RequestConfig<{}, B>): Promise<T> {
    return this.request<T, {}, B>(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: config?.body ? this.serializeBody(config.body) : undefined,
      },
      config,
    );
  }

  public patch<T, B = {}>(url: string, config?: RequestConfig<{}, B>): Promise<T> {
    return this.request<T, {}, B>(
      url,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: config?.body ? this.serializeBody(config.body) : undefined,
      },
      config,
    );
  }

  public delete<T, P = {}>(url: string, config?: RequestConfig<P>): Promise<T> {
    return this.request<T, P>(
      url,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      config,
    );
  }
}

export { HttpClient, type HttpClientConfig, type RequestConfig, type Logger, ConsoleLogger };

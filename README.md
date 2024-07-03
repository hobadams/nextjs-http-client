# HttpClient

A TypeScript `HttpClient` class for making HTTP requests with configurable base URL, headers, cache options, and more.

- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
  - [Creating an Instance](#creating-an-instance)
  - [Making GET Requests](#making-get-requests)
  - [Making POST Requests](#making-post-requests)
  - [Making PUT Requests](#making-put-requests)
  - [Making PATCH Requests](#making-patch-requests)
  - [Making DELETE Requests](#making-delete-requests)
  - [Handling Errors](#handling-errors)
- [Logger](#logger)
  - [Custom Logger](#custom-logger)
- [API](#api)
  - [HttpClient.create(config)](#httpclientcreateconfig)
  - [Methods](#methods)

## Motivation

TBC

## Installation

```sh
npm install @hobadams/nextjs-http-client
```

## Usage

### Creating an Instance

To create an instance of `HttpClient`, use the `create` method with a configuration object:

```typescript
import {HttpClient} from './HttpClient'

const apiClient = HttpClient.create({
  baseUrl: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer your_token',
    'Custom-Header': 'CustomValue',
  },
  cache: 'no-store',
})
```

### Making GET Requests

You can make a GET request with query parameters, headers, and cache options:

```typescript
apiClient
  .get('/endpoint', {
    params: {key: 'value', anotherKey: 'anotherValue'},
    headers: {'Another-Header': 'AnotherValue'},
    cache: 'force-cache',
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error))
```

### Making POST Requests

You can make a POST request with a JSON body, headers, and cache options:

```typescript
apiClient
  .post('/endpoint', {
    body: {key: 'value'},
    headers: {'Another-Header': 'AnotherValue'},
    cache: 'reload',
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error))
```

### Making PUT Requests

You can make a PUT request with a JSON body, headers, and cache options:

```typescript
apiClient
  .put('/endpoint', {
    body: {key: 'value'},
    headers: {'Another-Header': 'AnotherValue'},
    cache: 'no-cache',
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error))
```

### Making PATCH Requests

You can make a PATCH request with a JSON body, headers, and cache options:

```typescript
apiClient
  .patch('/endpoint', {
    body: {key: 'value'},
    headers: {'Another-Header': 'AnotherValue'},
    cache: 'no-cache',
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error))
```

### Making DELETE Requests

You can make a DELETE request with query parameters, headers, and cache options:

```typescript
apiClient
  .delete('/endpoint', {
    params: {key: 'value'},
    headers: {'Another-Header': 'AnotherValue'},
    cache: 'reload',
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error))
```

### Handling Errors

Errors are thrown when the response status is not in the range 200-299. You can catch and handle these errors:

```typescript
apiClient
  .get('/non-existent-endpoint')
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message))
```

## Logger

The HttpClient class allows for custom logging of errors through the logger property. A default ConsoleLogger is provided, but you can implement your own logger by extending the Logger interface.

### Custom Logger

To implement a custom logger, create a class that implements the Logger interface and override the log method:

```typescript
import {Logger} from './HttpClient'

class CustomLogger implements Logger {
  log(message: string): void {
    // Custom logging logic
    console.log('Custom log:', message)
  }
}

const apiClient = HttpClient.create({
  baseUrl: 'https://api.example.com',
  logger: new CustomLogger(),
})
```

## API

### HttpClient.create(config)

Creates an instance of `HttpClient`.

- `config`: An object containing the following properties:
  - `baseUrl`: The base URL for all requests.
  - `headers` (optional): Default headers to include with every request.
  - `cache` (optional): Default cache option for all requests.

### Methods

#### get<T, P = {}>(url: string, config?: RequestConfig<P>)

Makes a GET request.

- `url`: The endpoint URL.
- `config` (optional): An object containing the following properties:
  - `params` (optional): Query parameters as an object.
  - `headers` (optional): Additional headers for this request.
  - `cache` (optional): Cache option for this request.

#### post<T, B = {}>(url: string, config?: RequestConfig<{}, B>)

Makes a POST request.

- `url`: The endpoint URL.
- `config` (optional): An object containing the following properties:
  - `body` (optional): Request body as an object.
  - `headers` (optional): Additional headers for this request.
  - `cache` (optional): Cache option for this request.

#### put<T, B = {}>(url: string, config?: RequestConfig<{}, B>)

Makes a PUT request.

- `url`: The endpoint URL.
- `config` (optional): An object containing the following properties:
  - `body` (optional): Request body as an object.
  - `headers` (optional): Additional headers for this request.
  - `cache` (optional): Cache option for this request.

#### patch<T, B = {}>(url: string, config?: RequestConfig<{}, B>)

Makes a PATCH request.

- `url`: The endpoint URL.
- `config` (optional): An object containing the following properties:
  - `body` (optional): Request body as an object.
  - `headers` (optional): Additional headers for this request.
  - `cache` (optional): Cache option for this request.

#### delete<T, P = {}>(url: string, config?: RequestConfig<P>)

Makes a DELETE request.

- `url`: The endpoint URL.
- `config` (optional): An object containing the following properties:
  - `params` (optional): Query parameters as an object.
  - `headers` (optional): Additional headers for this request.
  - `cache` (optional): Cache option for this request.

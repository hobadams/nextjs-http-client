# Next JS Http Client

[!WARNING] This is a new package and should not be used in production without heavy testing. [!WARNING]

A TypeScript `HttpClient` class for making HTTP requests with configurable base URL, headers, cache options, and more.
This acts as a wrapper around fetch.

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

The primary motivation for creating this fetch wrapper stems from the limitations and challenges associated with using the native fetch API for HTTP requests. While fetch is a powerful tool, it is also quite low-level and requires a significant amount of boilerplate code to handle common tasks and edge cases. This often results in repetitive and error-prone code, particularly when handling complex error scenarios, different response types, and constructing query parameters. Here are some of the key issues that this fetch wrapper aims to address:

- **Boilerplate Code:** Using the native fetch API involves writing a lot of boilerplate code for tasks such as setting up headers, parsing JSON responses, and handling errors. This can be tedious and can lead to inconsistent implementations across different parts of an application.

- **Lack of Type Safety:** The fetch API is not typed, which can lead to runtime errors and makes it difficult to work with in TypeScript projects. This wrapper introduces type safety, helping developers catch errors at compile time and providing better tooling support.

- **Error Handling:** The native fetch API does not throw errors for HTTP status codes in the 4xx or 5xx range, requiring additional code to handle these scenarios. This wrapper provides a more intuitive way to manage HTTP errors, ensuring that they are caught and handled appropriately.

- **Response Type Uncertainty:** With fetch, you often need to determine the response type (e.g., JSON, text, blob) manually. This wrapper abstracts away this complexity by automatically parsing the response based on the content type.

- **Query Parameter Handling:** Constructing URLs with query parameters using fetch can be cumbersome, especially when dealing with complex objects. This wrapper simplifies this process by allowing developers to pass an object of query parameters, which it then converts to a properly formatted query string.

- **Error Response Formats:** Errors returned by APIs can vary in format, sometimes being JSON and other times plain text. This wrapper standardizes error handling, making it easier to parse and manage different error response formats.

By addressing these challenges, this fetch wrapper aims to provide a more streamlined, type-safe, and user-friendly way to perform HTTP requests in JavaScript and TypeScript projects. It simplifies the development process, reduces boilerplate code, and helps ensure that applications are more robust and maintainable.

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

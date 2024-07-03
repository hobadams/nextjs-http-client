import {HttpClient, RequestConfig, Logger} from '../src/HttpClient'

class TestLogger implements Logger {
  public logMessages: string[] = []

  log(message: string): void {
    this.logMessages.push(message)
  }
}

global.fetch = jest.fn()

describe('HttpClient', () => {
  const baseUrl = 'https://api.example.com'
  const defaultHeaders = {
    Authorization: 'Bearer your_token',
    'Custom-Header': 'CustomValue',
  }
  const customErrorMessages = {
    404: 'The resource was not found.',
    500: 'Internal server error occurred.',
  }

  const mockResponse = (status: number, statusText: string, response: any) => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status: status,
      statusText: statusText,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(response),
      blob: () => Promise.resolve(new Blob([response])),
      headers: {
        get: (header: string) => {
          if (header === 'Content-Type') return 'application/json'
          return null
        },
      },
    })
  }

  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should make a GET request with query parameters', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      mockResponse(200, 'OK', {key: 'value'})
    )

    const apiClient = HttpClient.create({
      baseUrl,
      headers: defaultHeaders,
      cache: 'default',
    })

    const config: RequestConfig<{key: string; anotherKey: string}> = {
      params: {key: 'value', anotherKey: 'anotherValue'},
      cache: 'force-cache',
    }

    const response = await apiClient.get('/endpoint', config)

    expect(response).toEqual({key: 'value'})
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/endpoint?key=value&anotherKey=anotherValue`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining(defaultHeaders),
        cache: 'force-cache',
      })
    )
  })

  it('should make a POST request with a JSON body', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      mockResponse(200, 'OK', {success: true})
    )

    const apiClient = HttpClient.create({
      baseUrl,
      headers: defaultHeaders,
      cache: 'default',
    })

    const config: RequestConfig<{}, {key: string}> = {
      body: {key: 'value'},
      cache: 'no-cache',
    }

    const response = await apiClient.post('/endpoint', config)

    expect(response).toEqual({success: true})
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/endpoint`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining(defaultHeaders),
        body: JSON.stringify({key: 'value'}),
        cache: 'no-cache',
      })
    )
  })

  it('should make a PUT request with a JSON body', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      mockResponse(200, 'OK', {success: true})
    )

    const apiClient = HttpClient.create({
      baseUrl,
      headers: defaultHeaders,
      cache: 'default',
    })

    const config: RequestConfig<{}, {key: string}> = {
      body: {key: 'value'},
      cache: 'no-cache',
    }

    const response = await apiClient.put('/endpoint', config)

    expect(response).toEqual({success: true})
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/endpoint`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining(defaultHeaders),
        body: JSON.stringify({key: 'value'}),
        cache: 'no-cache',
      })
    )
  })

  it('should make a DELETE request', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      mockResponse(200, 'OK', {success: true})
    )

    const apiClient = HttpClient.create({
      baseUrl,
      headers: defaultHeaders,
      cache: 'default',
    })

    const config: RequestConfig<{key: string}> = {
      params: {key: 'value'},
      cache: 'reload',
    }

    const response = await apiClient.delete('/endpoint', config)

    expect(response).toEqual({success: true})
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/endpoint?key=value`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining(defaultHeaders),
        cache: 'reload',
      })
    )
  })

  it('should handle errors correctly with default messages', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      mockResponse(404, 'Not Found', {message: 'Not Found'})
    )

    const apiClient = HttpClient.create({
      baseUrl,
      headers: defaultHeaders,
      cache: 'default',
    })

    await expect(apiClient.get('/endpoint')).rejects.toThrow('Not Found')
  })

  it('should handle errors correctly with custom messages', async () => {
    const testLogger = new TestLogger()
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      mockResponse(404, 'Not Found', {message: 'Not Found'})
    )

    const apiClient = HttpClient.create({
      baseUrl,
      headers: defaultHeaders,
      cache: 'default',
      customErrorMessages,
      logger: testLogger,
    })

    await expect(apiClient.get('/endpoint')).rejects.toThrow(
      'The resource was not found.'
    )
    expect(testLogger.logMessages).toContain('Error 404: Not Found')
  })

  it('should call the logger when there is an error', async () => {
    const testLogger = new TestLogger()
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      mockResponse(500, 'Internal Server Error', {
        message: 'Internal Server Error',
      })
    )

    const apiClient = HttpClient.create({
      baseUrl,
      headers: defaultHeaders,
      cache: 'default',
      customErrorMessages,
      logger: testLogger,
    })

    await expect(apiClient.get('/endpoint')).rejects.toThrow(
      'Internal server error occurred.'
    )
    expect(testLogger.logMessages).toContain('Error 500: Internal Server Error')
  })
})

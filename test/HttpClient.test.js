"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpClient_1 = require("../src/HttpClient");
class TestLogger {
    constructor() {
        this.logMessages = [];
    }
    log(message) {
        this.logMessages.push(message);
    }
}
global.fetch = jest.fn();
describe('HttpClient', () => {
    const baseUrl = 'https://api.example.com';
    const defaultHeaders = {
        Authorization: 'Bearer your_token',
        'Custom-Header': 'CustomValue',
    };
    const customErrorMessages = {
        404: 'The resource was not found.',
        500: 'Internal server error occurred.',
    };
    const mockResponse = (status, statusText, response) => {
        return Promise.resolve({
            ok: status >= 200 && status < 300,
            status: status,
            statusText: statusText,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve(response),
            blob: () => Promise.resolve(new Blob([response])),
            headers: {
                get: (header) => {
                    if (header === 'Content-Type')
                        return 'application/json';
                    return null;
                },
            },
        });
    };
    beforeEach(() => {
        ;
        global.fetch.mockClear();
    });
    it('should make a GET request with query parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        global.fetch.mockImplementation(() => mockResponse(200, 'OK', { key: 'value' }));
        const apiClient = HttpClient_1.HttpClient.create({
            baseUrl,
            headers: defaultHeaders,
            cache: 'default',
        });
        const config = {
            params: { key: 'value', anotherKey: 'anotherValue' },
            cache: 'force-cache',
        };
        const response = yield apiClient.get('/endpoint', config);
        expect(response).toEqual({ key: 'value' });
        expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/endpoint?key=value&anotherKey=anotherValue`, expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining(defaultHeaders),
            cache: 'force-cache',
        }));
    }));
    it('should make a POST request with a JSON body', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        global.fetch.mockImplementation(() => mockResponse(200, 'OK', { success: true }));
        const apiClient = HttpClient_1.HttpClient.create({
            baseUrl,
            headers: defaultHeaders,
            cache: 'default',
        });
        const config = {
            body: { key: 'value' },
            cache: 'no-cache',
        };
        const response = yield apiClient.post('/endpoint', config);
        expect(response).toEqual({ success: true });
        expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/endpoint`, expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining(defaultHeaders),
            body: JSON.stringify({ key: 'value' }),
            cache: 'no-cache',
        }));
    }));
    it('should make a PUT request with a JSON body', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        global.fetch.mockImplementation(() => mockResponse(200, 'OK', { success: true }));
        const apiClient = HttpClient_1.HttpClient.create({
            baseUrl,
            headers: defaultHeaders,
            cache: 'default',
        });
        const config = {
            body: { key: 'value' },
            cache: 'no-cache',
        };
        const response = yield apiClient.put('/endpoint', config);
        expect(response).toEqual({ success: true });
        expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/endpoint`, expect.objectContaining({
            method: 'PUT',
            headers: expect.objectContaining(defaultHeaders),
            body: JSON.stringify({ key: 'value' }),
            cache: 'no-cache',
        }));
    }));
    it('should make a DELETE request', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        global.fetch.mockImplementation(() => mockResponse(200, 'OK', { success: true }));
        const apiClient = HttpClient_1.HttpClient.create({
            baseUrl,
            headers: defaultHeaders,
            cache: 'default',
        });
        const config = {
            params: { key: 'value' },
            cache: 'reload',
        };
        const response = yield apiClient.delete('/endpoint', config);
        expect(response).toEqual({ success: true });
        expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/endpoint?key=value`, expect.objectContaining({
            method: 'DELETE',
            headers: expect.objectContaining(defaultHeaders),
            cache: 'reload',
        }));
    }));
    it('should handle errors correctly with default messages', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        global.fetch.mockImplementation(() => mockResponse(404, 'Not Found', { message: 'Not Found' }));
        const apiClient = HttpClient_1.HttpClient.create({
            baseUrl,
            headers: defaultHeaders,
            cache: 'default',
        });
        yield expect(apiClient.get('/endpoint')).rejects.toThrow('Not Found');
    }));
    it('should handle errors correctly with custom messages', () => __awaiter(void 0, void 0, void 0, function* () {
        const testLogger = new TestLogger();
        global.fetch.mockImplementation(() => mockResponse(404, 'Not Found', { message: 'Not Found' }));
        const apiClient = HttpClient_1.HttpClient.create({
            baseUrl,
            headers: defaultHeaders,
            cache: 'default',
            customErrorMessages,
            logger: testLogger,
        });
        yield expect(apiClient.get('/endpoint')).rejects.toThrow('The resource was not found.');
        expect(testLogger.logMessages).toContain('Error 404: Not Found');
    }));
    it('should call the logger when there is an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const testLogger = new TestLogger();
        global.fetch.mockImplementation(() => mockResponse(500, 'Internal Server Error', {
            message: 'Internal Server Error',
        }));
        const apiClient = HttpClient_1.HttpClient.create({
            baseUrl,
            headers: defaultHeaders,
            cache: 'default',
            customErrorMessages,
            logger: testLogger,
        });
        yield expect(apiClient.get('/endpoint')).rejects.toThrow('Internal server error occurred.');
        expect(testLogger.logMessages).toContain('Error 500: Internal Server Error');
    }));
});

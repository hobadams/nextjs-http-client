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
exports.ConsoleLogger = exports.HttpClient = void 0;
class ConsoleLogger {
    log(message) {
        console.error(message);
    }
}
exports.ConsoleLogger = ConsoleLogger;
class HttpClient {
    constructor(config) {
        this.headers = {};
        this.defaultCache = 'default';
        this.customErrorMessages = {};
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
    request(url, options, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = (config === null || config === void 0 ? void 0 : config.params)
                ? this.buildQueryString(config.params)
                : '';
            const fullUrl = this.baseUrl + url + queryString;
            const response = yield fetch(fullUrl, Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign(Object.assign({}, this.headers), config === null || config === void 0 ? void 0 : config.headers), options.headers), cache: (config === null || config === void 0 ? void 0 : config.cache) || this.defaultCache }));
            const contentType = response.headers.get('Content-Type');
            if (!response.ok) {
                const displayErrorMessage = this.customErrorMessages[response.status] ||
                    this.defaultErrorMessage(response.status);
                let errorMessage = displayErrorMessage;
                if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
                    const error = yield response.json();
                    errorMessage = error.message || errorMessage;
                }
                else {
                    errorMessage = (yield response.text()) || errorMessage;
                }
                this.logger.log(`Error ${response.status}: ${errorMessage}`);
                throw new Error(displayErrorMessage);
            }
            if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
                return response.json();
            }
            else if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('text')) {
                return response.text();
            }
            else {
                return response.blob();
            }
        });
    }
    serializeBody(body) {
        return JSON.stringify(body);
    }
    buildQueryString(params) {
        const queryString = new URLSearchParams(params).toString();
        return queryString ? `?${queryString}` : '';
    }
    defaultErrorMessage(status) {
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
            case 500:
                return 'Internal Service Error';
            case 501:
                return 'Not Implemented';
            case 502:
                return 'Bad Gateway';
            case 503:
                return 'Service Unavailable';
            case 504:
                return 'Gateway Timeout';
            default:
                return 'An error occurred';
        }
    }
    static create(config) {
        return new HttpClient(config);
    }
    setHeaders(headers) {
        this.headers = headers;
    }
    get(url, config) {
        return this.request(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }, config);
    }
    post(url, config) {
        return this.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: (config === null || config === void 0 ? void 0 : config.body) ? this.serializeBody(config.body) : undefined,
        }, config);
    }
    put(url, config) {
        return this.request(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: (config === null || config === void 0 ? void 0 : config.body) ? this.serializeBody(config.body) : undefined,
        }, config);
    }
    patch(url, config) {
        return this.request(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: (config === null || config === void 0 ? void 0 : config.body) ? this.serializeBody(config.body) : undefined,
        }, config);
    }
    delete(url, config) {
        return this.request(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }, config);
    }
}
exports.HttpClient = HttpClient;

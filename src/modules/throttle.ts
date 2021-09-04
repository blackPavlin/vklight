/*
    eslint-disable @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-misused-promises,
    @typescript-eslint/no-explicit-any
*/
import { ParsedUrlQueryInput } from 'querystring';
import Request from './request';

export type ThrottleOptions = {
	executeON?: boolean; // default: true
	throttleInterval?: number; // default: 50
};

export type DefaultOptions = {
	token: string;
	lang: string;
	version: string;
};

type RequestQuery = {
	method: string;
	params?: ParsedUrlQueryInput;
	resolve: (value: any | PromiseLike<any>) => void;
	reject: (reason?: any) => void;
};

export default class Throttle {
	constructor(
		private readonly _request: Request,
		private readonly _defaultOptions: DefaultOptions,
		options?: ThrottleOptions,
	) {
		this._executeON = options?.executeON ?? true;
		this._throttleInterval = options?.throttleInterval || 50;
	}

	private readonly _baseURL = 'https://api.vk.com/method/';

	private readonly _executeON: boolean;

	private readonly _throttleInterval: number;

	private _throttlerSleep = true;

	private _requestQueue: RequestQuery[] = [];

	public async setQuery<R>(method: string, params?: ParsedUrlQueryInput): Promise<R> {
		return new Promise((resolve, reject) => {
			this._requestQueue.push({
				method,
				params,
				resolve,
				reject,
			});

			if (this._throttlerSleep) {
				this._throttler();
			}
		});
	}

	private _throttler(): void {
		const timerID = setInterval(async (): Promise<void> => {
			if (this._requestQueue.length === 0) {
				this._throttlerSleep = true;
				clearInterval(timerID);

				return;
			}

			this._throttlerSleep = false;

			if (this._executeON) {
				const queuePart = this._requestQueue.splice(0, 25);
				const path = this._baseURL + 'execute';

				const code =
					'return [' +
					queuePart.reduce(
						(chunk, { method, params }) =>
							chunk + `API.${method}(${params ? JSON.stringify(params) : ''})` + ',',
						'',
					) +
					'];';

				try {
					const { response, execute_errors, error } = await this._request.post(path, {
						access_token: this._defaultOptions.token,
						lang: this._defaultOptions.lang,
						v: this._defaultOptions.version,
						code,
					});

					if (error) {
						throw error;
					}

					for (let i = 0, k = 0; i < response.length; i += 1) {
						const { resolve, reject } = queuePart[i];
						response[i] !== false ? resolve(response[i]) : reject(execute_errors[k++]);
					}
				} catch (error) {
					for (let i = 0; i < queuePart.length; i += 1) {
						queuePart[i].reject(error);
					}
				}
			} else {
				const [{ method, params, resolve, reject }] = this._requestQueue.splice(0, 1);
				const path = this._baseURL + method;

				try {
					const { response, error } = await this._request.post(path, {
						access_token: this._defaultOptions.token,
						lang: this._defaultOptions.lang,
						v: this._defaultOptions.version,
						...params,
					});

					response ? resolve(response) : reject(error);
				} catch (error) {
					reject(error);
				}
			}
		}, this._throttleInterval);
	}
}

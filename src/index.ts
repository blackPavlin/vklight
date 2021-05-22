import { ParsedUrlQueryInput } from 'querystring';
import Request, { RequestOptions } from './modules/request';
import Throttle, { DefaultOptions, ThrottleOptions } from './modules/throttle';
import Upload from './modules/upload';

export type Options = {
	accessToken: string;
	lang?: string;
	request?: RequestOptions;
	throttle?: ThrottleOptions;
};

export default class VK {
	constructor(options: Options) {
		if (typeof options !== 'object') {
			throw new TypeError('Options must be an object');
		}

		const defaultOptions: DefaultOptions = {
			accessToken: options.accessToken,
			lang: options.lang || 'ru',
			version: '5.130',
		};

		this._request = new Request(options.request);
		this._throttle = new Throttle(this._request, defaultOptions, options.throttle);
		this.upload = new Upload(this._request, this._throttle);
	}

	private _request: Request;

	private _throttle: Throttle;

	public api<R>(method: string, params?: ParsedUrlQueryInput): Promise<R> {
		return this._throttle.setQuery(method, params);
	}

	public upload: Upload;
}

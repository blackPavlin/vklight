import qs, { ParsedUrlQueryInput } from 'querystring';
import got, { OptionsOfJSONResponseBody } from 'got';
import FormData from 'form-data';

export type RequestOptions = Omit<
	OptionsOfJSONResponseBody,
	'body' | 'headers' | 'method' | 'responseType'
>;

export default class Request {
	constructor(private readonly _options?: RequestOptions) {}

	public objectToFormData(object: Record<string, unknown>): FormData {
		const formData = new FormData();

		for (const [key, value] of Object.entries(object)) {
			formData.append(key, value);
		}

		return formData;
	}

	public async post<R>(
		path: string,
		params?: ParsedUrlQueryInput,
		formData?: FormData,
	): Promise<R> {
		const response = await got.post<R>(path, {
			body: formData ? formData : qs.stringify(params),
			headers: formData
				? formData.getHeaders()
				: {
						'content-type': 'application/x-www-form-urlencoded',
				  },
			responseType: 'json',
			...this._options,
		});

		return response.body;
	}
}

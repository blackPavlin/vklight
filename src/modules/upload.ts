import { ReadStream } from 'fs';
import Request from './request';
import Throttle from './throttle';
import {
	PhotosPhoto,
	PhotosPhotoUpload,
	BaseImage,
	BaseUploadServer,
	PhotosGetOwnerCoverPhotoUploadServerParams,
	PhotosSaveMessagesPhotoParams,
	PhotosSaveOwnerCoverPhotoParams,
	DocsSaveParams,
	DocsSaveResponse,
	DocsGetMessagesUploadServerParams,
} from '@vkontakte/api-schema-typescript';

type WrapperType<I> = {
	[K in keyof I]: I[K];
};

export default class Upload {
	constructor(private readonly _request: Request, private readonly _throttle: Throttle) {}

	public async photoMessages(
		file: ReadStream | Buffer,
		params?: { peer_id?: number },
	): Promise<PhotosPhoto[]> {
		const response = await this._throttle.setQuery<PhotosPhotoUpload>(
			'photos.getMessagesUploadServer',
			params,
		);

		const saveData = await this._request.post<WrapperType<PhotosSaveMessagesPhotoParams>>(
			response.upload_url,
			undefined,
			this._request.objectToFormData({ photo: file }),
		);

		return this._throttle.setQuery<PhotosPhoto[]>('photos.saveMessagesPhoto', saveData);
	}

	public async photoOwnerCover(
		file: ReadStream | Buffer,
		params?: WrapperType<PhotosGetOwnerCoverPhotoUploadServerParams>,
	): Promise<BaseImage[]> {
		const response = await this._throttle.setQuery<BaseUploadServer>(
			'photos.getOwnerCoverPhotoUploadServer',
			params,
		);

		const saveData = await this._request.post<WrapperType<PhotosSaveOwnerCoverPhotoParams>>(
			response.upload_url,
			undefined,
			this._request.objectToFormData({ photo: file }),
		);

		return this._throttle.setQuery<BaseImage[]>('photos.saveOwnerCoverPhoto', saveData);
	}

	public async docsWall(
		file: ReadStream | Buffer,
		params: { group_id: number },
	): Promise<DocsSaveResponse> {
		const response = await this._throttle.setQuery<BaseUploadServer>(
			'docs.getWallUploadServe',
			params,
		);

		const saveData = await this._request.post<WrapperType<DocsSaveParams>>(
			response.upload_url,
			undefined,
			this._request.objectToFormData({ file }),
		);

		return this._throttle.setQuery<DocsSaveResponse>('docs.save', saveData);
	}

	public async docsMessages(
		file: ReadStream | Buffer,
		params?: WrapperType<DocsGetMessagesUploadServerParams>,
	): Promise<DocsSaveResponse> {
		const response = await this._throttle.setQuery<BaseUploadServer>(
			'docs.getWallUploadServe',
			params,
		);

		const saveData = await this._request.post<WrapperType<DocsSaveParams>>(
			response.upload_url,
			undefined,
			this._request.objectToFormData({ file }),
		);

		return this._throttle.setQuery<DocsSaveResponse>('docs.save', saveData);
	}
}

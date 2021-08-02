import { existsSync, mkdirSync } from "fs";

import { ApiError } from "../../util/errors";
import { Controller } from "../controller";
import { UploadedFile } from "express-fileupload";
import { join } from "path";
import { last } from "lodash";

export default class UploadAvatarController extends Controller {

	public authorize() {
		return true;
	}

	public async handle() {
		if(!this.req.files) {
			return new ApiError('invalid-request', 'Invalid avatar');
		}

		const file = this.req.files.file as UploadedFile;
		const md5 = file.md5;

		const bucket = md5.substr(0, 2);
		const extension = last(file.name.split(/\./g));
		const fileName = `${md5}.${extension}`;

		const bucketLocation = join('data/public/avatar', bucket);
		const fileLocation = join(bucketLocation, fileName);

		if(!existsSync(bucketLocation)) {
			mkdirSync(bucketLocation, { recursive: true });
		}
		
		this.user.avatar = join('/data/avatar', bucket, fileName);

		await file.mv(fileLocation);
		await this.user.save();

		return Promise.resolve('handling avatar');
	}

}
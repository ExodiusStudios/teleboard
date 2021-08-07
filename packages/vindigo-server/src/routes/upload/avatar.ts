import { basename, dirname, join } from "path";
import { bucketPath, saveToBucket } from "../../util/helpers";
import { readdirSync, rmdirSync, unlinkSync } from "fs";

import { ApiError } from "../../util/errors";
import { Controller } from "../controller";
import { UploadedFile } from "express-fileupload";

export default class UploadAvatarController extends Controller {

	public authorize() {
		return true;
	}

	public async handle() {
		if(!this.req.files || !this.req.files.file) {
			return new ApiError('invalid-request', 'Invalid avatar');
		}

		// delete old profile picture if they have one
		const old = this.user.avatar;

		if(old) {
			const oldFile = basename(old);
			const oldPath = join('./data/public/avatar', `${oldFile.substr(0, 2)}`, oldFile);
			const oldDir = dirname(oldPath);

			unlinkSync(oldPath);

			// delete folder if its now empty
			if(readdirSync(oldDir).length < 1) {
				rmdirSync(oldDir);
			}
		}

		const file = this.req.files.file as UploadedFile;
		await saveToBucket('./data/public/avatar', file);
	
		this.user.avatar = join('/data/avatar', bucketPath(file));

		await this.user.save();

		return Promise.resolve('handling avatar');
	}

}
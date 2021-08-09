import { basename, dirname, join } from "path";
import { readdirSync, rmdirSync, unlinkSync } from "fs";

import { ApiError } from "../../util/errors";
import { Controller } from "../controller";
import { UploadedFile } from "express-fileupload";
import { database } from "../..";
import BucketStorage from "../../util/bucket";

export const AVATAR_SYSTEM_PATH = "./data/public/avatar";
export const AVATAR_PUBLIC_PATH = ""

export class UploadAvatarController extends Controller {

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
			const oldPath = join(AVATAR_SYSTEM_PATH, `${oldFile.substr(0, 2)}`, oldFile);
			const oldDir = dirname(oldPath);

			unlinkSync(oldPath);

			// delete folder if its now empty
			if(readdirSync(oldDir).length < 1) {
				rmdirSync(oldDir);
			}
		}

		const avatarStorage = new BucketStorage(AVATAR_SYSTEM_PATH);
		const file = this.req.files.file as UploadedFile;

		await avatarStorage.file(file).save();

		await database.user.update({
			where: {
				id: this.user.id
			},
			data: {
				avatar: join(AVATAR_SYSTEM_PATH, avatarStorage.bucketPath)
			}
		});

		return Promise.resolve('handling avatar');
	}

}
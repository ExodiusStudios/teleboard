import { UploadedFile } from "express-fileupload";
import { existsSync, mkdirSync } from "fs";
import { last } from "lodash";
import { join } from "path";
import { User } from "../../models/user";
import { ApiError } from "../../util/errors";
import { Controller } from "../controller";

export default class UploadAvatarController extends Controller {

	private uploadPath = '/avatar';

	authorize() {
		return true;
	}

	async handle() {

		/**
		 * TODO
		 * verify + sanitize file inputs
		 * authorize user
		 * verify existence of target user
		 * 
		 * basically clean this up - very initial version
		 */
		

		if(!this.req.files) {
			return new ApiError('invalid-request', 'Invalid avatar');
		}

		const userID = this.req.params['id'];
		const user = await User.findOne(userID);
		const file = this.req.files.avatar as UploadedFile
		const md5 = file.md5;
		const filename = `${md5}.${last(file.name.split(/\./g))}`;
		const path = this.uploadPath.concat(`/${md5.substr(0, 2)}/`);
		const dest = join('./data/public', path, filename);

		if(!existsSync(path)) {
			mkdirSync(path, { recursive: true });
		}

		await file.mv(dest);

		user!.avatar = dest;
		await user?.save();
		

		return Promise.resolve('handling avatar');
	}

}
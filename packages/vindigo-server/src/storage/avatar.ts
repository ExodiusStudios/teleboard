import path, { join } from "path";

import BucketStorage from "../util/bucket";
import { User } from "@prisma/client";
import { database } from "..";
import { resolveData } from "../util/helpers";

const AVATAR_SYSTEM_PATH = resolveData("public/avatar/");
const AVATAR_PUBLIC_PATH = '/data/avatar/';

export default class AvatarStorage extends BucketStorage {

	public constructor() {
		super(AVATAR_SYSTEM_PATH);
	}

	/**
	 * Sets the currently loaded file as the profile picture for a user
	 * 
	 * @param user User for the 
	 */
	public async setAsAvatar(user: User) {
		const newPublicPath = join(AVATAR_PUBLIC_PATH, this.bucketPath)
			.split(path.sep)
			.join(path.posix.sep);

		// set as avatar in the database
		await database.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: newPublicPath
			}
		});

	}

}
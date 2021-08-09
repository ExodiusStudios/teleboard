import { User } from "@prisma/client";
import { readdirSync, rmdirSync, unlinkSync } from "fs";
import { basename, dirname, join } from "path";
import { database } from "..";
import BucketStorage from "../util/bucket";

const AVATAR_SYSTEM_PATH = join("./data/public/avatar/");
const AVATAR_PUBLIC_PATH = join("/data/avatar/");

export default class AvatarStorage extends BucketStorage {

	location = AVATAR_SYSTEM_PATH;

	/**
	 * Sets the currently loaded file as the profile picture for a user
	 * 
	 * @param user User for the 
	 */
	public async setAsAvatar(user: User) {

		// delete old profile picture if there is one
		const old = user.avatar;

		if(old) {

			const oldBucketPath = old.replace(AVATAR_PUBLIC_PATH, '');
			const oldSystemPath = join(AVATAR_SYSTEM_PATH, oldBucketPath);
			const oldDir = dirname(oldSystemPath);

			// check if for some reason the filename is the same
			// if it is, don't do the delete
			if(basename(this.bucketPath) == basename(oldBucketPath)) {
				return;
			}

			// delete
			unlinkSync(oldSystemPath);

			// delete folder if its now empty
			const bucketFiles = await readdirSync(oldDir);

			if(bucketFiles.length < 1) {
				await rmdirSync(oldDir);
			}

		}

		const newPublicPath = join(AVATAR_PUBLIC_PATH, this.bucketPath);

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
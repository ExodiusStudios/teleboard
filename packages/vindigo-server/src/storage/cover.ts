import path, { join } from "path";

import BucketStorage from "../util/bucket";
import { Project } from "@prisma/client";
import { database } from "..";

const COVER_SYSTEM_PATH = join("./data/public/cover/");
const COVER_PUBLIC_PATH = join("/data/cover/");

export default class CoverStorage extends BucketStorage {

	public constructor() {
		super(COVER_SYSTEM_PATH);
	}

	/**
	 * Sets the currently loaded file as the cover image of a project
	 * 
	 * @param project The project
	 */
	public async setCoverImage(project: Project) {
		const newPublicPath = join(COVER_PUBLIC_PATH, this.bucketPath)
			.split(path.sep)
			.join(path.posix.sep);

		// set as cover in the database
		await database.project.update({
			where: {
				id: project.id
			},
			data: {
				coverImage: newPublicPath
			}
		});

	}

}
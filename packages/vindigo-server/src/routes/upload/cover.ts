import { ApiError, InvalidArgumentError } from "../../util/errors";
import { Controller } from "../controller";
import { UploadedFile } from "express-fileupload";
import CoverStorage from "../../storage/cover";
import { database } from "../..";

export class UploadCoverController extends Controller {

	public authorize() {
		return true;
	}

	public async handle() {
		if(!this.req.files || !this.req.files.file) {
			return new ApiError('invalid-request', 'Invalid avatar');
		}

		const storage = new CoverStorage();
		const cover = this.req.files.file as UploadedFile;
		const id = parseInt(this.req.query['project'] as string);

		const project = await database.project.findUnique({
			where: { id }
		});

		if(!project) {
			return new InvalidArgumentError('Unknown project');
		}

		await storage.file(cover).save(); // save to the system
		await storage.setCoverImage(project); // set as the cover

		// return the public path of the new cover image;
		return project.coverImage;
	}

}
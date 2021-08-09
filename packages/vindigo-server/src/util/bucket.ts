import { UploadedFile } from "express-fileupload";
import { existsSync, mkdirSync } from "fs";
import { last } from "lodash";
import { dirname, join } from "path";

export default class BucketStorage {
	
	private location: string | undefined;
	private uploadedFile: UploadedFile;

	/**
	 * @param location System path for the bucket
	 */
	constructor(location: string | undefined) {
		this.location = location;
	}

	/**
	 * Loads a file into the bucket storage for later saving
	 * 
	 * @param file File to be loaded
	 */
	public file(file: UploadedFile) {
		this.uploadedFile = file;

		return this;
	}

	/**
	 * Returns Shorthand bucket path based on md5 hash of currently-loaded file
	 * 
	 * ex. "/32/3277f73cb2b1727a88a201691792d4ff.png"
	 */
	public get bucketPath(): string {

		const { md5, name } = this.uploadedFile;
		const ext = last(name.split(/\./g));
		const newName = `${md5}.${ext}`;
		const bucket = `${md5.substr(0, 2)}/${newName}`;

		return bucket;

	}

	/**
	 * Full system path of the loaded file
	 */
	public get fullPath(): string {
		if(!this.location) {
			throw new Error('No location provided in constructor');
		}
		
		const path = join(this.location, this.bucketPath);

		return path;
	}

	/**
	 * Saves the currently loaded file to the system
	 */
	public async save() {

		if(!existsSync(dirname(this.fullPath))) {
			mkdirSync(dirname(this.fullPath), { recursive: true });
		}

		await this.uploadedFile.mv(this.fullPath);

		return this;
	}

}
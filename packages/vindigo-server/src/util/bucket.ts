import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";

import { UploadedFile } from "express-fileupload";
import { last } from "lodash";

const ERROR_FILE_NOT_LOADED = new Error('No file is currently loaded. Use the file() method to do so.');

/**
 * Tool used to upload files to the system using the bucket path convention
 * 
 * @author Jackson Bean
 */
export default class BucketStorage {
	
	protected location: string | undefined;
	protected currentFile: UploadedFile | null;

	/**
	 * @param location System path for the bucket
	 */
	protected constructor(location?: string | undefined) {
		this.location = location;
	}

	/**
	 * Loads a file into the bucket storage for later manipulation
	 * 
	 * @param file File to be loaded
	 */
	public file(file: UploadedFile) {
		this.currentFile = file;

		return this;
	}

	/**
	 * Returns Shorthand bucket path based on md5 hash of currently-loaded file
	 * 
	 * ex. "/32/3277f73cb2b1727a88a201691792d4ff.png"
	 */
	public get bucketPath(): string {
		if(!this.currentFile) {
			throw ERROR_FILE_NOT_LOADED;
		}

		const { md5, name } = this.currentFile;
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
		if(!this.currentFile) {
			throw ERROR_FILE_NOT_LOADED;
		}

		if(!existsSync(dirname(this.fullPath))) {
			mkdirSync(dirname(this.fullPath), { recursive: true });
		}

		await this.currentFile.mv(this.fullPath);

		return this;
	}

}
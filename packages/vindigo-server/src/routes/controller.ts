import { Request, RequestHandler, Response } from "express";
import { ApiError, NoPermissionError } from "../util/errors";

/**
 * Contains logic for an individual API endpoint.
 * Handles main logic, as well as authorization for that endpoint.
 * 
 * @author Jackson Bean
 */
export abstract class Controller {

	/**
	 * The Express Request object to be used throughout the controller
	 */
	protected req: Request;

	/**
	 * The Express response object to be used throughout the controller
	 */
	protected res: Response;

	/**
	 * TODO Schema required for the use of this endpoint
	 */
	//protected abstract schema() : any

	/**
	 * Authorization code used to verify the user has permission for the route
	 * 
	 * @returns boolean depicting if authorization was successful
	 */
	protected abstract authorize() : boolean | Promise<boolean>

	/**
	 * Code that executes main route functions
	 * 
	 * @returns response to be sent back to the client
	 */
	protected abstract handle() : any | Promise<any>

	/**
	 * Returns an express RequestHandler for use on a router endpoint
	 * 
	 * @returns RequestHandler
	 */
	public build() : RequestHandler {

		return async (req: Request, res: Response) => {

			// assign request and response so authorize and handle can access them
			this.req = req;
			this.res = res;

			// authorize the call
			const authorized = await this.authorize();

			if(!authorized) return this.respond(new NoPermissionError());

			// handle call and respond with the appropriate value
			this.respond(await this.handle());
		}

	}

	/**
	 * Parses a JSON response and sends it back to the client
	 * @param value The data that will be sent
	 */
	private respond(value: any) {

		var response: {
			success?: boolean,
			code?: string,
			data?: any,
		} = {
			success: true,
			data: value
		};

		// add error information if something went wrong
		if(value instanceof ApiError) {
			response.code = value.code
			response.success = false
			response.data = null
		}

		this.res.json(response);

	}
}
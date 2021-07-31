/**
 * Thrown when an expected and handlable exception
 * was thrown from an API in order to signal an
 * error code for the client.
 */
export class ApiError extends Error {

	public code: string;

	public constructor(code: string, message?: string) {
		super(message);
		this.code = code;
		this.name = "ApiError";
	}

}

/**
 * Thrown when an operation expects an active session
 * but none was found.
 */
export class MissingSessionError extends ApiError {

	public constructor() {
		super('session-missing', 'An active session is required for this operation');
	}

}

/**
 * Thrown when a request for pagination exceeds the maximum
 * amount of items.
 */
export class PaginationOverflowError extends ApiError {

	public constructor(max: number) {
		super('pagination-overflow', `Cannot request more than ${max} entries`);
	}

}

/**
 * Thrown when a user provided argument is considered
 * invalid during validation.
 */
export class InvalidArgumentError extends ApiError {

	public constructor(msg: string) {
		super('invalid-argument', msg);
	}

}

/**
 * Thrown when an action fails due to the user lacking
 * the permission to do so.
 */
export class NoPermissionError extends ApiError {

	public constructor(msg?: string) {
		super('no-permission', msg || 'You cannot execute this operation');
	}

}

/**
 * Thrown when a feature has not yet been implemented
 * 
 * TODO Temporary! Remove all instances before v1 release
 */
export class NotImplementedError extends ApiError {

	public constructor() {
		super('not-implemented', 'This feature has not yet been implemented');
	}

}
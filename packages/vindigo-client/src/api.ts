import { Client, Sink, createClient } from 'graphql-ws';
import { DocumentNode, print } from "graphql";

import { Dictionary } from "vue-router/types/router";
import { logger } from './util';

type Headers = Dictionary<string>;

/**
 * The service in charge of connecting to the server
 */
export class APIService {

	private logger = logger('API', true);
	private uploadPath = 'http://localhost:8085/upload';
	private endpoint = '/graphql';
	private client?: Client;

	public constructor() {
		this.connect();
	}

	/**
	 * Returns whether the client is connected
	 */
	public get isConnected(): boolean {
		return !!this.client;
	
	}

	/**
	 * Upload the given file to the server as the
	 * specified type.
	 * 
	 * @param type The type of the file
	 * @param file The file binary data
	 * @param config Further upload configuration
	 * @returns The response
	 */
	public async upload(type: string, file: File, config?: QueryConfig): Promise<Response> {
		const endpoint = config?.endpoint ?? this.uploadPath;
		const formData = new FormData();

		formData.append('file', file);

		const response = await fetch(endpoint + '/' + type, {
			signal: config?.abort?.signal,
			method: 'POST',
			body: formData
		});

		if(response.status != 200) {
			throw new Error('Upload failure: ' + (response.statusText));
		}

		return response;
	}

	/**
	 * Executes the given query and returns the result
	 *
	 * @param query The query to execute
	 * @param variables The query variables
	 * @param config Further query configuration
	 * @returns Result
	 */
	public async query(query: DocumentNode, variables?: any, config?: QueryConfig) : Promise<any> {
		const endpoint = config?.endpoint ?? this.endpoint;
		const headers: Headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};

		this.logger('Executing query:', print(query));

		const response = await fetch(endpoint, {
			signal: config?.abort?.signal,
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				query: print(query),
				variables: variables || {}
			})
		}).then(res => res.json());

		if(response.error || response.errors) {
			throw new Error('API Query failure: ' + (response.error || JSON.stringify(response.errors)));
		} else {
			return response.data || {};
		}
	}

	/**
	 * Executes the given query and listens to the responses.
	 *
	 * @param query The query to execute
	 * @param variables The query variables
	 * @returns Subscription disposer
	 */
	public subscribe(query: DocumentNode, observer: Sink<any>, variables?: any) : () => void {
		if(!this.client) {
			throw new Error('Connection not established');
		}

		return this.client.subscribe({
			query: print(query),
			variables: variables
		}, {
			...observer,
			next(res: any) {
				if(res.error || res.errors) {
					const err = new Error('Query failed: ' + (res.error || JSON.stringify(res.errors)));
		
					if(observer.error) {
						observer.error?.(err);
					} else {
						throw err;
					}
				} else {
					observer.next?.(res.data);
				}
			}
		});
	}

	/**
	 * Connect to the API and open a socket
	 * for listening to subscriptions.
	 */
	public connect() {
		this.close();
		this.client = createClient({
			url: '/subscription'
		});
	}

	/**
	 * Close the API connection
	 */
	public close() {
		this.client?.dispose();
		this.client = undefined;
	}

}

/**
 * The config that may be passed to an API query
 */
export interface QueryConfig {
	endpoint?: string;
	abort?: AbortController
}
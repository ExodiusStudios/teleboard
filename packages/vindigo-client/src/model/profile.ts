/**
 * The publically available fields representing
 * a Vindigo user.
 */
export interface Profile {
	id: number
	avatar?: string
	fullName: string
	firstName: string
	email?: string
	username: string
	role: string
	createdAt: string
}
import { gql } from "graphql-tag";

/**
 * All fields on profile
 */
export const profileFragment = gql`
	fragment AllProfileFields on Profile {
		id
		email
		avatar
		username
		fullName
		firstName
		role
	}
`;

/**
 * All fields on team
 */
export const teamFragment = gql`
	fragment AllTeamFields on Team {
		id
		slug
		name
		description
		createdAt
		logoImage
		teamUrl
	}
`;

/**
 * The profile tile profile fragment
 */
export const projectTileFragment = gql`
	fragment ProjectTileFields on Project {
		id
		name
		coverImage
		projectUrl
	}
`;
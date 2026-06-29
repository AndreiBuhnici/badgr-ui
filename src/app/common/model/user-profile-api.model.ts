import {ApiEntityRef} from './entity-ref';

/**
 * Personal information about the current user from the API
 */
export interface ApiUserProfile {
	id: string,
	username: string,
	email: string,
	role: string
}
export interface UserProfileRef extends ApiEntityRef {}

export interface ExternalAuthProvider {
	slug: string;
	label: string;
	imgSrc: string;
	color: string;
}

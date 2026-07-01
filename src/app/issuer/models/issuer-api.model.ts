export type IssuerSlug = string;
export type IssuerUrl = string;

export interface IssuerRef {
	"@id": IssuerUrl;
	slug: IssuerSlug;
}

export interface ApiIssuerJsonld {
	'@context': string;
	type: string;
	id: IssuerUrl;

	name: string;
	description: string;
	email: string;
	url: string;
	image: string;
}

export interface ApiIssuer {
	id: string;
	name: string;
	did: string;
}

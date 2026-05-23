export interface ApiV2Wrapper<T> {
	result: T;
	signatureValid: boolean;

	revoked: boolean;
	revocationReason?: string;

	registryRevocationSynced?: boolean;
	registryRevocationError?: string;

	credentialBlockchainDataValid: boolean;

	signatureErrors?: string[];
	credentialErrors?: string[];
}
export interface ApiV2Wrapper<T> {
	result: T;
	signatureValid: boolean;

	revoked: boolean;
	revocationReason?: string;

	registryRevocationSynced?: boolean;
	registryRevocationError?: string;

	issuerBlockchainDataValid: boolean;
	credentialBlockchainDataValid: boolean;

	signatureErrors?: string[];
	issuerErrors?: string[];
	credentialErrors?: string[];
}

export interface VerificationResponse {
	signatureValid: boolean;
	revoked: boolean;
	credentialBlockchainDataValid: boolean;
}
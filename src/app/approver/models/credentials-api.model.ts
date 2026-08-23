export type ApprovalOperation = 'ISSUE' | 'REVOKE';

export type ApprovalStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED';

export type ExecutionStatus =
    | 'NOT_STARTED'
    | 'PENDING'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'SYNC_FAILED';

export interface ApiApprovalRecipient {
    identity: string;
    hashed: boolean;
    plaintextIdentity: string;
    type: string;
    salt?: string;
}

export interface ApiApprovalReviewer {
    entityId?: string;
    firstName: string;
    lastName: string;
    emails: unknown[];
    url: string[];
    telephone: string[];
    badgrDomain?: string;
}

export interface ApiApprovalBadgeInstance {
    entityId: string;
    entityType: string;

    acceptance: string;

    approvalOperation: ApprovalOperation;
    approvalOperationLabel: string;

    approvalStatus: ApprovalStatus;
    approvalStatusLabel: string;

    executionStatus: ExecutionStatus;
    executionStatusLabel: string;

    reviewedBy: ApiApprovalReviewer | null;
    reviewedAt: string | null;

    registryCredentialHash: string | null;

    registryIssuanceSynced: boolean;
    registryIssuanceError: string | null;

    registryRevocationSynced: boolean;
    registryRevocationError: string | null;

    registryConsistent: boolean;
    requiresRegistryRetry: boolean;
    canRetryIssuance: boolean;
    canRetryRevocation: boolean;

    badgeclass: string;
    badgeclassOpenBadgeId: string;

    issuer: string;
    issuerOpenBadgeId: string;
    issuerDID: string;
    issuerName: string;

    createdAt: string;
    createdBy: string;

    validFrom: string;
    validUntil: string | null;

    image: string;
    openBadgeId: string;

    revoked: boolean;
    revocationReason: string | null;

    narrative: string | null;

    recipient: ApiApprovalRecipient;
    evidence: unknown[];
}

export interface ApiRegistryRetryRequest {
    retryRegistryOperation: ApprovalOperation;
}
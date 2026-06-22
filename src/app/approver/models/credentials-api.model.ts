export interface ApiApprovalRecipient {
    identity: string;
    hashed: boolean;
    plaintextIdentity: string;
    type: string;
    salt?: string;
}

export interface ApiApprovalBadgeInstance {
    entityId: string;
    entityType: string;

    acceptance: string;
    approval_status: string;

    badgeclass: string;
    badgeclassOpenBadgeId: string;

    issuer: string;
    issuerOpenBadgeId: string;
    issuerDID: string;
    issuerName: string;

    createdAt: string;
    createdBy: string;

    validFrom: string;
    validUntil?: string;

    image: string;
    openBadgeId: string;

    revoked: boolean;
    revocationReason?: string;

    narrative?: string;

    reviewed_by?: string;
    reviewed_at?: string;

    recipient: ApiApprovalRecipient;

    evidence: any[];
}
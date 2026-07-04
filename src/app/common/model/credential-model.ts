export type CredentialType = "academic" | "degree" | "experience";

export interface CredentialModel {
    credentialId: string;

    achievementId: string;
    achievementType: string;
    achievementName: string;
    achievementDescription: string;
    achievementImage?: string | null;
    achievementCriteria?: CredentialCriteria;
    achievementAlignment?: CredentialAlignment[];
    achievementTag?: string[];

    recipientId: string;

    issuerDid: string;
    issuerName: string;
    universityId: string;

    revocationListId: string;
    revocationListIndex: number;

    validFrom: string;
    validUntil?: string | null;

    signature?: any;
    
    approvalStatus: "pending" | "approved" | "rejected";
    approvalOperation?: "issue" | "import" | null;
    revocationStatus: "none" | "pending" | "revoked";

    requestedBy: string;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
}

export interface CredentialCriteria {
    narrative?: string;
    id?: string;
}

export interface CredentialAlignment {
    target_name: string;
    target_url: string;
    target_description?: string;
    target_framework?: string;
    target_code?: string;
    target_type?: string;
}
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { BaseDialog } from '../base-dialog';
import { addQueryParamsToUrl } from '../../util/url-util';

@Component({
    selector: 'share-social-dialog',
    templateUrl: 'share-social-dialog.component.html'
})
export class ShareSocialDialog extends BaseDialog {

    options: ShareSocialDialogOptions | null = null;

    resolveFunc: () => void;
    rejectFunc: () => void;

    currentTabId: ShareSocialDialogTabId = "link";

    selectedRecipientType: "" | "email" | "studentId" = "";

    get currentShareUrl() {
        if (!this.options) {
            return "";
        }

        if (!this.selectedRecipientType) {
            return this.options.shareUrl;
        }

        const params = {};

        if (this.selectedRecipientType === "email") {
            params["identity__email"] = this.options.recipientEmail;
        } else {
            params["identity__studentId"] = this.options.recipientStudentId;
        }

        return addQueryParamsToUrl(this.options.shareUrl, params);
    }

    constructor(
        componentElem: ElementRef<HTMLElement>,
        renderer: Renderer2
    ) {
        super(componentElem, renderer);
    }

    openDialog(
        customOptions: ShareSocialDialogOptions
    ): Promise<void> {
        this.options = { ...customOptions };

        this.currentTabId = "link";
        this.selectedRecipientType = "";

        this.showModal();

        return new Promise<void>((resolve, reject) => {
            this.resolveFunc = resolve;
            this.rejectFunc = reject;
        });
    }

    closeDialog() {
        this.closeModal();
        this.resolveFunc();
    }

    openTab(tabId: ShareSocialDialogTabId) {
        this.currentTabId = tabId;
    }

    copySupported(): boolean {
        try {
            return document.queryCommandSupported("copy");
        } catch {
            return false;
        }
    }

    copyToClipboard(input: HTMLInputElement) {
        const wasDisabled = input.disabled;

        input.disabled = false;
        input.select();

        try {
            document.execCommand("copy");
        } finally {
            input.disabled = wasDisabled;
        }
    }
}

export interface ShareSocialDialogOptions {
    title: string;

    shareUrl: string;
    shareIdUrl: string;

    recipientEmail?: string;
    recipientStudentId?: string;

    showRecipientOptions?: boolean;
}

type ShareSocialDialogTabId = "link";